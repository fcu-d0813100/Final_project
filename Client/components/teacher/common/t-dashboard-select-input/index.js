'use client'
import { PiCaretDown } from 'react-icons/pi'
import styles from '@/components/teacher/common/t-dashboard-select-input/index.module.scss'
import React, { useState, useEffect } from 'react'


export default function SelectInput({
  initName,
  forText,
  titleCh,
  titleEn,
  addClass,
  items = [],
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(`${initName}`) // 初始顯示文字

  // 切換下拉選單的顯示狀態
  const toggleDropdown = () => setIsOpen(!isOpen)

  // 處理選取選項的函數
  const handleOptionClick = (option) => {
    setSelectedOption(option)
    setIsOpen(false) // 選取後關閉下拉選單
  }

  return (
    <div className={`${styles.selectArea} ${addClass}`}>
      <label htmlFor={forText} className="d-block p mb-2">
        {titleCh}
        <span> {titleEn}</span>
      </label>

      <a
        className="d-flex align-items-center justify-content-between"
        onClick={toggleDropdown}
      >
        {selectedOption} <PiCaretDown />
      </a>

      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(`${item.option}`)}
              name={item.name}
            >
              {item.option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
