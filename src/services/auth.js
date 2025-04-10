import api from './api';

// Funciones para registro
export const checkUsername = async (username) => {
  try {
    const response = await api.post('/api/auth/check-username', { username });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error verificando usuario');
  }
};

export const checkEmail = async (email) => {
  try {
    const response = await api.post('/api/auth/check-email', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error verificando email');
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error en el registro');
  }
};

export const verifyRegistration = async (email, token) => {
  try {
    const response = await api.post('/api/auth/verify-registration', { email, token });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error verificando código');
  }
};

// Funciones para login (nuevas)
export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/api/auth/login', credentials);
        
        if (response.data.requiresMFA) {
            return { requiresMFA: true };
        }
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
        
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Credenciales inválidas');
    }
};

export const verifyMFA = async (mfaData) => {
    try {
        const response = await api.post('/api/auth/verify-mfa', mfaData);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Error de conexión';
        throw new Error(message);
    }
};