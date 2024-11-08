'use client'
import styles from '@/components/teacher/common/t-dashboard-textarea-style/textarea.module.scss'
import React from 'react'

export default function Textarea({
  addclass = '',
  title = '',
  name = '',
  rows = '',
  width = '',
  placeholder = '',
  value = '',
  onChange, // 父組件傳入的 onChange 回調
}) {
  return (
    <div className={`${addclass}`}>
      <label htmlFor={name} className={`${styles.label} h4 mb-3 d-block`}>
        {title}
      </label>
      <textarea
        name={name}
        rows={rows}
        className={`${styles.detailTextarea} p-3`}
        style={{ width: width }}
        placeholder={placeholder}
        value={value} // 使用父組件傳入的 value
        onChange={onChange} // 傳入父組件的 onChange 回調
      ></textarea>
    </div>
  )
}
