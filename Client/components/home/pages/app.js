import React, { useState, useEffect } from 'react'
import ClassAct from '@/components/home/common/class-act'
import Brands from '@/components/home/common/brands'
import BestSller from '@/components/home/common/best-seller'
import Cardhome from '@/components/product/pages/card-home'
import SeasonSale from '@/components/home/common/season-sale'

export default function App(props) {
  return (
    <>
      <BestSller />
      <Cardhome />
      <SeasonSale/>
      <ClassAct />
      <Brands />
    </>
  )
}
