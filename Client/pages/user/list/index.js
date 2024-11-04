import React, { useState, useEffect } from 'react'
import Link from 'next/link'
// [
//   {
//     id: 1,
//     picture: 'https://via.placeholder.com/150',
//     stock: 5,
//     name: 'iPhone 12 Pro',
//     price: 25000,
//     tags: '蘋果,大螢幕',
//   },
//   {
//     id: 2,
//     picture: 'https://via.placeholder.com/150',
//     stock: 5,
//     name: 'iPhone 12',
//     price: 15000,
//     tags: '蘋果,小螢幕',
//   },
// ]

// 路由: `/user/list`
export default function List(props) {
  const [products, setProducts] = useState([])

  // 向伺服器獲取資料
  const getProducts = async () => {
    const baseURL = 'http://localhost:3005/api/user'

    // try catch
    try {
      const res = await fetch(baseURL)
      const resData = await res.json()
      console.log(resData)

      if (resData.status === 'success' && Array.isArray(resData.data.users)) {
        setProducts(resData.data.users)
      } else {
        console.warn('資料類型錯誤')
      }
    } catch (e) {
      console.warn(e)
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <>
      <h1>會員列表</h1>
      <ul>
        {products.map((user) => {
          return (
            <li key={user.id}>
              <Link href={`/user/list/${user.id}`}>{user.name}</Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}
