import React from 'react'
import styles from './index.module.scss'

export default function Textarea({
  title,
  titleEn,
  name,
  rows,
  width,
  placeholder,
  value,
  onChange,
  hasError = false, // 用於接收錯誤狀態的屬性
}) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className={`${styles.label} h4 mb-3 d-block`}>
        {title}
        <span>{titleEn}</span>
      </label>
      <textarea
        name={name}
        rows={rows}
        className={`${styles.detailTextarea} ${
          hasError ? styles.errorInput : ''
        }`}
        style={{ width }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      ></textarea>
    </div>
  )
}
