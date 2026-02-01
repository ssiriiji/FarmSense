// src/context/FarmContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

const FarmContext = createContext();

export const FarmProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <FarmContext.Provider value={{
      user,
      setUser,
      login,
      logout,
      calculationResult,
      setCalculationResult
    }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within FarmProvider');
  }
  return context;
};