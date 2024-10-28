'use client'

import React, { useState, useEffect } from 'react'
import styles from '@/styles/teacher/teachers.module.scss'
import Image from 'next/image'
import { PiArrowRight } from 'react-icons/pi'

export default function TeacherBox(props) {
  return (
    <>
      <a href="#" className="flex-grow-1">
        <div className={`${styles.tBlack} d-flex`}>
          <div className={`${styles.blackImg} flex-grow-1`}>
            <Image
              width={350}
              height={350}
              className={`${styles.TImg}`}
              alt=""
              src="/teacher/teachers_img/T_1.jpg"
              priority
            />
          </div>
        </div>

        <div className={styles.tColor}>
          <Image
            width={350}
            height={350}
            className={styles.colorImg}
            src="/teacher/teachers_img/T_1_color.jpg"
            alt=""
            priority
          />
          <div className={styles.textContent}>
            <h1 className={`h3-L ${styles.tName}`}>Gina Bettelli</h1>
            <div className={styles.information}>
              <div className="h5">Main skills</div>
              <div className={styles.tDetail}>
                <p className="mb-5">時尚攝影妝</p>
                <p className="my-2">
                  America | 美國 <br />
                  <span>資歷20年</span>
                </p>
                <div
                  className={`${styles.more} d-flex align-content-center mt-5`}
                >
                  <p className="h6">MORE</p>
                  <PiArrowRight className="ph ms-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </>
  )
}
