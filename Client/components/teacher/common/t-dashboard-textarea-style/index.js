'use client'
import styles from '@/components/teacher/common/t-dashboard-textarea-style/textarea.module.scss'
import React, { useState, useEffect, Fragment } from 'react'

export default function Textarea({addclass, title, name, rows, width, placeholder }) {
  return (
    <>
      <div className={`${addclass}`}>
        <label
          htmlFor="description"
          className={`${styles.label} h5 mb-3 d-block`}
        >
          {title}
        </label>
        <textarea
          name={name}
          rows={rows}
          className={`${styles.detailTextarea} p-3`}
          style={{ width: `${width}` }}
          placeholder={placeholder}
        ></textarea>
      </div>
    </>
  )
}
