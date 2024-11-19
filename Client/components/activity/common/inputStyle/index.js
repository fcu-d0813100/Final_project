'use client'
import styles from '@/components/activity/common/inputStyle/index.module.scss'
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
  onChange, // 父組件傳入的 onChange 回調
  hasError = false,
}) {
  const [inputValue, setInputValue] = useState(value) // 使用 useState 管理輸入值

  // 處理輸入變更，並調用傳入的 onChange 回調
  const handleInputChange = (e) => {
    setInputValue(e.target.value) // 更新內部輸入值
    if (onChange) {
      // 如果有傳入 onChange 回調，則調用它
      onChange(e)
    }
  }

  return (
    <div className={`${styles.inputstyle} ${styles.addclass} ${addclass}`}>
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
        className={`${hasError ? styles.errorInput : ''}`}
      />
    </div>
  )
}
