import { useState, useEffect } from 'react';

interface Discount {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'FIXED_AMOUNT' | 'PERCENTAGE';
  value: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  maxUsage: number;
  currentUsage: number;
  createdAt: string;
}

export const useDiscounts = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch('/api/discounts');
        if (!response.ok) throw new Error('Failed to fetch discounts');
        const data = await response.json();
        setDiscounts(data.filter((discount: Discount) => discount.isActive));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  return { discounts, loading, error };
};
