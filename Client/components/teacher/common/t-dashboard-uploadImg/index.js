'use client'
import styles from '@/components/teacher/common/t-dashboard-uploadImg/uploadImg.module.scss'
import { PiPlus } from 'react-icons/pi'
import React, { useState, useEffect } from 'react'

export default function UploadImg({width,height}) {
     const [preview, setPreview] = useState(null)

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
        />
        <label
          htmlFor="fileInput"
          className="text-center"
          style={{ width: `${width}`, height: `${height}` }}
        >
          {preview ? (
            <img src={preview} alt="預覽" className={styles.previewImage} />
          ) : (
            <div className={styles.picUploadText}>
              <div className>
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
            <a
              className={`${styles.reSelectImg} btn-outline h6`}
              onClick={handleReSelect}
            >
              重新選取
            </a>
          </>
        )}
      </div>
    </>
  )
}
