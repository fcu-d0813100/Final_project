'use client'
import styles from '@/components/teacher/common/teacher-dropdown/t-dropdown.module.scss'
import { PiCaretDown } from 'react-icons/pi'
import React, { useState, useEffect } from 'react'

export default function Dropdown({ name = '', items = [] }) {
  useEffect(() => {
    typeof document !== undefined
      ? require('bootstrap/dist/js/bootstrap.bundle.min.js')
      : null
  }, [])

  return (
    <>
      <div className="dropdown mx-3">
        <a
          href="#"
          className={`${styles.dropdownTitle} p d-flex justify-content-between`}
          data-bs-toggle="dropdown"
        >
          <p className="m-0 ">{name}</p>
          <PiCaretDown className={styles.downIcon} />
        </a>

        <div className={`dropdown-menu ${styles.dropdownMenu}`}>
          {items.map((item, index) => (
            <a key={index} href={item.link} className="dropdown-item my-1">
              {item.option}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
