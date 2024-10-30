'use client'

import React, { useState, useEffect } from 'react'
import styles from '@/components/teacher/common/teachers.module.scss'
import Image from 'next/image'
import { PiArrowRight } from 'react-icons/pi'

export default function TeacherBox({ blackImg, colorImg, name, type, nation, years }) {
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
              src={blackImg}
            />
          </div>
        </div>

        <div className={styles.tColor}>
          <Image
            width={350}
            height={350}
            className={styles.colorImg}
            src={colorImg}
            alt=""
          />
          <div className={styles.textContent}>
            <h1 className={`h3-L ${styles.tName}`}>{name}</h1>
            <div className={styles.information}>
              <div className="h5">Main skills</div>
              <div className={styles.tDetail}>
                <p className="mb-5">{type}</p>
                <p className="my-2">
                  {nation} <br />
                  <span>資歷{years}年</span>
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
