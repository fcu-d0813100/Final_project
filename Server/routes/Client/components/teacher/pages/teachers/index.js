'use client'
import styles from '@/components/teacher/common/teachers.module.scss'
import Image from 'next/image'
import { PiMagnifyingGlass, PiCaretDown, PiArrowRight } from 'react-icons/pi'

import TeachersHeader from '@/components/teacher/common/teachers-header'
import Boxrow from '@/components/teacher/common/teacher-boxrow'

import React, { useState, useEffect, Fragment } from 'react'

export default function Teachers(props) {
  return (
    <>
      <div className={styles.bodyImg}>
        <TeachersHeader />

        <div className={`${styles.section01} container `}>
          <Boxrow />
        </div>

        <div className={`container ${styles.bottomText}`}>
          <p className="pt-3">Define Your Beauty</p>
        </div>
        
      </div>
    </>
  )
}
