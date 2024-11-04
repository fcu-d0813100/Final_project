'use client'
import styles from '@/components/teacher/common/t-dashboard-uploadImg/uploadImg.module.scss'
import { PiPlus } from 'react-icons/pi'
import React, { useState } from 'react'

<<<<<<< HEAD
export default function UploadImg({ width, height }) {
  const [previews, setPreviews] = useState([]) // 儲存所有圖片預覽

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files) // 轉換 FileList 為陣列
    const newPreviews = files.map((file) => {
      const reader = new FileReader()
      reader.readAsDataURL(file) // 將每個檔案轉換為 Data URL
      return new Promise((resolve) => {
        reader.onload = () => resolve(reader.result)
      })
    })

    Promise.all(newPreviews).then((results) => {
      setPreviews((prev) => [...prev, ...results]) // 將新圖片添加到現有的預覽陣列
    })
  }

  const handleReSelect = () => {
    document.getElementById('fileInput').click()
  }

  const handleRemoveImage = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index)) // 刪除指定的圖片
  }
=======
export default function UploadImg({width,height,bigText,smText}) {
  const [preview, setPreview] = useState(null)

  // 動態生成 ID 碼
  const uniqueId = `fileInput-${Math.random().toString(36).substr(2, 9)}`

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result) // 將圖片預覽設定為上傳的圖片
      }
      reader.readAsDataURL(file)
    }
  }

  const handleReSelect = () => {
    // 觸發隱藏的 input 點擊事件以重新選取圖片
    document.getElementById('fileInput').click()
  }
>>>>>>> 74b67fe3684b18041ebc8f25b7bc3b138d7e50c4

  return (
    <>
      <div
        className={styles.uploadCover}
        style={{ width: `${width}`, height: `${height}` }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
<<<<<<< HEAD
          id="fileInput"
          multiple // 支持多個檔案
=======
          id={uniqueId} // 使用動態 ID
>>>>>>> 74b67fe3684b18041ebc8f25b7bc3b138d7e50c4
        />
        <label
          htmlFor={uniqueId} // 確保 label 對應動態 ID
          className="text-center"
          style={{ width: `${width}`, height: `${height}` }}
        >
          {previews.length === 0 ? (
            <div className={styles.picUploadText}>
              <div>
                <PiPlus className={styles.plus} />
                <p className={`h4 mt-3`}>
                  {bigText}
                  <br /> <span className="p">({smText})</span>
                </p>
              </div>
            </div>
          ) : (
            <div className={styles.imageGrid}>
              {previews.map((src, index) => (
                <div className={styles.imageContainer} key={index}>
                  <img
                    src={src}
                    alt={`預覽 ${index + 1}`}
                    className={styles.previewImage}
                  />
                  <button
                    className={styles.removeImageButton}
                    onClick={() => handleRemoveImage(index)}
                  >
                    &times; {/* 使用叉叉符號作為刪除按鈕 */}
                  </button>
                </div>
              ))}
            </div>
          )}
        </label>

        {previews.length > 0 && (
          <a
            className={`${styles.reSelectImg} btn-outline h6`}
            onClick={handleReSelect}
          >
            重新選取
          </a>
        )}
      </div>
    </>
  )
}
