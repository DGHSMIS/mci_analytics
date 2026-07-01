Viewed page.tsx:1-55
Viewed PublicDbClientWrapper.tsx:1-235
Viewed FacilityServiceOverview.tsx:1-88
Viewed pbdClientServiceProvider.ts:1-135
Viewed utilityFunctions.ts:1-583

To fetch the statistics for **Top Clinical Record Provider**, **Top Male Registering Facilities**, and **Top Female Registering Facilities** from the Public Dashboard, a single API is called.

### **API Details for Postman**

*   **Domain:** `https://pdb.mohfw.gov.bd/`
*   **Endpoint:** `/api/es/analytics/patient/get-top-registrar-facilities`
*   **Method:** `GET`
*   **Full URL Example:**
    `https://pdb.mohfw.gov.bd/api/es/analytics/patient/get-top-registrar-facilities?dateFrom=2024-05-04T00:00:00.000&dateTo=2024-05-11T23:59:59.000`

### **Query Parameters**

| Parameter | Type | Required | Description | Format |
| :--- | :--- | :--- | :--- | :--- |
| `dateFrom` | String | Yes | Starting date of the range | `YYYY-MM-DDTHH:mm:ss.sss` |
| `dateTo` | String | Yes | Ending date of the range | `YYYY-MM-DDTHH:mm:ss.sss` |
| `divisionId`| String | No | Filter by specific division (optional) | e.g., `30` |

### **Response Structure**
The API returns an **array of 4 objects**. Each object represents one of the ranked lists displayed on the home page:

1.  **Index `[0]`**: Top HID Providers (Registrar Facilities)
2.  **Index `[1]`**: **Top Clinical Record Provider** 
3.  **Index `[2]`**: **Top Male Registering Facilities**
4.  **Index `[3]`**: **Top Female Registering Facilities**

### **Implementation Context**
*   **Backend Logic:** The route handler is located at `/app/api/es/analytics/patient/get-top-registrar-facilities/route.ts`. It aggregates data from multiple Elasticsearch queries (patient registration index and encounter index) into a single response.
*   **Frontend Component:** The home page calls this via the `FacilityServiceOverview` component (located in `app/components/publicDashboard/sections/facilityServiceOverview/FacilityServiceOverview.tsx`).