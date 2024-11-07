import ProductPage from '@/components/product/pages/product-page';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function App() {
  const [productPage, setProductPage] = useState({});
  const router = useRouter();
  const { cid } = router.query;

  useEffect(() => {
    // 確保 router 已經準備好並且 cid 存在
    if (router.isReady && cid) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:3005/api/product/product-list/${cid}`);
          if (!response.ok) {
            throw new Error('網路回應不成功：' + response.status);
          }
          const data = await response.json();
          setProductPage(data);
          console.log("Fetched data:", data);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      };

      fetchData();
    }
  }, [router.isReady, cid]); // 當 `router.isReady` 和 `cid` 有效時執行請求

  if (!productPage || Object.keys(productPage).length === 0) {
    return <div>Loading...</div>; // 顯示加載中的訊息
  }

  return (
    <div className="App">
      <ProductPage productPage={productPage} /> {/* 將 productPage 傳遞給 ProductPage */}
    </div>
  );
}

export default App;
