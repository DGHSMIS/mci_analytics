import https from "https";
import http from "http";
import { esBaseClient } from "@providers/elasticsearch/ESBase";
import { platformSyncStatsESIndexName } from "@providers/elasticsearch/constants";

export interface StoredPlatformStats {
  governmentOutdoorDispensaryCount: number;
  eAppointmentCount: number;
  lastSyncedAt?: string;
  status?: string;
}

// In-memory fallback
let memoryCachedStats: StoredPlatformStats = {
  governmentOutdoorDispensaryCount: 360,
  eAppointmentCount: 22272,
  lastSyncedAt: new Date().toISOString(),
  status: "initialized",
};

/**
 * Fetch JSON with Node's native https module (bypasses Docker/Undici SSL chain issues)
 */
function fetchJsonWithHttps(url: string, timeoutMs: number = 20000): Promise<any> {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith("https");
    const client = isHttps ? https : http;

    const req = client.get(
      url,
      {
        rejectUnauthorized: false,
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; DGHS-Analytics/1.0)",
        },
        timeout: timeoutMs,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (err) {
            reject(new Error(`Failed to parse JSON from ${url}: ${err instanceof Error ? err.message : err}`));
          }
        });
      }
    );

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Request to ${url} timed out after ${timeoutMs}ms`));
    });
  });
}

/**
 * Fetch Government Outdoor Dispensary count from remote
 */
async function fetchGovernmentOutdoorDispensaryRemote(): Promise<number> {
  try {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
    const url = `https://god-central.cmedhealth.com/openmrs/ws/dghs/api/hid/total-count?startDate=2026-01-01&endDate=${today}`;
    const res = await fetchJsonWithHttps(url, 20000);
    if (res && res.data && typeof res.data.totalCount === "number") {
      return res.data.totalCount;
    }
  } catch (err) {
    console.warn("[PlatformStatsSync] Remote fetch for Government Outdoor Dispensary failed:", err instanceof Error ? err.message : err);
  }
  return memoryCachedStats.governmentOutdoorDispensaryCount || 360;
}

/**
 * Fetch eAppointment count from remote
 */
async function fetchEAppointmentRemote(): Promise<number> {
  try {
    const url = "https://eappointment.dghs.gov.bd/api/v1/stats";
    const res = await fetchJsonWithHttps(url, 20000);
    if (res && typeof res.patients_all === "number") {
      return res.patients_all;
    }
  } catch (err) {
    console.warn("[PlatformStatsSync] Remote fetch for eAppointment failed:", err instanceof Error ? err.message : err);
  }
  return memoryCachedStats.eAppointmentCount || 22272;
}

export class PlatformStatsSyncService {
  /**
   * Ensure Elasticsearch index exists for platform sync stats
   */
  private static async ensureIndex(): Promise<void> {
    try {
      const exists = await esBaseClient.indices.exists({ index: platformSyncStatsESIndexName });
      if (!exists.body) {
        await esBaseClient.indices.create({
          index: platformSyncStatsESIndexName,
          body: {
            mappings: {
              properties: {
                governmentOutdoorDispensaryCount: { type: "long" },
                eAppointmentCount: { type: "long" },
                lastSyncedAt: { type: "date" },
                status: { type: "keyword" },
              },
            },
          },
        });
        console.info(`[PlatformStatsSync] Created Elasticsearch index: ${platformSyncStatsESIndexName}`);
      }
    } catch (err) {
      console.warn("[PlatformStatsSync] Could not verify/create ES index:", err instanceof Error ? err.message : err);
    }
  }

  /**
   * Sync remote stats and save directly to Elasticsearch
   */
  public static async syncStats(): Promise<StoredPlatformStats> {
    const [godCount, eAppCount] = await Promise.all([
      fetchGovernmentOutdoorDispensaryRemote(),
      fetchEAppointmentRemote(),
    ]);

    const updatedStats: StoredPlatformStats = {
      governmentOutdoorDispensaryCount: godCount,
      eAppointmentCount: eAppCount,
      lastSyncedAt: new Date().toISOString(),
      status: "synced",
    };

    memoryCachedStats = { ...updatedStats };

    try {
      await this.ensureIndex();
      await esBaseClient.index({
        index: platformSyncStatsESIndexName,
        id: "latest_summary",
        body: updatedStats,
        refresh: true,
      });
      console.info("[PlatformStatsSync] Successfully saved platform stats to Elasticsearch:", updatedStats);
    } catch (err) {
      console.warn("[PlatformStatsSync] Could not save stats to Elasticsearch (using in-memory cache):", err instanceof Error ? err.message : err);
    }

    return updatedStats;
  }

  /**
   * Retrieve platform stats from Elasticsearch (or in-memory cache if ES is unavailable)
   */
  public static async getStats(): Promise<StoredPlatformStats> {
    try {
      const doc = await esBaseClient.get({
        index: platformSyncStatsESIndexName,
        id: "latest_summary",
      });

      if (doc?.body?._source) {
        const source = doc.body._source as StoredPlatformStats;
        if (
          typeof source.governmentOutdoorDispensaryCount === "number" &&
          typeof source.eAppointmentCount === "number"
        ) {
          memoryCachedStats = { ...source };
          return source;
        }
      }
    } catch (err: any) {
      // If document not found (404), trigger first sync
      if (err?.meta?.statusCode === 404 || err?.statusCode === 404 || err?.name === "ResponseError") {
        console.info("[PlatformStatsSync] Stats not found in ES, performing initial sync...");
        return await this.syncStats();
      }
      console.warn("[PlatformStatsSync] Error reading stats from ES, falling back:", err?.message || err);
    }

    return memoryCachedStats;
  }
}
