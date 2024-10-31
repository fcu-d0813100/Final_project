import React, { useState, useEffect, createContext, useContext } from 'react'

//------------以下是商品的鉤子
const ProductCartContext = createContext(null)
ProductCartContext.displayName = 'ProductCartContext'

export function ProductCartProvider({ children }) {
  const [productItems, setProductItems] = useState([])
  const [firstRender, setFirstRender] = useState(false)

  //商品新增到購物車
  const onAddProduct = (product) => {
    const foundIndex = productItems.findIndex((v) => v.id === product.id)

    if (foundIndex !== -1) {
      const nextProductItems = productItems.map((v, i) => {
        if (v.id === product.id) {
          return { ...v, qty: v.qty + 1 }
        } else {
          return v
        }
      })
      setProductItems(nextProductItems)
    } else {
      setProductItems([{ ...product, qty: 1 }, ...productItems])
    }
  }

  // 處理遞增
  const onIncreaseProduct = (productId) => {
    const nextProductItems = productItems.map((v, i) => {
      if (v.id === productId) {
        return { ...v, qty: v.qty + 1 }
      } else {
        return v
      }
    })
    setProductItems(nextProductItems)
  }

  // 處理遞減
  const onDecreaseProduct = (productId) => {
    const nextProductItems = productItems.map((v, i) => {
      if (v.id === productId) {
        return { ...v, qty: v.qty - 1 }
      } else {
        return v
      }
    })
    setProductItems(nextProductItems)
  }

  // 處理刪除
  const onRemoveProduct = (productId) => {
    setProductItems(productItems.filter((v) => v.id !== productId))
  }

  // 計算總數量與總金額
  const pTotalQty = productItems.reduce((acc, v) => acc + v.qty, 0)
  const pTotalPrice = productItems.reduce((acc, v) => acc + v.qty * v.price, 0)

  // 初次渲染localStorage中讀取資料，設定到items狀態中
  useEffect(() => {
    setProductItems(JSON.parse(localStorage.getItem('productCart')) || [])
    setFirstRender(true)
  }, [])

  //變更內容時，設定到localStorage
  useEffect(() => {
    if (firstRender) {
      localStorage.setItem('productCart', JSON.stringify(productItems))
    }
  }, [productItems])

  //導出商品內容跟方法
  return (
    <ProductCartContext.Provider
      value={{
        productItems,
        pTotalQty,
        pTotalPrice,
        onAddProduct,
        onIncreaseProduct,
        onDecreaseProduct,
        onRemoveProduct,
      }}
    >
      {children}
    </ProductCartContext.Provider>
  )
}

export const useCartProduct = () => useContext(ProductCartContext)
