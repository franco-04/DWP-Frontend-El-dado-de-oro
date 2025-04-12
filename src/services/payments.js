// src/services/payments.js
import api from './api';

// Crear una nueva orden de PayPal
export const createPayPalOrder = async (paqueteId) => {
  try {
    const response = await api.post('/api/payments/create-order', { paqueteId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al crear la orden');
  }
};

// Capturar el pago de una orden
export const capturePayPalOrder = async (orderId) => {
  try {
    const response = await api.post('/api/payments/capture-order', { orderId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al procesar el pago');
  }
};

// Obtener el saldo de fichas del usuario
export const getUserFichas = async () => {
  try {
    const response = await api.get('/api/user/fichas');
    return {
      data: {
        fichas: response.data.fichas || 0 // Asegurar valor por defecto
      }
    };
  } catch (error) {
    console.error('Error getting fichas:', error);
    return { data: { fichas: 0 }}; // Devuelve un valor seguro
  }
};

// Obtener historial de transacciones
export const getTransactions = async () => {
  try {
    const response = await api.get('/api/user/transactions');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al obtener transacciones');
  }
};


// services/payments.js
export const deductFichas = async (amount) => {
  try {
    const response = await api.post('/api/user/deduct-fichas', { amount });
    if (!response.data.fichas && response.data.fichas !== 0) {
      throw new Error('Respuesta inválida del servidor');
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al deducir fichas');
  }
};