// 測試從資料庫拉資料出來
import React, { useState, useEffect } from 'react'

export default function Products(props) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/data/aa')
        if (!response.ok) {
          throw new Error('網路回應不成功：' + response.status)
        }
        const data = await response.json()
        setProducts(data)
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
            {product.product_name} <br />
            {'price: $' + product.price}
          </li>
        ))}
      </ul>
    </>
  )
}
