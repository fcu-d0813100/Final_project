<<<<<<< HEAD
'use client'
=======
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import UploadImg from '@/components/activity/common/uploadImg'
import SelectInput from '@/components/activity/common/inputSelect'
import InputStyle from '@/components/activity/common/inputStyle'
import Textarea from '@/components/activity/common/Textarea'
import { PiArrowRight } from 'react-icons/pi'
import styles from '@/components/teacher/common/upload.module.scss'
import DashboardTitle from '@/components/shared/dashboard-title-y'
import Sidebar from '@/components/activity/common/Sidebar'
<<<<<<< HEAD
=======
import Swal from 'sweetalert2'
import { RiCloseCircleFill, RiCheckboxCircleFill } from 'react-icons/ri'
import ReactDOMServer from 'react-dom/server'
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2

export default function Upload(props) {
  const router = useRouter()

<<<<<<< HEAD
  // 定義表單狀態
=======
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2
  const [formData, setFormData] = useState({
    CHN_name: '',
    ENG_name: '',
    maxREG: '',
    brand: '',
    address: '',
    start_at: '',
    end_at: '',
    description: '',
  })
<<<<<<< HEAD

  // 定義文件狀態，用於存儲選取的圖片文件
  const [selectedFiles, setSelectedFiles] = useState([])

  // 處理表單輸入變更
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [name]: value,
      }
      // console.log('更新的表單數據:', newData) // 檢查新狀態
      return newData
    })
  }

  // 處理文件選擇，從 UploadImg 組件接收文件
  const handleFileChange = (files) => {
    setSelectedFiles(files) // 更新文件狀態
  }

  // 提交表單數據到後端
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()

      // 檢查 formData 的內容是否正確
      console.log('表單數據:', formData)

      // 添加文字欄位到 FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          data.append(key, value)
        }
      })

      // 添加文件到 FormData
      selectedFiles.forEach((file) => data.append('files', file))

      // 測試 FormData 的內容
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value)
      }
