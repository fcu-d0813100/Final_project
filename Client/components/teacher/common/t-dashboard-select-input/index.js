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
  value,
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(initName)

  // 當 value 改變時，更新選項顯示名稱，但只在 value 有實際選擇值時更新
  useEffect(() => {
    if (value) {
      const matchedItem = items.find((item) => item.value === value)
      setSelectedOption(matchedItem ? matchedItem.option : initName)
    }
  }, [value, items, initName])

  // 切換下拉選單的顯示狀態
  const toggleDropdown = () => setIsOpen(!isOpen)

  // 處理選取選項的函數
  const handleOptionClick = (option, value) => {
    setSelectedOption(option)
    setIsOpen(false) // 選取後關閉下拉選單
    if (onChange) {
      console.log('Option clicked:', option, 'Value:', value)
      onChange({ target: { name: forText, value: value } }) // 呼叫 onChange，傳遞選項
    }
  }

  return (
    <div className={`${styles.selectArea} ${addClass}`}>
      <label htmlFor={forText} className="d-block p mb-2">
        {titleCh}
        <span> {titleEn}</span>
      </label>

      <button
        type="button"
        className="d-flex align-items-center justify-content-between"
        onClick={toggleDropdown}
      >
        {selectedOption || initName} {/* 當沒有選擇時顯示 initName */}{' '}
        <PiCaretDown />
      </button>

      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(item.option, item.value)}
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
