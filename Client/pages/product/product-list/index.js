import ProductPage from '@/components/product/common/product-list'
import React, { useState, useEffect } from 'react'

const ProductList = () => {
  const [products, setProducts] = useState([])

  // 獲取所有商品
  const fetchAllProducts = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/product/product-list')
      if (!response.ok) throw new Error('網路回應不成功：' + response.status)
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      console.log(err)
    }
  }

  // 根據 main_category_id 獲取商品
  const fetchProductsByCategory = async (mainCategoryId) => {
    try {
      const response = await fetch(`http://localhost:3005/api/product/product-list/category/${mainCategoryId}`)
      if (!response.ok) throw new Error('網路回應不成功：' + response.status)
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      console.log(err)
    }
  }

  // 根據 main_category_id 和 sub_category_id 獲取商品
  const fetchProductsBySubCategory = async (mainCategoryId, subCategoryId) => {
    try {
      const response = await fetch(`http://localhost:3005/api/product/product-list/category/${mainCategoryId}/${subCategoryId}`)
      if (!response.ok) throw new Error('網路回應不成功：' + response.status)
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      console.log(err)
    }
  }

  // 獲取新品上市商品
  const fetchNewArrivals = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/product/product-list/new-arrivals')
      if (!response.ok) throw new Error('網路回應不成功：' + response.status)
      const data = await response.json()
      setProducts(data) // 更新產品列表為新品上市的產品
    } catch (err) {
      console.log(err)
    }
  }

  // 獲取 NARS 折扣商品
  const fetchNarsDiscountProducts = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/product/product-list/discount/nars') // 調用新的 NARS 折扣路由
      if (!response.ok) throw new Error('網路回應不成功：' + response.status)
      const data = await response.json()
      setProducts(data) // 更新產品列表為 NARS 折扣商品
    } catch (err) {
      console.log(err)
    }
  }

   // 根據價格範圍篩選商品
   const fetchFilteredProductsByPrice = async (minPrice, maxPrice) => {
    try {
      const range = `${minPrice}-${maxPrice === 9999999 ? '' : maxPrice}`
      const response = await fetch(`http://localhost:3005/api/product/product-list/price-range/${range}`)
      if (!response.ok) throw new Error('網路回應不成功：' + response.status)
      const data = await response.json()
      setProducts(data) // 更新產品列表為篩選後的產品
    } catch (error) {
      console.error("Error fetching filtered products:", error)
    }
  }

  // 根據品牌篩選商品
  const fetchProductsByBrand = async (brandName) => {
    try {
      const response = await fetch(`http://localhost:3005/api/product/product-list/brand/${brandName}`)
      if (!response.ok) throw new Error('網路回應不成功：' + response.status)
      const data = await response.json()
      setProducts(data) // 更新產品列表為篩選後的品牌商品
    } catch (error) {
      console.error("Error fetching products by brand:", error)
    }
  }

  // 根據關鍵字搜尋商品
const fetchProductsByKeyword = async (keyword) => {
  try {
    const response = await fetch(`http://localhost:3005/api/product/product-list/search/${keyword}`)
    if (!response.ok) throw new Error('網路回應不成功：' + response.status)
    const data = await response.json()
    setProducts(data) // 更新產品列表為關鍵字搜尋結果

    // 回傳標記，表示結果為空，讓toast根據此展示
    return data.length === 0;
  } catch (error) {
    console.error("Error fetching products by keyword:", error)
  }
}


  // 加載所有商品
  useEffect(() => {
    fetchAllProducts()
  }, [])

  return (
    <div>
      {/* 將篩選函數作為 prop 傳遞給 ProductPage */}
      <ProductPage
        products={products}
        onAll={fetchAllProducts}
        onCategoryClick={fetchProductsByCategory}
        onSubCategoryClick={fetchProductsBySubCategory}
        onNewArrivalsClick={fetchNewArrivals}
        onNarsDiscountClick={fetchNarsDiscountProducts} // 傳遞 fetchNarsDiscountProducts 函數
        onPriceFilterClick={fetchFilteredProductsByPrice} // 傳遞價格篩選函數
        onBrandFilterClick={fetchProductsByBrand} // 傳遞品牌篩選函數
        onKeywordSearch={fetchProductsByKeyword} // 傳遞關鍵字搜尋函數
      />
    </div>
  )
}

export default ProductList
