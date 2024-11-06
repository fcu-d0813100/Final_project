// pages/card-home/index.js
import ProductPage from '@/components/product/common/product-list';
import React, { useState, useEffect } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  // 函數：獲取所有商品
  const fetchAllProducts = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/product/product-list');
      if (!response.ok) throw new Error('網路回應不成功：' + response.status);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  // 函數：根據 main_category_id 獲取商品
  const fetchProductsByCategory = async (mainCategoryId) => {
    try {
      const response = await fetch(`http://localhost:3005/api/product/product-list/category/${mainCategoryId}`);
      if (!response.ok) throw new Error('網路回應不成功：' + response.status);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  // 函數：根據 main_category_id 獲取商品
  const fetchProductsBySubCategory = async (mainCategoryId, subCategoryId) => {
    try {
      const response = await fetch(`http://localhost:3005/api/product/product-list/category/${mainCategoryId}/${subCategoryId}`);
      if (!response.ok) throw new Error('網路回應不成功：' + response.status);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  // 加載所有商品
  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div>
      {/* 將篩選函數作為 prop 傳遞給 ProductPage */}
      <ProductPage products={products} onAll={fetchAllProducts} onCategoryClick={fetchProductsByCategory} onSubCategoryClick={fetchProductsBySubCategory}/>
    </div>
  );
};

export default ProductList;