=======
  const [selectedFiles, setSelectedFiles] = useState([])
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors }
      if (name === 'maxREG') {
        if (/^\d+$/.test(value) || value === '不限') {
          delete updatedErrors[name] // 刪除該錯誤
        }
      } else if (value.trim()) {
        delete updatedErrors[name]
      }
      return updatedErrors
    })
  }

  const handleFileChange = (files) => {
    setSelectedFiles(files)
  }

  const showErrorAlert = (message) => {
    Swal.fire({
      iconHtml: ReactDOMServer.renderToString(
        <RiCloseCircleFill color="#963827" size={50} />
      ),
      title: '錯誤',
      text: message,
      customClass: {
        icon: styles.customIcon,
        popup: styles.customPopup,
      },
      showConfirmButton: false,
      timer: 2000,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = '此欄位為必填'
      }
    })

    if (formData.maxREG) {
      if (!/^\d+$/.test(formData.maxREG) && formData.maxREG !== '不限') {
        newErrors.maxREG = '活動名額只能為數字或「不限」'
      } else if (
        formData.maxREG !== '不限' &&
        parseInt(formData.maxREG, 10) === 0
      ) {
        newErrors.maxREG = '活動名額不能為0'
      }
    }

    if (
      formData.start_at &&
      formData.end_at &&
      formData.start_at > formData.end_at
    ) {
      newErrors.end_at = '活動開始日期不能比結束日期晚！'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.entries(newErrors).map(([key, msg]) => {
        switch (key) {
          case 'CHN_name':
            return '請填寫活動中文名稱'
          case 'ENG_name':
            return '請填寫活動英文名稱'
          case 'maxREG':
            return msg
          case 'brand':
            return '請選擇活動品牌'
          case 'address':
            return '請填寫活動地點'
          case 'start_at':
            return msg
          case 'end_at':
            return '請填寫報名結束時間'
          case 'description':
            return '請填寫課程簡介'
          default:
            return msg
        }
      })

      showErrorAlert(errorMessages[0])
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    if (selectedFiles.length !== 3) {
      showErrorAlert('請選擇三張圖片')
      return
    }

    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value)
      })
      selectedFiles.forEach((file) => data.append('files', file))
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2

      const response = await fetch(
        'http://localhost:3005/api/activity/activity-Upload',
        {
          method: 'POST',
          body: data,
<<<<<<< HEAD
          credentials: 'include'
=======
          credentials: 'include',
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2
        }
      )

      if (response.ok) {
<<<<<<< HEAD
        alert('活動上架成功！')
        router.push('/admin/activity') // 成功後跳轉
      } else {
        console.error('提交失敗:', await response.text())
        alert('活動上架失敗，請重試1')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('活動上架失敗，請重試2')
=======
        Swal.fire({
          iconHtml: ReactDOMServer.renderToString(
            <RiCheckboxCircleFill color="#4CAF50" size={50} />
          ),
          title: '成功',
          text: '活動上架成功！',
          showConfirmButton: false,
          timer: 2000,
        })
        router.push('/admin/activity')
      } else {
        showErrorAlert('活動上架失敗，請重試')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      showErrorAlert('活動上架失敗，請重試')
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2
    }
  }

  return (
    <>
      <header
        className={`${styles.header} d-flex justify-content-between align-items-center px-5`}
      >
        <div className="h3-L">Beautique</div>
        <div className="h5">Admin</div>
      </header>

      <div>
        <Sidebar />

        <form onSubmit={handleSubmit}>
          <div className={styles.main}>
            <DashboardTitle chTitle="活動上架" enTitle="New activity" />
            <div className={`${styles.section1} d-flex align-items-end`}>
              <UploadImg
                width="445px"
                height="320px"
                onFileChange={handleFileChange}
<<<<<<< HEAD
=======
                hasError={!!errors.maxREG}
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2
              />

              <div className={`${styles.uploadMainInfo} flex-grow-1`}>
                <div className={styles.subtitle}>
                  <h4 className="h4 pb-2">主要資訊</h4>
                </div>
                <div className={styles.inputArea}>
                  <div className="container d-flex justify-content-between gap-3 mb-3">
                    <InputStyle
                      addclass="col-4"
                      forText="name"
                      titleCh="活動中文名稱"
                      titleEn=" | name"
                      typeText="text"
                      placeholder="請輸入活動名稱"
                      name="CHN_name"
                      onChange={handleInputChange}
<<<<<<< HEAD
=======
                      hasError={!!errors.CHN_name}
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2
                    />
                    <InputStyle
                      addclass="col-4"
                      forText="name"
                      titleCh="活動英文名稱"
                      titleEn=" | name"
                      typeText="text"
                      placeholder="請輸入活動名稱"
                      name="ENG_name"
                      onChange={handleInputChange}
<<<<<<< HEAD
=======
                      hasError={!!errors.ENG_name}
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2
                    />
                    <InputStyle
                      addclass="col-4"
                      forText="price"
                      titleCh="活動名額"
                      titleEn=" | amount"
                      typeText="text"
                      placeholder="請填入活動名額"
                      name="maxREG"
                      onChange={handleInputChange}
<<<<<<< HEAD
=======
                      hasError={!!errors.maxREG}
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2
                    />
                  </div>

                  <div className="container d-flex gap-4 mb-3">
                    <SelectInput
                      addClass="col-5"
                      forText="type"
                      titleCh="活動品牌"
                      titleEn="brand"
<<<<<<< HEAD
                      name="brand" // 指定 name 屬性，和 formData 中的鍵對應
                      onChange={handleInputChange} // 確保 onChange 正確綁定
=======
                      name="brand"
                      onChange={handleInputChange}
                      hasError={!!errors.brand}
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2
                    />
                    <InputStyle
                      addclass="col-7"
                      forText="address"
                      titleCh="活動地點"
                      titleEn=" | address"
                      typeText="text"
                      placeholder="請填入地址"
                      name="address"
                      onChange={handleInputChange}
<<<<<<< HEAD
=======
                      hasError={!!errors.address}
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2
                    />
                  </div>
                  <div className="container d-flex align-items-end justify-content-between gap-2">
                    <InputStyle
                      addclass="col-6 me-1"
                      forText="start_at"
                      titleCh="報名開始時間"
                      titleEn=" | registration start"
                      typeText="date"
                      placeholder="開始日期"
                      name="start_at"
                      onChange={handleInputChange}
<<<<<<< HEAD
=======
                      hasError={!!errors.start_at}
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2
                    />
                    <p className="col-1 d-flex justify-content-center align-items-center">
                      <PiArrowRight className="ph" />
                    </p>
                    <InputStyle
                      addclass="col-5 ms-1"
                      forText="end_at"
                      titleCh="報名結束時間"
                      titleEn=" | registration end"
                      typeText="date"
                      placeholder="結束日期"
                      name="end_at"
                      onChange={handleInputChange}
<<<<<<< HEAD
=======
                      hasError={!!errors.end_at}
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2
                    />
                  </div>
                </div>
              </div>
            </div>
            <hr className="opacity-75" />
            <div className={`${styles.section02}`}>
              <div className={`${styles.workshopDetail} p-5`}>
                <Textarea
                  addclass="mb-4"
                  title="課程簡介"
                  name="description" // 確保 name 與 formData 中的鍵對應
                  rows="5"
                  width="100%"
                  placeholder="最多輸入200字"
<<<<<<< HEAD
                  value={formData.description} // 使用 formData 中的值
                  onChange={handleInputChange} // 傳入父組件的 handleInputChange 回調
=======
                  value={formData.description}
                  onChange={handleInputChange}
                  hasError={!!errors.description}
>>>>>>> aefcf016f9a9a755025bcf59f95c47e8f19975e2
                />
              </div>
            </div>

            <div className="ms-auto d-flex justify-content-end mt-2">
              <Link href="/admin/activity">
                <button className="btn-secondary h6 me-3" type="button">
                  取消
                </button>
              </Link>
              <button className="btn-primary h6" type="submit">
                上架
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
