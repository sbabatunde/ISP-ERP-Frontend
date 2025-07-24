import axios from 'axios';

const apiClient = axios.create({
    // baseURL: 'http://10.0.0.253:8000/api', // Laravel API base URL
    baseURL: 'http://localhost:8000/api', // Laravel API base URL
    // baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        // Accept: 'application/json',
    },
    // withCredentials: true, // Required for Laravel Sanctum
});

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
    const response = await apiClient.get('/inventory/equipment');
    return response.data?.data || [];
};

// Post equipment movement
export const postEquipmentMovement = async (formData) => {
    const response = await apiClient.post('/movements', formData);
    return response.data;
};

// Fetch suppliers list
export const fetchSuppliersList = async () => {
    const response = await apiClient.get('/inventory/suppliers/list');
    return response.data?.data || [];
};

// Create a new supplier
export const createSupplier = async (formData) => {
    const response = await apiClient.post('/inventory/suppliers/store', formData);
    return response.data;
};

// Update a supplier
export const updateSupplier = async (supplierData) => {
    const response = await apiClient.post('/inventory/suppliers/update', supplierData);
    return response.data;
};

// Create a new procurement
export const createProcurement = async (formData) => {
    const response = await apiClient.post('/inventory/procurements', formData);
    return response.data;
};

// Fetch equipment types for equipment form
export const fetchEquipmentTypes = async () => {
    const response = await apiClient.get('/inventory/equipment-type/list');
    return response.data?.type || [];
};

// Create a new equipment
export const createEquipment = async (formData) => {
    const response = await apiClient.post('/inventory/equipment', formData);
    return response.data;
};

// Create a new equipment type
export const createEquipmentType = async (formData) => {
    const response = await apiClient.post('/inventory/equipment-type/store', formData);
    return response.data;
};


// Fetch supplier details
export const fetchSupplierDetails = async (supplierId) => {
    const response = await apiClient.get(`/inventory/suppliers/${supplierId}`);
    return response.data?.data || {};
};

// Delete supplier data
export const deleteSupplierDetails = async (supplierId) =>{
    console.log(supplierId)
    const response = await apiClient.delete(`/inventory/suppliers/${supplierId}`)
    return response.data?.data 
}

// Fetch orders list
export const fetchOrdersList = async () => {
    const response = await apiClient.get('/inventory/procurements');
    return response.data || [];
};

// Fetch procurement details
export const fetchProcurementDetails = async (procurementId) => {
    const response = await apiClient.get(`/inventory/procurements/${procurementId}`);
    return response.data|| {};
};

// Fetch Individual Equipment Type Details
export const fetchIndividualEquipmentTypeDetails = async (equipmentTypeId) => {
    const response = await apiClient.get(`/inventory/equipment-type/${equipmentTypeId}`);
    return response.data || {};
};


export default apiClient;
