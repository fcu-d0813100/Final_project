'use client'
import styles from '@/components/activity/common/uploadImg/index.module.scss'
import { PiPlus } from 'react-icons/pi'
import React, { useState } from 'react'

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
          id="fileInput"
          multiple // 支持多個檔案
        />
        <label
          htmlFor="fileInput"
          className="text-center"
          style={{ width: `${width}`, height: `${height}` }}
        >
          {previews.length === 0 ? (
            <div className={styles.picUploadText}>
              <div>
                <PiPlus className={styles.plus} />
                <p className={`h4 mt-3`}>
                  新增圖片
                  <br /> <span className="p">(必填)</span>
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
                    type="button" // 添加 type="button" 防止表單提交
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
