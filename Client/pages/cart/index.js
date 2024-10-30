import React, { useState, useEffect } from 'react'
import FooterTwo from '@/components/home/common/footerTwo'
import CartList from '@/components/cart/pages/card-list'
import Header from '@/components/home/common/header'
import DiscountBox from '@/components/cart/common/discountbox'

export default function Index(props) {
  return (
    <>
      <Header />
      <DiscountBox />
      <CartList />
      <FooterTwo />
    </>
  )
}
