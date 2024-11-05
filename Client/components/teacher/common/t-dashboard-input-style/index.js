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
  value='',

}) {

    const [inputValue, setInputValue] = useState(value) // 使用 useState 管理輸入值

    const handleInputChange = (e) => {
      setInputValue(e.target.value) // 更新輸入值
    }

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
          value={inputValue} // 設定 value 為狀態變數
          onChange={handleInputChange} // 添加 onChange 事件
        />
      </div>
    </>
  )
}
