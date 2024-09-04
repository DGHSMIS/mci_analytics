export interface ESMciServiceLogInterface {
    timestamp: string;   // ISO String for timestamp
    level: string;       // Log level (e.g., info, error, debug)
    message: string;     // Log message
    request: any | null; // Request details (payload, headers, etc.)
    response: any | null; // Response details (status, body, etc.)
    service_name: string | null; // Name of the service generating the log
  }
  