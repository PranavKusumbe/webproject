import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/medicines';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Service Methods
const medicineService = {
  // Get all medicines
  getAllMedicines: async () => {
    try {
      const response = await api.get('/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add new medicine
  addMedicine: async (medicineData) => {
    try {
      const response = await api.post('/add', medicineData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search medicine by name
  searchMedicine: async (name) => {
    try {
      const response = await api.get(`/search?name=${name}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get medicine by ID
  getMedicineById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update medicine
  updateMedicine: async (id, updateData) => {
    try {
      const response = await api.put(`/update/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update stock
  updateStock: async (id, quantity, operation) => {
    try {
      const response = await api.patch(`/stock/${id}`, { quantity, operation });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get expired medicines
  getExpiredMedicines: async () => {
    try {
      const response = await api.get('/expired/list');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get low stock medicines
  getLowStockMedicines: async (threshold = 50) => {
    try {
      const response = await api.get(`/lowstock/list?threshold=${threshold}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete expired medicines
  deleteExpiredMedicines: async () => {
    try {
      const response = await api.delete('/deleteExpired');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete medicine by ID
  deleteMedicine: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default medicineService;
