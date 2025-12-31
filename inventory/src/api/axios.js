import axios from "axios";
import { CustomToast } from "@/components/customToast";

const apiClient = axios.create({
  // baseURL: "http://10.0.0.253:8000/api", // Laravel API base URL
  baseURL: import.meta.env.VITE_API_URL, // Laravel API base URL
  // baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    "Content-Type": "application/json",
    // Accept: 'application/json',
  },
  // withCredentials: true, // Required for Laravel Sanctum
});

const n8nClient = axios.create({
  baseURL: "http://10.0.0.253:5678/webhook/procurement",
  headers: {
    "Content-Type": "application/json",
  },
});
export const sendDataToN8N = async (data) => {
  console.log(data);
  const response = await n8nClient.post("/", data);
  return response.data;
};

// Function to fetch CSRF token before making requests
// export const getCsrfToken = async () => {
//     await apiClient.get('/sanctum/csrf-cookie'); // Laravel sets the XSRF-TOKEN cookie
// };

// // Attach CSRF token from cookies (optional)
// apiClient.interceptors.request.use((config) => {
//     const token = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));
//     if (token) {
//         config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token.split('=')[1]);
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

// Fetch equipment list
export const fetchEquipmentList = async () => {
  const response = await apiClient.get("/inventory/equipment");
  return response.data?.data || [];
};

export const fetchGeneralReports = async () => {
  const response = await apiClient.get("/inventory/reports/summary");
  return response.data || [];
};

export const fetchVendorReports = async () => {
  const response = await apiClient.get("/inventory/reports/suppliers");
  return response.data || [];
};

export const fetchRepairReports = async () => {
  const response = await apiClient.get("/inventory/reports/repairs");
  return response.data || [];
};

export const fetchProcurementReports = async () => {
  const response = await apiClient.get("/inventory/reports/procurements");
  return response.data || [];
};

export const fetchMovementReports = async () => {
  const response = await apiClient.get("/inventory/reports/movements");
  return response.data || [];
};
// Post equipment repair
export const postEquipmentRepair = async (formData) => {
  const response = await apiClient.post(
    "/inventory/equipment-repairs",
    formData,
  );
  return response.data;
};

//Get equipment repair
export const fetchRepairList = async () => {
  const response = await apiClient.get("/inventory/equipment-repairs");
  return response;
};

// Post equipment movement
export const postEquipmentMovement = async (formData) => {
  // const response = await apiClient.post(
  //   "/inventory/equipment-movements",
  //   formData,
  // );
  // console.log(response.data);
  // return response.data;
  return apiClient
    .post("/inventory/equipment-movements", formData)
    .then((response) => {
      // send data to n8n and wait for that to complete before resolving
      return sendDataToN8N([
        {
          ...response.data,
          type: "movement",
        },
      ])
        .then(() => response.data)
        .catch((err) => {
          // Log n8n errors but still resolve with the procurement response
          console.error("Error sending movement to n8n:", err);
          return response.data;
        });
    })
    .catch((error) => {
      console.error("Error creating movement:", error);
      // rethrow so callers can handle the error
      throw error;
    });
};

// Fetch equipment movement list
export const fetchEquipmentMovementList = async () => {
  const response = await apiClient.get("/inventory/equipment-movements");
  return response.data?.data || [];
};

// Update equipment movement status
export const updateEquipmentMovementStatus = async (movementId, status) => {
  const response = await apiClient.put(
    `/inventory/equipment-movements/${movementId}`,
    status,
  );
  return response.data;
};

// Fetch Equipment By Location
export const fetchEquipmentByLocation = async () => {
  const response = await apiClient.get("/inventory/equipment/by-locations");
  return response.data?.data || [];
};

// Fetch suppliers list
export const fetchSuppliersList = async () => {
  const response = await apiClient.get("/inventory/suppliers/list");
  return response.data?.data || [];
};

// Create a new supplier
export const createSupplier = async (formData) => {
  const response = await apiClient.post("/inventory/suppliers/store", formData);
  return response.data;
};

// Update a supplier
export const updateSupplier = async (supplierData) => {
  const response = await apiClient.post(
    "/inventory/suppliers/update",
    supplierData,
  );
  return response.data;
};

