import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './index.module.scss'

export default function PreviewUploadImage({
  userId,
  avatarBaseUrl = 'http://localhost:3005/avatar', // 基礎URL指向你的本地服務器
  defaultImg = 'avatar01.jpg',
  setSelectedFile,
  selectedFile,
}) {
  // 預覽圖片
  const [preview, setPreview] = useState('')

  // 當選擇檔案更動時建立預覽圖
  useEffect(() => {
    if (!selectedFile) {
      setPreview('')
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // 當元件unmounted時清除記憶體
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      setSelectedFile(file)
      console.log('Selected file:', file) // 調試輸出
    } else {
      setSelectedFile(null)
    }
  }

  const showImg = () => {
    if (selectedFile) {
      console.log('Preview URL:', preview)
      return preview
    }

    if (userId) {
      const avatarImg = `avatar${userId}.jpg`
      const avatarUrl = `${avatarBaseUrl}/${avatarImg}`
      console.log('Avatar URL:', avatarUrl)
      return avatarUrl
    }

    const defaultUrl = `${avatarBaseUrl}/${defaultImg}`
    console.log('Default URL:', defaultUrl)
    return defaultUrl
  }

  return (
    <div className={`${styles['image-upload']} `}>
      <label htmlFor="file-input">
        <Image
          width={255}
          height={255}
          className={styles.avatar}
          src={showImg()}
          alt="User Avatar"
          priority
        />
      </label>
      <input
        id="file-input"
        type="file"
        name="avatar"
        onChange={handleFileChange}
      />
      <button
        type="button"
        className={`${styles['btn-hover']} btn btn-outline ${styles['change-button']}`}
        onClick={() => document.getElementById('file-input').click()}
      >
        更換頭像
      </button>
    </div>
  )
}
