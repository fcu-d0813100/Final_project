'use client'
import { PiCaretDown } from 'react-icons/pi'
import styles from '@/components/teacher/common/t-dashboard-select-input/index.module.scss'
import React, { useState, useEffect } from 'react'


export default function SelectInput({ forText, titleCh, titleEn, addClass }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('類別') // 初始顯示文字

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
          <li onClick={() => handleOptionClick('基礎化妝')}>基礎化妝</li>
          <li onClick={() => handleOptionClick('新娘化妝')}>新娘化妝</li>
          <li onClick={() => handleOptionClick('時尚與攝影化妝')}>
            時尚與攝影化妝
          </li>
          <li onClick={() => handleOptionClick('韓系美妝')}>韓系美妝</li>
          <li onClick={() => handleOptionClick('特效化妝')}>特效化妝</li>
          <li onClick={() => handleOptionClick('美妝產品知識')}>
            美妝產品知識
          </li>
        </ul>
      )}
    </div>
  )
}
