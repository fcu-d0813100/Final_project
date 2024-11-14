// pages/card-home/index.js
import React, { useEffect, useState } from 'react'
import CardCarousel from '@/components/product/common/product-container1'
import CardCarousel2 from '@/components/product/common/product-container2'

const CardHomePage = () => {
  const [newArrivalProducts, setNewArrivalProducts] = useState([])
  const [popularProducts, setPopularProducts] = useState([])

  useEffect(() => {
    // Fetch 新品上市商品資料
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch(`http://localhost:3005/api/product/product-list?isNewArrivals=true&timestamp=${Date.now()}`)
        if (!response.ok) throw new Error('Failed to fetch new arrivals')
        const data = await response.json()
        setNewArrivalProducts(data)
      } catch (error) {
        console.error('Error fetching new arrivals:', error)
      }
    }
  // Fetch 人氣商品資料
  const fetchPopularProducts = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/product/product-list?isPopular=true&timestamp=${Date.now()}`)
      if (!response.ok) throw new Error('Failed to fetch popular products')
      const data = await response.json()
      setPopularProducts(data.slice(0, 8))
    } catch (error) {
      console.error('Error fetching popular products:', error)
    }
  }
    fetchNewArrivals()
    fetchPopularProducts()
  }, [])

  return (
    <div>
      <CardCarousel products={newArrivalProducts} />
      <hr />
      <CardCarousel2 products={popularProducts} />
    </div>
  )
}

export default CardHomePage
