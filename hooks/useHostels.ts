import { useState, useEffect } from 'react';
import { Hostel } from '../types';

export const useHostels = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hostels');
      const data = await response.json();

      if (data.success) {
        setHostels(data.data);
      } else {
        setError(data.error || 'Failed to fetch hostels');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const deleteHostel = async (id: string) => {
    try {
      const response = await fetch(`/api/hostels/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setHostels(hostels.filter((h) => h.id !== id));
        return true;
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return { hostels, loading, error, refetch: fetchHostels, deleteHostel };
};
