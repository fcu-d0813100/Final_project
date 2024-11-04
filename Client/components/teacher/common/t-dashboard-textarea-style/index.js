'use client'
import styles from '@/components/teacher/common/t-dashboard-textarea-style/textarea.module.scss'
import React, { useState, useEffect, Fragment } from 'react'

export default function Textarea({
  addclass='',
  title='',
  name='',
  rows='',
  width='',
  placeholder='',
  value=''
}) {

      const [inputValue, setInputValue] = useState(value) // 使用 useState 管理輸入值

      const handleInputChange = (e) => {
        setInputValue(e.target.value) // 更新輸入值
      }
  return (
    <>
      <div className={`${addclass}`}>
        <label
          htmlFor="description"
          className={`${styles.label} h4 mb-3 d-block`}
        >
          {title}
        </label>
        <textarea
          name={name}
          rows={rows}
          className={`${styles.detailTextarea} p-3`}
          style={{ width: `${width}` }}
          placeholder={placeholder}
          value={inputValue} // 設定 value 為狀態變數
          onChange={handleInputChange} // 添加 onChange 事件
        ></textarea>
      </div>
    </>
  )
}
