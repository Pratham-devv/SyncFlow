import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, signupUser, getMe } from '../api/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('sf_token');
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((res) => setUser(res.data.data))
      .catch(() => localStorage.removeItem('sf_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await loginUser(credentials);
    const { user: userData, accessToken } = res.data.data;
    localStorage.setItem('sf_token', accessToken);
    setUser(userData);
    return userData;
  }, []);

  const signup = useCallback(async (data) => {
    const res = await signupUser(data);
    return res.data.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sf_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
