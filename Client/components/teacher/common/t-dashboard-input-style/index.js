'use client'
import styles from '@/components/teacher/common/upload.module.scss'
import React, { useState, useEffect } from 'react'

export default function InputStyle({
  addclass = '',
  forText = '',
  titleCh = '',
  titleEn = '',
  typeText = '',
  placeholder='',
  name='',
}) {
  return (
    <>
      <div className={`${styles.inputstyle} ${addclass}`}>
        <label htmlFor={forText} className="d-block p mb-2">
          {titleCh}
          <span>{titleEn}</span>
        </label>
        <input type={typeText} placeholder={placeholder} name={name} />
      </div>
    </>
  )
}