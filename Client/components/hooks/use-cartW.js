import React, { useState, useEffect, createContext, useContext } from 'react'

const CartWorkshopContext = createContext(null)
CartWorkshopContext.displayName = 'CartWorkshopContext'

export function CartWorkshopProvider({ children }) {
  const [items, setItems] = useState([])
  const [firstRender, setFirstRender] = useState(false)

  //新增課程到購物車
  const onAdd = (product) => {
    const foundIndex = items.findIndex((v) => v.id === product.id)

    if (foundIndex !== -1) {
      const nextItems = items.map((v, i) => {
        if (v.id === product.id) {
          return { ...v, qty: v.qty + 1 }
        } else {
          return v
        }
      })
      setItems(nextItems)
    } else {
      const newItem = { ...product, qty: 1 }
      const nextItems = [newItem, ...items]
      setItems(nextItems)
    }
  }

  // 處理課程遞增
  const onIncrease = (productId) => {
    const nextItems = items.map((v, i) => {
      if (v.id === productId) {
        return { ...v, qty: v.qty + 1 }
      } else {
        return v
      }
    })
    setItems(nextItems)
  }

  // 處理課程遞減
  const onDecrease = (productId) => {
    const nextItems = items.map((v, i) => {
      if (v.id === productId) {
        return { ...v, qty: v.qty - 1 }
      } else {
        return v
      }
    })
    setItems(nextItems)
  }

  // 處理課程刪除
  const onRemove = (productId) => {
    const nextItems = items.filter((v) => v.id !== productId)
    setItems(nextItems)
  }

  // 計算課程總數量與總金額
  const totalQty = items.reduce((acc, v) => acc + v.qty, 0)
  const totalPrice = items.reduce((acc, v) => acc + v.qty * v.price, 0)

  useEffect(() => {
    // 從localStorage中讀取資料，設定到items狀態中
    setItems(JSON.parse(localStorage.getItem('cart')) || [])
    setFirstRender(true)
  }, [])

  useEffect(() => {
    if (firstRender) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items])

  return (
    <CartWorkshopContext.Provider
      value={{
        items,
        totalPrice,
        totalQty,
        onAdd,
        onDecrease,
        onIncrease,
        onRemove,
      }}
    >
      {children}
    </CartWorkshopContext.Provider>
  )
}

export const useCartWorkshop = () => useContext(CartWorkshopContext)
