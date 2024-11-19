import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './index.module.scss'

export default function PreviewUploadImage({
  userId,
  photoUrl,
  avatarBaseUrl = 'http://localhost:3005/public/avatar',
  defaultImg = 'avatar01.jpg',
  setSelectedFile,
  selectedFile,
  avatar,
}) {
  const [preview, setPreview] = useState('')
  const [useDefaultAvatar, setUseDefaultAvatar] = useState(false) // 控制是否使用預設頭貼
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 最大檔案大小 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] // 允許的檔案類型
  const [error, setError] = useState('')

  useEffect(() => {
    if (useDefaultAvatar) {
      setPreview(`${avatarBaseUrl}/${defaultImg}`)
      return
    }

    if (!selectedFile) {
      setPreview('')
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // 當元件unmounted時清除記憶體
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile, useDefaultAvatar, avatarBaseUrl, defaultImg])

  const showImg = () => {
    if (useDefaultAvatar) {
      return `${avatarBaseUrl}/${defaultImg}`
    }

    if (selectedFile) {
      return preview
    }

    if (avatar) {
      return avatar
    }

    if (photoUrl) {
      return photoUrl
    }

    if (userId) {
      const paddedUserId = userId < 10 ? `0${userId}` : userId
      const avatarImg = `avatar${paddedUserId}.jpg`
      return `${avatarBaseUrl}/${avatarImg}`
    }

    return `${avatarBaseUrl}/${defaultImg}`
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) {
      setSelectedFile(null)
      setError('未選擇任何檔案')
      return
    }

    // 檔案類型檢查
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('檔案類型不支援(請選擇JPG、PNG、WebP、GIF檔案)')
      return
    }

    // 檔案大小檢查
    if (file.size > MAX_FILE_SIZE) {
      setError('檔案大小超過5MB(請選擇較小的檔案)')
      return
    }

    // 空檔案檢查
    if (file.size === 0) {
      setError('檔案為空，請重新選擇')
      return
    }

    // 通過檢查
    setSelectedFile(file)
    setUseDefaultAvatar(false) // 如果選擇了新圖片，切換回非預設頭貼
    setError('') // 清空錯誤訊息
  }

  return (
    <>
      <div className={styles['image-upload']}>
        <label htmlFor="file-input">
          <div className={styles['image-container']}>
            <Image
              key={preview}
              width={255}
              height={255}
              className={styles.avatar}
              src={showImg()}
              alt="User Avatar"
              priority
            />
          </div>
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
        {/* 顯示錯誤訊息 */}
        {error && (
          <div className={styles.error}>
            <p className="ps">{error}</p>
          </div>
        )}
      </div>
    </>
  )
}
