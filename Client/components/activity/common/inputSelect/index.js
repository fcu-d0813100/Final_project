'use client'
import { PiCaretDown } from 'react-icons/pi'
import styles from '@/components/activity/common/inputSelect/index.module.scss'
import React, { useState } from 'react'

export default function SelectInput({
  forText,
  titleCh,
  titleEn,
  addClass,
  onChange,
  name,
  hasError = false, // 父組件傳入的錯誤狀態
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('類別')

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleOptionClick = (option) => {
    setSelectedOption(option)
    setIsOpen(false)

    if (onChange) {
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
        className={`d-flex align-items-center justify-content-between ${
          hasError ? styles.errorBorder : ''
        }`} // 當 hasError 為 true 時，應用錯誤樣式
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
