'use client'
import styles from '@/components/workshop/common/dropdown/dropdown.module.scss'
import { PiCaretDown } from 'react-icons/pi'
import React, { useState, useEffect } from 'react'

export default function Dropdown({ name = '', items = [], onSelect }) {
  useEffect(() => {
    typeof document !== 'undefined'
      ? require('bootstrap/dist/js/bootstrap.bundle.min.js')
      : null
  }, [])

  const handleSelect = (value) => {
    if (onSelect) {
      onSelect(value) // 將選中的值傳遞出去
    }
  }

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
            <button
              type="button"
              key={index}
              href={item.link}
              className={`dropdown-item my-1 ${
                index === 0 ? styles.firstOption : ''
              }`}
              onClick={() => handleSelect(item.value)}
            >
              {item.option}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
