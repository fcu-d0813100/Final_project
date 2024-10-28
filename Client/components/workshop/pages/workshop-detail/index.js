'use client'
import styles from '@/components/workshop/common/workshop-detail.module.scss'
import Image from 'next/image'
import WorkshopDetailHeader from '@/components/workshop/common/workshop-detail-header'
import AddToCart from '@/components/workshop/common/add-to-cart'
import WorkshopDetailInfo from '@/components/workshop/common/workshop-detail-info'
import {
  PiHeartStraight,
  PiMinus,
  PiPlus,
  PiPlusCircle,
  PiHandbagSimple,
} from 'react-icons/pi'
import React, { useState, useEffect } from 'react'

export default function WorkshopDetail(props) {
  return (
    <>
      <WorkshopDetailHeader />
      <div className={styles.workshopSpace}>
        <Image
          width={500}
          height={200}
          className={styles.workshopImg}
          src="/workshop/workshop.svg"
          alt=""
        />
      </div>

      <AddToCart />
      <WorkshopDetailInfo/>
    </>
  )
}
