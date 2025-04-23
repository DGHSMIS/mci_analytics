import { resolveClientDetailURLFromNameAndId } from "@utils/lib/apiList";
import { LRUCache } from "lru-cache";


/**
 * Interface representing basic client info fetched from external API.
 */
export interface ClientInfoInterface {
  id: string;
  client_name: string;
  hasApiError: boolean;
}

// LRU cache for client info
const clientCache = new LRUCache<number | string, ClientInfoInterface>({
  max: 1000,
  ttl: 12 * 60 * 60 * 1000, // 12 hours
});

/**
 * Fetches and caches client information by ID.
 * @param clientId The ID of the client to fetch.
 * @param showDebug Optional flag to log debug information.
 * @returns Promise resolving to ClientInfoInterface
 */
export default async function fetchAndCacheClientInfo(
  clientId: number | string,
  showDebug: boolean = false
): Promise<ClientInfoInterface> {
  if (showDebug) console.log("Cache size:", clientCache.size);
  if (showDebug) console.log("Fetching clientId:", clientId);

  // Validate clientId
  console.log("Validating clientId:", clientId);
  if (Number.isNaN(Number(clientId))) {
      return { id: String(clientId), client_name: "", hasApiError: true };
    }
    
    // Attempt cache lookup
    console.log("Attempt cache lookup");
  try {
    const cached = clientCache.get(clientId);
    if (cached) {
      if (showDebug) console.log("Cache hit for client:", cached);
      return cached;
    }
    console.log("Cache miss for clientId:", clientId);
  } catch (err) {
    if (showDebug) console.error("Cache access error:", err);
  }

  // Build API URL
    console.log("Building API URL");
  const url = resolveClientDetailURLFromNameAndId(
    "auth-get-client-by-id",
    clientId
  );
  if (showDebug) console.log("API URL:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      next: { revalidate: false },
      headers: {
        "X-Auth-Token":
          process.env.NEXT_X_AGENCY_USER_AUTH_TOKEN || "",
        "client-id":
          process.env.NEXT_X_AGENCY_USER_CLIENT_ID || "",
      },
    });

    if (response.status === 200) {
      const result = await response.json();
      const data = result.data || {};
      const clientInfo: ClientInfoInterface = {
        id: String(clientId),
        client_name: data.facility_name || "",
        hasApiError: false,
      };
      if (showDebug) console.log("Fetched client:", clientInfo);
      clientCache.set(clientId, clientInfo);
      return clientInfo;
    } else {
      if (showDebug) console.log(
        "API error status:",
        response.status
      );
      const errorInfo: ClientInfoInterface = {
        id: String(clientId),
        client_name: "",
        hasApiError: true,
      };
      clientCache.set(clientId, errorInfo);
      return errorInfo;
    }
  } catch (error) {
    if (showDebug) console.error("Fetch error:", error);
    const errorInfo: ClientInfoInterface = {
      id: String(clientId),
      client_name: "",
      hasApiError: true,
    };
    clientCache.set(clientId, errorInfo);
    return errorInfo;
  }
}
