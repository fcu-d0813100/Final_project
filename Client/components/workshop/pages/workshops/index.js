'use client'
import styles from '@/components/workshop/common/workshops.module.scss'
import Image from 'next/image'
import { PiMagnifyingGlass, PiCaretDown, PiArrowRight } from 'react-icons/pi'
import WorkshopsBN from '@/components/workshop/common/workshop-bn'
import WorkshopSelectbar from '@/components/workshop/common/workshop-selectbar'
import WorkshopCard from '@/components/workshop/common/workshop-card'
import React, { useState, useEffect } from 'react'

export default function WorkshopAll(props) {
  return (
    <>
      <WorkshopsBN/>

      <WorkshopSelectbar/>

      <div className={`${styles.section03} container`}>
        <WorkshopCard/>
      </div>
    </>
  )
}
