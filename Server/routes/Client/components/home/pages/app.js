import React, { useState, useEffect } from 'react'
import Header from '@/components/layout/common/header'
import ClassAct from '@/components/home/common/class-act'
import Brands from '@/components/home/common/brands'
import BestSller from '@/components/home/common/best-seller'
import Cardhome from '@/components/product/pages/card-home'
import Footer from '@/components/layout/common/footer-global'

export default function App(props) {
  return (
    <>
      <BestSller />
      <Cardhome />
      <ClassAct />
      <Brands />
    </>
  )
}
