import styles from '@/components/activity/common/uploadImg/index.module.scss'
import { PiPlus } from 'react-icons/pi'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { RiCloseCircleFill } from 'react-icons/ri'
import ReactDOMServer from 'react-dom/server'

export default function UploadImg({ width, height, onFileChange, hasError }) {
  const [previews, setPreviews] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])

  const showAlert = (
    message,
    icon = <RiCloseCircleFill color="#963827" />,
    timer = 1500
  ) => {
    const iconHtml = ReactDOMServer.renderToString(icon)
    Swal.fire({
      html: `
        <div class="${styles['custom-alert-content']}">
          <span class="${styles['custom-icon']}">${iconHtml}</span>
          <span>${message}</span>
        </div>
      `,
      showConfirmButton: false,
      timer: timer,
      position: 'center',
      width: '300px',
      padding: '1em',
      customClass: {
        popup: `${styles['custom-popup']}`,
      },
    })
  }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files)
    if (selectedFiles.length + files.length > 3) {
      showAlert('最多只能選擇三張圖片')
      return
    }
    const updatedFiles = [...selectedFiles, ...files]
    setSelectedFiles(updatedFiles)
    onFileChange(updatedFiles)

    const newPreviews = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(newPreviews).then((results) => {
      setPreviews((prev) => [...prev, ...results])
    })
  }

  const handleReSelect = () => {
    setSelectedFiles([])
    setPreviews([])
    onFileChange([])
    document.getElementById('fileInput').click()
  }

  const handleRemoveImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    onFileChange(newFiles)
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  return (
    <>
      <div
        className={`${styles.uploadCover} ${
          hasError ? styles.errorBorder : ''
        }`}
        style={{ width, height }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="fileInput"
          multiple
        />
        <div
          className="text-center"
          style={{ width, height }}
          role="button"
          tabIndex="0"
          onClick={() => document.getElementById('fileInput').click()}
          onKeyDown={(e) =>
            handleKeyDown(e, () => document.getElementById('fileInput').click())
          }
        >
          {previews.length === 0 ? (
            <div className={`${styles.picUploadText} d-flex flex-column`}>
              <PiPlus className={styles.plus} />

              <p className="h4 mt-3">
                新增圖片
                <br /> <span className="p">(必填)</span>
              </p>
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
                    type="button"
                    className={styles.removeImageButton}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveImage(index)
                    }}
                    onKeyDown={(e) =>
                      handleKeyDown(e, () => handleRemoveImage(index))
                    }
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {previews.length > 0 && (
          <a
            className={`${styles.reSelectImg} btn-outline h6`}
            role="button"
            tabIndex="0"
            onClick={(e) => {
              e.stopPropagation()
              handleReSelect()
            }}
            onKeyDown={(e) => handleKeyDown(e, handleReSelect)}
          >
            重新選取
          </a>
        )}
      </div>
    </>
  )
}
