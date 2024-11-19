import { useRouter } from 'next/router';
import ProductPage from '@/components/product/common/product-list';
import React, { useState, useEffect } from 'react';

const ProductList = () => {
  const router = useRouter();
  const { main_category, sub_category, brand } = router.query; // 獲取 url 參數

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isNewArrivals, setIsNewArrivals] = useState(false);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [filterToggle, setFilterToggle] = useState(false);

  // 根據 URL 參數設定初始篩選條件
  useEffect(() => {
    setSelectedCategory(main_category ? parseInt(main_category) : null);
    setSelectedSubCategory(sub_category ? parseInt(sub_category) : null);
    setSelectedBrand(brand || null);
  }, [main_category, sub_category, brand]);

  // 篩選函數
  const applyFilters = async () => {
    try {
      // let apiUrl = 'http://localhost:3005/api/product/product-list';
      let baseUrl = 'http://localhost:3005/api/product/product-list';

      // 動態生成查詢參數
      const params = new URLSearchParams();
      if (selectedCategory) params.append('main_category_id', selectedCategory);
      if (selectedSubCategory) params.append('sub_category_id', selectedSubCategory);
      if (selectedPriceRange) {
        params.append('minPrice', selectedPriceRange.min);
        params.append('maxPrice', selectedPriceRange.max);
      }
      if (selectedBrand) params.append('brand', selectedBrand);
      if (isNewArrivals) params.append('isNewArrivals', 'true');
      if (isDiscounted) params.append('isDiscounted', 'true');
      if (filterToggle === 'popular') params.append('isPopular', 'true');

      // apiUrl += `?${params.toString()}`;

      // 使用 URLSearchParams.toString() 構建查詢字符串，這樣就不會出現重複的參數
    const queryString = params.toString();
    const apiUrl = `${baseUrl}?${queryString}`;
    console.log('Requesting API with URL:', apiUrl);

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('網路回應不成功：' + response.status);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  // 當篩選條件改變時應用篩選
  useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedSubCategory, selectedPriceRange, selectedBrand, isNewArrivals, isDiscounted, filterToggle]);

  // 當選擇主要分類時
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(null);
    setSelectedPriceRange(null);
    setSelectedBrand(null);
    setIsNewArrivals(false);
    setIsDiscounted(false);
  };

  // 當選擇子分類時
  const handleSubCategorySelect = (mainCategoryId, subCategoryId) => {
    setSelectedCategory(mainCategoryId);
    setSelectedSubCategory(subCategoryId);
    setSelectedPriceRange(null);
    setSelectedBrand(null);
    setIsNewArrivals(false);
    setIsDiscounted(false);
  };

  // 當選擇價格範圍時
  const handlePriceSelect = (minPrice, maxPrice) => {
    setSelectedPriceRange({ min: minPrice, max: maxPrice });
    // 這裡不重置其他篩選函數，才能達到複合篩選
  };

  // 當選擇品牌時
  const handleBrandSelect = (brandName) => {
    if (selectedBrand !== brandName) {
      setSelectedBrand(brandName);
    }
    // 這裡不重置其他篩選函數，才能達到複合篩選
  };

  // 新品上市
  const handleNewArrivalsClick = () => {
    setIsNewArrivals(true);
    setIsDiscounted(false);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedPriceRange(null);
    setSelectedBrand(null);
  };

  // 人氣商品篩選
  const handlePopularClick = () => {
  setIsNewArrivals(false);
  setIsDiscounted(false);
  setSelectedCategory(null);
  setSelectedSubCategory(null);
  setSelectedPriceRange(null);
  setSelectedBrand(null);
  setFilterToggle('popular'); // 設置為人氣商品篩選
};


  // 優惠商品
  const handleDiscountClick = () => {
    setIsDiscounted(true);
    setIsNewArrivals(false);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedPriceRange(null);
    setSelectedBrand(null);

  };

  // 加載所有商品，並重置所有篩選條件
  const fetchAllProducts = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/product/product-list');
      if (!response.ok) throw new Error('網路回應不成功：' + response.status);
      const data = await response.json();
      setProducts(data);
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setSelectedPriceRange(null);
      setSelectedBrand(null);
      setIsNewArrivals(false);
      setIsDiscounted(false);
      setFilterToggle(false);
      // setFilterToggle(false);
    } catch (err) {
      console.log(err);
    }
  };

  // 根據關鍵字搜尋商品
  const fetchProductsByKeyword = async (keyword) => {
    try {
      const response = await fetch(`http://localhost:3005/api/product/product-list/search/${keyword}`);
      if (!response.ok) throw new Error('網路回應不成功：' + response.status);
      const data = await response.json();
      setProducts(data);
      return data.length === 0;
    } catch (error) {
      console.error("Error fetching products by keyword:", error);
    }
  };

  return (
    <div>
      <ProductPage
        products={products}
        onAll={fetchAllProducts}
        onCategoryClick={handleCategorySelect}
        onSubCategoryClick={handleSubCategorySelect}
        onNewArrivalsClick={handleNewArrivalsClick}
        onNarsDiscountClick={handleDiscountClick}
        onPriceFilterClick={handlePriceSelect}
        onBrandFilterClick={handleBrandSelect}
        onKeywordSearch={fetchProductsByKeyword}
        onHandlePopularClick={handlePopularClick}
      />
    </div>
  );
};

export default ProductList;
