import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

const useFetchReviews = (order_item_id, productId, colorId) => {
  const { auth } = useAuth(); // 從 useAuth 中獲取認證數據
  const currentUser = auth.user; // 當前用戶
  const [reviews, setReviews] = useState([]); // 儲存評論數據
  const [loading, setLoading] = useState(true); // 加載狀態

  console.log('useFetchReviews - productId:', productId, 'colorId:', colorId);

  // 定義 fetchReviews 函數，獲取評論數據
  const fetchReviews = async () => {
    console.log('auth.userData at fetchReviews:', auth.userData); // 查看加載時狀態
    try {
      const response = await fetch(`http://localhost:3005/api/product/product-list/reviews/${order_item_id}/${productId}/${colorId}`);
      if (!response.ok) throw new Error(`Failed to fetch reviews: ${response.status}`);
      
      const data = await response.json();
      console.log('Fetched reviews data:', data); // 調試輸出

      // 添加 isLiked 屬性，默認為 false
      const reviewsWithLikeStatus = data.map((review) => ({
        ...review,
        isLiked: false, // 默認未點讚
      }));

      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false); // 確保 loading 狀態設為 false
    }
  };

  // 點讚功能
  const handleLike = async (review_id, isLiked) => {
    console.log('auth.userData at handleLike:', auth.userData); // 檢查按讚時狀態
    if (!auth.isAuth || !auth.userData.id) {
      console.error('未登入用戶無法點讚');
      toast.error('請先登入後再進行操作');
      return;
    }
  
    try {
      const route = isLiked
        ? `http://localhost:3005/api/product/reviews/${review_id}/unlike`
        : `http://localhost:3005/api/product/reviews/${review_id}/like`;
  
      const response = await fetch(route, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: auth.userData.id }), // 傳遞當前用戶 ID
      });
  
      if (response.ok) {
        const data = await response.json(); // 從後端獲取最新數據
  
        // 更新前端的點讚狀態和數據
        const updatedReviews = reviews.map((review) =>
          review.review_id === review_id
            ? { ...review, review_likes: data.review_likes, isLiked: data.isLiked }
            : review
        );
  
        // setReviews(updatedReviews); // 更新評論數據
      } else {
        console.error('更新點讚狀態失敗');
      }
    } catch (error) {
      console.error('點讚時出錯:', error);
    }
  };
  
  


  // useEffect 用於監聽 order_item_id 並調用 fetchReviews
  useEffect(() => {
    console.log('useEffect triggered with order_item_id:', order_item_id); // 打印 order_item_id
    if (order_item_id) { // 確保 order_item_id 存在
      fetchReviews();
    }
  }, [order_item_id]);

  // 返回評論數據、加載狀態、fetchReviews 函數和 handleLike 函數
  return { reviews, loading, fetchReviews, handleLike };
};

export default useFetchReviews;
