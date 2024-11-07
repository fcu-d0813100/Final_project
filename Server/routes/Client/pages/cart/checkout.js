import React from 'react'
import Checkout from '@/components/cart/pages/checkout'
import Header from '@/components/layout/common/header'
import FooterTwo from '@/components/layout/common/footer-simple'

export default function checkout() {
  return (
    <>
      <Header />
      <Checkout />
      <FooterTwo />
    </>
  )
}
