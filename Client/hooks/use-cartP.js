import React, { useState, useEffect, createContext, useContext } from 'react'
import toast from 'react-hot-toast'

//------------以下是商品的鉤子
const ProductCartContext = createContext(null)
ProductCartContext.displayName = 'ProductCartContext'

export function ProductCartProvider({ children }) {
  const [productItems, setProductItems] = useState([])
  const [firstRender, setFirstRender] = useState(false)

  //商品新增到購物車
  const onAddProduct = (product) => {
    const foundIndex = productItems.findIndex(
      (v) => v.product_id === product.product_id && v.color === product.color
    )

    if (foundIndex !== -1) {
      const nextProductItems = productItems.map((v, i) => {
        if (v.product_id === product.product_id && v.color === product.color) {
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

  // 庫存不足通知
  const outOfStockNotify = (stock) =>
    toast.error(`目前庫存僅剩 ${stock} 件，請調整購買數量`, {
      style: {
        border: '1.2px solid #f44336',
        padding: '12px 40px',
        color: '#f44336',
      },
      iconTheme: { primary: '#f44336', secondary: '#fff' },
    });

  // 商品新增到購物車
  const onAddProductMany = (product) => {
    const foundIndex = productItems.findIndex(
      (v) => v.product_id === product.product_id && v.color === product.color
    );
  
    if (foundIndex !== -1) {
      // 已存在於購物車中的商品
      const existingProduct = productItems[foundIndex];
      const updatedQty = existingProduct.qty + (product.quantity || 1);

      if (updatedQty > product.stock) {
        outOfStockNotify(product.stock);
        return;
      }

      const nextProductItems = productItems.map((v, i) =>
        i === foundIndex ? { ...v, qty: updatedQty } : v
      );
      setProductItems(nextProductItems);
    } else {
      // 新增商品至購物車
      if (product.quantity > product.stock) {
        outOfStockNotify(product.stock);
        return;
      }
      setProductItems([{ ...product, qty: product.quantity || 1 }, ...productItems]);
    }
  };
  
  // 處理遞增
  const onIncreaseProduct = (productId, color) => {
    const nextProductItems = productItems.map((v, i) => {
      if (v.product_id === productId && v.color === color) {
        return { ...v, qty: v.qty + 1 }
      } else {
        return v
      }
    })
    setProductItems(nextProductItems)
  }

  // 處理遞減
  const onDecreaseProduct = (productId, color) => {
    const nextProductItems = productItems.map((v, i) => {
      if (v.product_id === productId && v.color === color) {
        return { ...v, qty: v.qty - 1 }
      } else {
        return v
      }
    })
    setProductItems(nextProductItems)
  }

  // 處理刪除
  const onRemoveProduct = (productId, color) => {
    setProductItems(
      productItems.filter(
        (v) => v.product_id !== productId || v.color !== color
      )
    )
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

  //-----reload

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
        onAddProductMany,
      }}
    >
      {children}
    </ProductCartContext.Provider>
  )
}

export const useCartProduct = () => useContext(ProductCartContext)
