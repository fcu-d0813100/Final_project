'use client'
import styles from '@/components/teacher/common/t-dashboard-input-style/input.module.scss'
import React, { useState, useEffect } from 'react'

export default function InputStyle({
  addclass = '',
  forText = '',
  titleCh = '',
  titleEn = '',
  typeText = '',
  placeholder = '',
  name = '',
  value = '',
  min = '',
  max = '',
  onChange,
}) {
  return (
    <>
      <div className={`${styles.inputstyle} ${addclass}`}>
        <label htmlFor={forText} className="d-block p mb-2">
          {titleCh}
          <span>{titleEn}</span>
        </label>
        <input
          type={typeText}
          placeholder={placeholder}
          name={name}
          value={value} // 設定 value 為狀態變數
          min={min}
          max={max}
          onChange={onChange} // 添加 onChange 事件
        />
      </div>
    </>
  )
}
