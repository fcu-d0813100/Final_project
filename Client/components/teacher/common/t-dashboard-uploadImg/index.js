'use client'
import styles from '@/components/teacher/common/t-dashboard-uploadImg/uploadImg.module.scss'
import { PiPlus } from 'react-icons/pi'
import React, { useState, useEffect } from 'react'

export default function UploadImg({
  width,
  height,
  bigText,
  smText,
  name,
  onFileChange,
  value,
  initialImage, // 新增屬性來接收圖片URL
}) {
  const [preview, setPreview] = useState(null)
  const [uniqueId, setUniqueId] = useState('')

  // 動態生成 ID 碼，確保在客戶端渲染時才生成唯一的 ID，避免 SSR 錯誤
  useEffect(() => {
    setUniqueId(`fileInput-${Math.random().toString(36)}`)
  }, [])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result) // 將圖片預覽設定為上傳的圖片
        onFileChange(name, file)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleReSelect = () => {
    // 觸發隱藏的 input 點擊事件以重新選取圖片
    document.getElementById(uniqueId).click()
  }

  const renderPreviewContent = () => {
    if (preview || initialImage) {
      return (
        <img
          src={preview || initialImage}
          alt=""
          className={styles.previewImage}
        />
      )
    }

    return (
      <div className={styles.picUploadText}>
        <div>
          <PiPlus className={styles.plus} />
          <p className="h4 mt-3">
            {bigText}
            <br />
            <span className="p">({smText})</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.uploadCover} style={{ width, height }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id={uniqueId} // 使用動態 ID
        name={name}
        value={value}
      />
      <label
        htmlFor={uniqueId} // 確保 label 對應動態 ID
        className="text-center"
        style={{ width, height }}
      >
        {renderPreviewContent()}
      </label>

      {(preview || initialImage) && (
        <button
          type="button"
          className={`${styles.reSelectImg} btn-outline h6`}
          onClick={handleReSelect}
        >
          重新選取
        </button>
      )}
    </div>
  )
}