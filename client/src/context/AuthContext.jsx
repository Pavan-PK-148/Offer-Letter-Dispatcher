import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem('admin_session');
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      setUser(parsedSession.user);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      
      // Axios automatically parses JSON data into response.data
      if (response.data.success) {
        localStorage.setItem('admin_session', JSON.stringify({ 
          token: response.data.token, 
          user: response.data.user 
        }));
        setUser(response.data.user);
        return { success: true };
      }
    } catch (err) {
      // Direct extraction of custom controller messages sent via res.status().json()
      const fallbackMsg = err.response?.data?.message || 'Unable to communicate with the core system node.';
      return { success: false, message: fallbackMsg };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await API.post('/auth/signup', { name, email, password });

      if (response.data.success) {
        localStorage.setItem('admin_session', JSON.stringify({ 
          token: response.data.token, 
          user: response.data.user 
        }));
        setUser(response.data.user);
        return { success: true };
      }
    } catch (err) {
      const fallbackMsg = err.response?.data?.message || 'Failed to deploy configuration script onto node.';
      return { success: false, message: fallbackMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);