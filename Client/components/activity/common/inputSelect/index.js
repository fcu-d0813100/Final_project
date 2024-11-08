'use client'
import { PiCaretDown } from 'react-icons/pi'
import styles from '@/components/teacher/common/t-dashboard-select-input/index.module.scss'
import React, { useState } from 'react'

export default function SelectInput({
  forText,
  titleCh,
  titleEn,
  addClass,
  onChange, // 父組件傳入的 onChange 回調
  name, // 用於標識此選項的 name 屬性
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('類別') // 初始顯示文字

  // 切換下拉選單的顯示狀態
  const toggleDropdown = () => setIsOpen(!isOpen)

  // 處理選取選項的函數
  const handleOptionClick = (option) => {
    setSelectedOption(option)
    setIsOpen(false) // 選取後關閉下拉選單

    if (onChange) {
      // 傳遞選擇的值給父組件
      onChange({ target: { name, value: option } })
    }
  }

  return (
    <div className={`${styles.selectArea} ${addClass}`}>
      <label htmlFor={forText} className="d-block p mb-2">
        {titleCh}
        <span> | {titleEn}</span>
      </label>

      <a
        className="d-flex align-items-center justify-content-between"
        onClick={toggleDropdown}
      >
        {selectedOption} <PiCaretDown />
      </a>

      {isOpen && (
        <ul className={styles.dropdownMenu}>
          <li onClick={() => handleOptionClick('YSL')}>YSL</li>
          <li onClick={() => handleOptionClick('NARS')}>NARS</li>
          <li onClick={() => handleOptionClick('LANCÔME')}>LANCÔME</li>
          <li onClick={() => handleOptionClick('Estee Lauder')}>
            Estee Lauder
          </li>
          <li onClick={() => handleOptionClick('Bobbi Brown')}>Bobbi Brown</li>
        </ul>
      )}
    </div>
  )
}
