import React, { useState, useEffect } from 'react'
import FooterTwo from '@/components/home/common/footerTwo'
import CartList from '@/components/cart/pages/card-list'

export default function Index(props) {
  return (
    <>
      <div>購物車測試</div>
      <CartList />
      <FooterTwo />
    </>
  )
}
