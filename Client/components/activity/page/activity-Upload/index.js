'use client'
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

export default function Upload(props) {
  const router = useRouter()

  // 定義表單狀態
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

      const response = await fetch(
        'http://localhost:3005/api/activity/activity-Upload',
        {
          method: 'POST',
          body: data,
          credentials: 'include'
        }
      )

      if (response.ok) {
        alert('活動上架成功！')
        router.push('/admin/activity') // 成功後跳轉
      } else {
        console.error('提交失敗:', await response.text())
        alert('活動上架失敗，請重試1')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('活動上架失敗，請重試2')
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
                    />
                  </div>

                  <div className="container d-flex gap-4 mb-3">
                    <SelectInput
                      addClass="col-5"
                      forText="type"
                      titleCh="活動品牌"
                      titleEn="brand"
                      name="brand" // 指定 name 屬性，和 formData 中的鍵對應
                      onChange={handleInputChange} // 確保 onChange 正確綁定
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
                  value={formData.description} // 使用 formData 中的值
                  onChange={handleInputChange} // 傳入父組件的 handleInputChange 回調
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
