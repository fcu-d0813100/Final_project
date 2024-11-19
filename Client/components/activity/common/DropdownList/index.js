import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { PiCaretDown } from 'react-icons/pi'
import styles from '@/components/shared/dropdownList/index.module.scss'

export default function Dropdown({
  name = '',
  items = [],
  onSelect = () => {}, // 新增 onSelect 回調函數的預設值
}) {
  // 使用 useEffect 確保 Bootstrap JavaScript 僅在客戶端加載
  useEffect(() => {
    if (typeof document !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js')
    }
  }, [])

  const handleItemClick = (item) => {
    onSelect(item.value) // 當點擊選項時，調用 onSelect 傳遞選項值
  }

  return (
    <div className="d-flex mt-4 mb-4">
      <div className="dropdown mx-3">
        <a
          href="#"
          className={`${styles.dropdownTitle} p d-flex align-items-center justify-content-between pb-2`}
          data-bs-toggle="dropdown"
        >
          <p className="m-0">{name}</p>
          <PiCaretDown />
        </a>

        <div className={`dropdown-menu ${styles.dropdownMenu}`}>
          {items.map((item, index) => (
            <a
              href="#"
              className="dropdown-item my-1"
              key={index}
              onClick={(e) => {
                e.preventDefault() // 阻止默認跳轉行為
                handleItemClick(item) // 點擊選項時調用 handleItemClick
              }}
            >
              {item.option}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