// Create a new procurement
export const createProcurement = (formData) => {
  return apiClient
    .post("/inventory/procurements", formData)
    .then((response) => {
      // send data to n8n and wait for that to complete before resolving
      return sendDataToN8N([
        {
          ...response.data,
          type: "procurement",
        },
      ])
        .then(() => response.data)
        .catch((err) => {
          // Log n8n errors but still resolve with the procurement response
          console.error("Error sending procurement to n8n:", err);
          return response.data;
        });
    })
    .catch((error) => {
      console.error("Error creating procurement:", error);
      // rethrow so callers can handle the error
      throw error;
    });
};

// Fetch equipment types for equipment form
export const fetchEquipmentTypes = async () => {
  const response = await apiClient.get("/inventory/equipment-type/list");
  return response.data?.type || [];
};

// Create a new equipment
export const createEquipment = async (formData) => {
  const response = await apiClient.post("/inventory/equipment", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log(response.data);
  return response.data;
};

export const newCreateEquipment = async (formData) => {
  const response = await apiClient.post(
    "inventory/equipment/assign",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};

// Create a new equipment type
export const createEquipmentType = async (formData) => {
  const response = await apiClient.post(
    "/inventory/equipment-type/store",
    formData,
  );
  return response.data;
};

// Create a new tool type
export const createToolType = async (formData) => {
  const response = await apiClient.post("/inventory/tool-types", formData);
  return response.data;
};

// Create a new tool
export const createTool = async (formData) => {
  const response = await apiClient.post("/inventory/tool-items", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Fetch tool list
export const fetchToolList = async () => {
  const response = await apiClient.get("/inventory/tool-items");
  return response.data?.data || [];
};

// Fetch tool types for tool form
export const fetchToolTypes = async () => {
  const response = await apiClient.get("/inventory/tool-types");
  // console.log(response.data.data);
  return response.data?.data || [];
};

// Fetch supplier details
export const fetchSupplierDetails = async (supplierId) => {
  const response = await apiClient.get(`/inventory/suppliers/${supplierId}`);
  return response.data?.data || {};
};

// Delete supplier data
export const deleteSupplierDetails = async (supplierId) => {
  console.log(supplierId);
  const response = await apiClient.delete(`/inventory/suppliers/${supplierId}`);
  return response.data?.data;
};

// Fetch orders list
export const fetchOrdersList = async () => {
  const response = await apiClient.get("/inventory/procurements");
  return response.data || [];
};

// Fetch procurement details
export const fetchProcurementDetails = async (procurementId) => {
  const response = await apiClient.get(
    `/inventory/procurements/${procurementId}`,
  );
  return response.data || {};
};

// Fetch all procurements
export const fetchAllProcurements = async () => {
  const response = await apiClient.get("/inventory/procurements");
  return response.data || [];
};

// Fetch Individual Equipment Type Details
export const fetchIndividualEquipmentTypeDetails = async (equipmentTypeId) => {
  const response = await apiClient.get(
    `/inventory/equipment-type/${equipmentTypeId}`,
  );
  return response.data || {};
};

// Fetch locations
export const fetchLocations = async () => {
  const response = await apiClient.get("/inventory/locations");
  console.log(response.data);
  return response.data;
};

//  Create locations
export const createLocation = async (location) => {
  const response = await apiClient.post("/inventory/locations", location);
  console.log(response.data.data);
  return response.data.data;
};

// Fetch users list
export const fetchUsersList = async () => {
  const response = await apiClient.get(`/inventory/users`);
  return response.data.data || [];
};

// Fetch store list
export const fetchStoreList = async () => {
  const response = await apiClient.get(`/inventory/stores/index`);
  return response.data.data || [];
};

// fetch dashboard stats
export const fetchDashboardStats = async () => {
  const response = await apiClient.get(`/inventory/dashboard`);
  return response.data.dashboard || {};
};

export default apiClient;

// Global toast handling for POST requests only
apiClient.interceptors.response.use(
  (response) => {
    try {
      if (response?.config?.method === "post") {
        const message =
          response?.data?.message || "Request completed successfully";
        CustomToast("Success", message, "success");
      }
    } catch (err) {
      // no-op for toast errors
    }
    return response;
  },
  (error) => {
    try {
      const method = error?.config?.method;
      if (method === "post") {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";
        CustomToast("Error", message, "error");
      }
    } catch (err) {
      // no-op for toast errors
    }
    return Promise.reject(error);
  },
);
