import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './index.module.scss'
export default function PreviewUploadImage({
  avatarImg = '',
  avatarBaseUrl = '',
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

  const handleFileChang = (e) => {
    const file = e.target.files[0]

    if (file) {
      setSelectedFile(file)
    } else {
      setSelectedFile(null)
    }
  }

  const showImg = () => {
    if (selectedFile) {
      return preview
    }

    if (avatarImg) {
      return avatarBaseUrl + '/' + avatarImg
    }

    return avatarBaseUrl + '/' + defaultImg
  }

  return (
    <div className={`${styles['image-upload']} `}>
      <label htmlFor="file-input">
        <Image
          width={255}
          height={255}
          className={styles.avatar}
          src={showImg()}
          alt=""
          priority
        />
      </label>
      <input
        id="file-input"
        type="file"
        name="file"
        onChange={handleFileChang}
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
