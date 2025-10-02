import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/medicines';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject({ message: 'Request timeout. Please try again.' });
    }
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.status, error.response.data);
      return Promise.reject({
        status: error.response.status,
        message: error.response.data.message || 'Server error occurred',
        data: error.response.data
      });
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'Unable to connect to server. Please check if backend is running on port 5000.',
        isNetworkError: true
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// Validation helper function
function validateMedicineData(data, isUpdate = false) {
  // Check required fields for new medicine
  if (!isUpdate) {
    if (!data.medicineId || data.medicineId.trim() === '') {
      return 'Medicine ID is required';
    }
    if (!data.name || data.name.trim() === '') {
      return 'Medicine name is required';
    }
    if (!data.manufacturer || data.manufacturer.trim() === '') {
      return 'Manufacturer is required';
    }
  }

  // Validate expiry date
  if (data.expiryDate) {
    const expiryDate = new Date(data.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    if (isNaN(expiryDate.getTime())) {
      return 'Invalid expiry date format';
    }
    
    if (expiryDate < today) {
      return 'Cannot add/update medicine with expired date. Please choose a future date.';
    }
  }

  // Validate stock
  if (data.stock !== undefined && data.stock !== '') {
    const stock = parseInt(data.stock);
    if (isNaN(stock) || stock < 0) {
      return 'Stock must be a positive number';
    }
    if (stock < 10) {
      // This is a warning, not an error - will be handled in UI
      console.warn('Warning: Stock is below recommended threshold (10)');
    }
  }

  // Validate price
  if (data.price !== undefined && data.price !== '') {
    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) {
      return 'Price must be a positive number';
    }
  }

  return null; // No validation errors
}

// API Service Methods
const medicineService = {
  // Health check
  checkConnection: async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/medicines/all');
      return { connected: true, status: response.status };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  },

  // Get all medicines
  getAllMedicines: async () => {
    try {
      const response = await api.get('/all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add new medicine with validation
  addMedicine: async (medicineData) => {
    try {
      // Client-side validation
      const validationError = validateMedicineData(medicineData);
      if (validationError) {
        throw { message: validationError, isValidationError: true };
      }

      const response = await api.post('/add', medicineData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search medicine by name
  searchMedicine: async (name) => {
    try {
      if (!name || name.trim() === '') {
        throw { message: 'Please enter a medicine name to search', isValidationError: true };
      }
      const response = await api.get(`/search?name=${encodeURIComponent(name.trim())}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get medicine by ID
  getMedicineById: async (id) => {
    try {
      if (!id) {
        throw { message: 'Medicine ID is required', isValidationError: true };
      }
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update medicine with validation
  updateMedicine: async (id, updateData) => {
    try {
      if (!id) {
        throw { message: 'Medicine ID is required', isValidationError: true };
      }
      const validationError = validateMedicineData(updateData, true);
      if (validationError) {
        throw { message: validationError, isValidationError: true };
      }
      const response = await api.put(`/update/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update stock with validation
  updateStock: async (id, quantity, operation) => {
    try {
      if (!id) {
        throw { message: 'Medicine ID is required', isValidationError: true };
      }
      if (!quantity || quantity <= 0) {
        throw { message: 'Quantity must be greater than 0', isValidationError: true };
      }
      if (!['add', 'subtract'].includes(operation)) {
        throw { message: 'Operation must be "add" or "subtract"', isValidationError: true };
      }
      const response = await api.patch(`/stock/${id}`, { quantity, operation });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get expired medicines
  getExpiredMedicines: async () => {
    try {
      const response = await api.get('/expired/list');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get low stock medicines with threshold
  getLowStockMedicines: async (threshold = 50) => {
    try {
      if (threshold < 0) {
        throw { message: 'Threshold must be a positive number', isValidationError: true };
      }
      const response = await api.get(`/lowstock/list?threshold=${threshold}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete expired medicines
  deleteExpiredMedicines: async () => {
    try {
      const response = await api.delete('/deleteExpired');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete medicine by ID
  deleteMedicine: async (id) => {
    try {
      if (!id) {
        throw { message: 'Medicine ID is required', isValidationError: true };
      }
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default medicineService;
