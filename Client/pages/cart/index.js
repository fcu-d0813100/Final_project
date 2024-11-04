import React, { useState, useEffect } from 'react'
import CartList from '@/components/cart/pages/card-list'
import Nobuy from '@/components/cart/pages/nobuy'

export default function Index(props) {
  const [isEmptyCart, setIsEmptyCart] = useState(false)

  useEffect(() => {
    const productCart = JSON.parse(localStorage.getItem('productCart')) || []
    const Workshopcart = JSON.parse(localStorage.getItem('Workshopcart')) || []

    setIsEmptyCart(productCart.length === 0 && Workshopcart.length === 0)
  }, [])

  return <>{isEmptyCart ? <Nobuy /> : <CartList />}</>
}
