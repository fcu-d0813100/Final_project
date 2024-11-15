import React, { useState, useEffect, createContext, useContext } from 'react'
import toast from 'react-hot-toast'

//------------以下是商品的鉤子
const ProductCartContext = createContext(null)
ProductCartContext.displayName = 'ProductCartContext'

export function ProductCartProvider({ children }) {
  const [productItems, setProductItems] = useState([])
  const [firstRender, setFirstRender] = useState(false)
  const [coupons, setCoupons] = useState([]) // 優惠券狀態
  const [selectedCoupon, setSelectedCoupon] = useState(null) // 優惠券狀態

  // 優惠券選擇的更新函數
  const onSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon)
  }

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
    })

  // 商品新增到購物車
  const onAddProductMany = (product) => {
    const foundIndex = productItems.findIndex(
      (v) => v.product_id === product.product_id && v.color === product.color
    )

    if (foundIndex !== -1) {
      // 已存在於購物車中的商品
      const existingProduct = productItems[foundIndex]
      const updatedQty = existingProduct.qty + (product.quantity || 1)

      if (updatedQty > product.stock) {
        outOfStockNotify(product.stock)
        return
      }

      const nextProductItems = productItems.map((v, i) =>
        i === foundIndex ? { ...v, qty: updatedQty } : v
      )
      setProductItems(nextProductItems)
    } else {
      // 新增商品至購物車
      if (product.quantity > product.stock) {
        outOfStockNotify(product.stock)
        return
      }
      setProductItems([
        { ...product, qty: product.quantity || 1 },
        ...productItems,
      ])
    }
  }

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

  // 處理刪除(加優惠券適用的更新)
  const onRemoveProduct = (productId, color) => {
    const updatedProductItems = productItems.filter(
      (v) => v.product_id !== productId || v.color !== color
    )
    setProductItems(updatedProductItems)

    if (updatedProductItems.length === 0) {
      localStorage.removeItem('selectedCoupon')
      localStorage.removeItem('selectedCouponObj')
      window.location.reload()
      return
    }

    //檢查符合品牌的優惠券
    if (
      selectedCoupon &&
      selectedCoupon.brand_name !== 'All' && // 保留All的優惠券
      !updatedProductItems.some(
        (item) => item.brand === selectedCoupon.brand_name
      )
    ) {
      removeCoupon() // 移除優惠券
    }
  }

  // 處理清空購物車
  const onClearProduct = () => {
    setProductItems([])
  }

  // 計算總數量與總金額
  const pTotalQty = productItems.reduce((acc, v) => acc + v.qty, 0)
  const pTotalPrice = productItems.reduce((acc, v) => acc + v.qty * v.price, 0)
  const pOriginalTotalPrice = productItems.reduce(
    (acc, v) => acc + v.qty * v.originalprice,
    0
  )
  const pCartItems = productItems.length

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

  //變更優惠券時，設定到localStorage
  // useEffect(() => {
  //   localStorage.setItem('selectedCoupon', selectedCoupon)
  // }, [selectedCoupon])

  // 初始化，從 localStorage 加載優惠券
  useEffect(() => {
    const storedCoupon = localStorage.getItem('selectedCoupon')
    const storedCouponObj = localStorage.getItem('selectedCouponObj')

    if (storedCoupon && storedCouponObj) {
      setSelectedCoupon(JSON.parse(storedCouponObj))
    }
  }, [])

  const loadCoupons = async (userId, productItems) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/getCoupon?userId=${userId}`
      )
      const data = await response.json()
      if (data?.data) {
        const now = new Date()
        const productBrands = productItems
          .map((product) => product.brand)
          .concat('All')
        const validCoupons = data.data.filter((coupon) => {
          const startDate = new Date(coupon.start_date)
          const endDate = new Date(coupon.end_date)
          return (
            startDate <= now &&
            endDate >= now &&
            productBrands.includes(coupon.brand_name)
          )
        })
        setCoupons(validCoupons)
        // console.log(validCoupons)
      }
    } catch (error) {
      console.error('Failed to load coupons:', error)
    }
  }
  const selectCoupon = (coupon) => {
    setSelectedCoupon(coupon)
    localStorage.setItem('selectedCoupon', coupon.coupon_list_id)
    localStorage.setItem('selectedCouponObj', JSON.stringify(coupon))
  }

  const removeCoupon = () => {
    setSelectedCoupon(null)
    localStorage.removeItem('selectedCoupon')
    localStorage.removeItem('selectedCouponObj')
  }

  //-----reload

  //導出商品內容跟方法
  return (
    <ProductCartContext.Provider
      value={{
        productItems,
        pTotalQty,
        pTotalPrice,
        pOriginalTotalPrice,
        selectedCoupon, // 提供優惠券
        onAddProduct,
        onIncreaseProduct,
        onDecreaseProduct,
        onRemoveProduct,
        onAddProductMany,
        onSelectCoupon, // 更新優惠券
        onClearProduct, // 清空商品購物車
        pCartItems,
        coupons,
        selectedCoupon,
        loadCoupons,
        selectCoupon,
        removeCoupon,
        // checkCouponValidity,
      }}
    >
      {children}
    </ProductCartContext.Provider>
  )
}

export const useCartProduct = () => useContext(ProductCartContext)
