import { useState, useEffect } from 'react';

const useFetchReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 將 fetchReviews 定義為 useEffect 外部的函數
  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/product/product-list/reviews/${productId}`);
      if (!response.ok) throw new Error(`Failed to fetch reviews: ${response.status}`);
      
      const data = await response.json();
      console.log('Fetched reviews data:', data); // 調試輸出
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false); // 確保 loading 狀態設為 false
    }
  };

  useEffect(() => {
    if (productId) { // 確保 productId 已經存在
      fetchReviews();
    }
  }, [productId]); 

  // 將 fetchReviews 作為返回值的一部分傳出
  return { reviews, loading, fetchReviews };
};

export default useFetchReviews;
