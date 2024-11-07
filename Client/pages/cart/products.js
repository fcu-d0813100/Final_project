import React, { useState, useEffect } from 'react'
import { useCartProduct } from '@/hooks/use-cartP'

export default function Products(props) {
  const [products, setProducts] = useState([])
  const { onAddProduct } = useCartProduct()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/data/aa')
        if (!response.ok) {
          throw new Error('網路回應不成功：' + response.status)
        }
        const data = await response.json()
        setProducts(data)
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <div>products</div>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <br />
            {product.brand_name}
            <br />
            {product.product_name}
            <br />
            {product.color_id}
            <br />
            {'price: $' + product.price}
            <br />
            {product.color}
            <br />
            {product.mainimage}
            <br />
            {/* 傳入商品資訊到 onAddProduct */}
            <button onClick={() => onAddProduct(product)}>加入</button>
          </li>
        ))}
      </ul>
    </>
  )
}
