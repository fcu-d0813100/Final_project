import React, { useState, useEffect } from 'react'
import FooterTwo from '@/components/home/common/footerTwo'
import CartList from '@/components/cart/pages/card-list'
import Header from '@/components/home/common/header'

export default function Index(props) {
  return (
    <>
      <Header />
      <CartList />
      <FooterTwo />
    </>
  )
}
