import { useState, useEffect } from 'react';
import { Inquiry } from '../types';

export const useInquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inquiries');
      const data = await response.json();

      if (data.success) {
        setInquiries(data.data);
      } else {
        setError(data.error || 'Failed to fetch inquiries');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (id: string, status: 'unread' | 'read' | 'contacted') => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        setInquiries(
          inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq))
        );
        return true;
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return { inquiries, loading, error, refetch: fetchInquiries, updateStatus };
};
