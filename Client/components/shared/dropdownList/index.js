import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { PiCaretDown } from 'react-icons/pi'
import styles from '@/components/shared/dropdownList/index.module.scss'

export default function Dropdown({
  name = '',
  items = [], // 將 item 改為一個數組
}) {
  // 使用 useEffect 確保 Bootstrap JavaScript 僅在客戶端加載
  useEffect(() => {
    typeof document !== undefined
      ? require('bootstrap/dist/js/bootstrap.bundle.min.js')
      : null
  }, [])

  return (
    <div className="d-flex mt-4 mb-4">
      <div className="dropdown mx-3">
        <a
          href="#"
          className={`${styles.dropdownTitle} p d-flex align-content-center justify-content-between`}
          data-bs-toggle="dropdown"
        >
          <p>{name}</p>
          <PiCaretDown />
        </a>

        <div className={`dropdown-menu ${styles.dropdownMenu}`}>
          {items
            .filter((item) => item)
            .map((item, index) => (
              <a href="#" className="dropdown-item my-1" key={index}>
                {item}
              </a>
            ))}
        </div>
      </div>
    </div>
  )
}
