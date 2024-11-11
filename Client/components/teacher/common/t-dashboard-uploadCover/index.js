'use client'
import styles from '@/components/teacher/common/t-dashboard-uploadCover/uploadCover.module.scss'
import { PiPlus } from 'react-icons/pi'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function UploadCover(prop) {
  const [preview, setPreview] = useState(null)
  const [confirmed, setConfirmed] = useState(false)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result) // 將圖片預覽設定為上傳的圖片
        setConfirmed(false) // 每次重新選擇圖片時重設狀態
      }
      reader.readAsDataURL(file)
    }
  }

  const handleReSelect = () => {
    // 觸發隱藏的 input 點擊事件以重新選取圖片
    document.getElementById('fileInput').click()
  }
  const handleConfirm = () => {
    setConfirmed(true) // 按下「確認」按鈕後，更新狀態以切換樣式
  }

  return (
    <>
      <form action="">
        <div className={styles.uploadCover} style={{ width: 445, height: 320 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="fileInput"
            name="img_cover"
          />
          <label
            htmlFor="fileInput" // 確保 label 對應動態 ID
            className="text-center"
            style={{ width: 445, height: 320 }}
          >
            {preview ? (
              <Image
                height={320}
                width={445}
                src={preview}
                alt="預覽"
                className={confirmed ? styles.sendImage : styles.previewImage}
              />
            ) : (
              <div className={styles.picUploadText}>
                <div>
                  <PiPlus className={styles.plus} />
                  <p className={`h4 mt-3`}>
                    新增封面圖
                    <br /> <span className="p">(必填)</span>
                  </p>
                </div>
              </div>
            )}
          </label>

          {preview && (
            <>
              <button
                type="button"
                className={`${styles.reSelectImg} btn-outline h6`}
                onClick={handleReSelect}
              >
                重新選取
              </button>
              <button
                type="button"
                className={`${styles.sendImg} btn-outline h6`}
                onClick={handleConfirm}
              >
                確認
              </button>
            </>
          )}
        </div>
      </form>
    </>
  )
}
