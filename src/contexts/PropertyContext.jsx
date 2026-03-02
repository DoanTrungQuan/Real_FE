import React, { createContext, useContext, useState, useCallback } from 'react';
import { propertiesAPI, sellersAPI, statsAPI } from '../services/api';

const PropertyContext = createContext(null);

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Properties
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const data = await propertiesAPI.getAll();
      setProperties(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProperties = useCallback(async (filters) => {
    setLoading(true);
    try {
      const data = await propertiesAPI.search(filters);
      setProperties(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPropertyById = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await propertiesAPI.getById(id);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProperty = useCallback(async (propertyData) => {
    setLoading(true);
    try {
      const newProperty = await propertiesAPI.create(propertyData);
      setProperties(prev => [...prev, newProperty]);
      setError(null);
      return newProperty;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProperty = useCallback(async (id, propertyData) => {
    setLoading(true);
    try {
      const updated = await propertiesAPI.update(id, propertyData);
      setProperties(prev => prev.map(p => p.id === parseInt(id) ? updated : p));
      setError(null);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProperty = useCallback(async (id) => {
    setLoading(true);
    try {
      await propertiesAPI.delete(id);
      setProperties(prev => prev.filter(p => p.id !== parseInt(id)));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sellers
  const fetchSellers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await sellersAPI.getAll();
      setSellers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSeller = useCallback(async (sellerData) => {
    setLoading(true);
    try {
      const newSeller = await sellersAPI.create(sellerData);
      setSellers(prev => [...prev, newSeller]);
      setError(null);
      return newSeller;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSeller = useCallback(async (id, sellerData) => {
    setLoading(true);
    try {
      const updated = await sellersAPI.update(id, sellerData);
      setSellers(prev => prev.map(s => s.id === parseInt(id) ? updated : s));
      setError(null);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSeller = useCallback(async (id) => {
    setLoading(true);
    try {
      await sellersAPI.delete(id);
      setSellers(prev => prev.filter(s => s.id !== parseInt(id)));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await statsAPI.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const value = {
    properties,
    sellers,
    stats,
    loading,
    error,
    fetchProperties,
    searchProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    fetchSellers,
    createSeller,
    updateSeller,
    deleteSeller,
    fetchStats
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};