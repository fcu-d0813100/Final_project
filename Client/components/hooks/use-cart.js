import React, { useState, useEffect, createContext, useContext } from 'react'

const CartContext = createContext(null)
CartContext.displayName = 'CartContext'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [firstRender, setFirstRender] = useState(false)

  //新增商品到購物車
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

  // 處理遞增
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

  // 處理遞減
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

  // 處理刪除
  const onRemove = (productId) => {
    const nextItems = items.filter((v) => v.id !== productId)
    setItems(nextItems)
  }

  // 計算總數量與總金額
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
    <CartContext.Provider
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
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
