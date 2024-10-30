import React, { useState, useEffect } from 'react'
import Header from '@/components/home/common/header'
import ClassAct from '@/components/home/common/class-act'
import Brands from '@/components/home/common/brands'
import BestSller from '@/components/home/common/best-seller'
import Cardhome from '@/components/product/pages/card-home'
import Footer from '@/components/home/common/footer'

export default function App(props) {
  return (
    <>
      <Header />
      <BestSller />
      <Cardhome />
      <ClassAct />
      <Brands />
      <Footer />
    </>
  )
}
