import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import UploadImg from '@/components/activity/common/uploadImg'
import SelectInput from '@/components/activity/common/inputSelect'
import InputStyle from '@/components/activity/common/inputStyle'
import Textarea from '@/components/activity/common/Textarea'
import { PiArrowRight } from 'react-icons/pi'
import styles from '@/components/activity/page/activity-Upload/index.module.scss'
import DashboardTitle from '@/components/shared/dashboard-title-y'
import Sidebar from '@/components/activity/common/Sidebar'
import Swal from 'sweetalert2'
import { RiCloseCircleFill, RiCheckboxCircleFill } from 'react-icons/ri'
import ReactDOMServer from 'react-dom/server'
import AdminSideBar from '@/components/activity/common/admin-side-bar'
export default function Upload(props) {
  const router = useRouter()

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
    if (
      formData.start_at &&
      formData.end_at &&
      formData.start_at > formData.end_at
    ) {
      newErrors.end_at = '活動開始日期不能比結束日期晚！'
    }

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
            return msg
          case 'description':
            return '請填寫活動簡介'
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

      const response = await fetch(
        'http://localhost:3005/api/activity/activity-Upload',
        {
          method: 'POST',
          body: data,
          credentials: 'include',
        }
      )

      if (response.ok) {
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
    }
  }

  return (
    <>
      <header
        className={`${styles.header} d-flex justify-content-between align-items-center px-5`}
      >
        <div className={`${['h3-L']}`}>Beautique</div>
        <div className="h5">Admin</div>
        <div></div>
      </header>

      <div
        className="d-flex
      "
      >
        <AdminSideBar />
        <form onSubmit={handleSubmit}>
          <div className={styles.main}>
            <DashboardTitle chTitle="活動上架" enTitle="New activity" />
            <div
              className={`${styles.section1} 
            `}
            >
              <UploadImg
                width="200px"
                height="200px"
                onFileChange={handleFileChange}
                hasError={selectedFiles.length !== 3}
              />
            </div>
            <hr className="opacity-75" />
            <div className={`${styles.section02}`}>
              <div className={`${styles.uploadMainInfo} flex-grow-1`}>
                <div className={styles.subtitle}>
                  <h4 className="h4 mb-4 pb-2">主要資訊</h4>
                </div>
                <div className={`${styles.inputArea} d-flex `}>
                  <div className="left col-6">
                    <div className="container d-flex justify-content-between mb-3">
                      <InputStyle
                        addclass="col-4 me-2"
                        forText="name"
                        titleCh="活動中文名稱"
                        titleEn=" | name"
                        typeText="text"
                        placeholder="請輸入活動名稱"
                        name="CHN_name"
                        onChange={handleInputChange}
                        hasError={!!errors.CHN_name}
                      />
                      <InputStyle
                        addclass="col-4 ms-2 me-2"
                        forText="name"
                        titleCh="活動英文名稱"
                        titleEn=" | name"
                        typeText="text"
                        placeholder="請輸入活動名稱"
                        name="ENG_name"
                        onChange={handleInputChange}
                        hasError={!!errors.ENG_name}
                      />
                      <InputStyle
                        addclass="col-4 ms-2 me-1"
                        forText="price"
                        titleCh="活動名額"
                        titleEn=" | amount"
                        typeText="text"
                        placeholder="請填入活動名額"
                        name="maxREG"
                        onChange={handleInputChange}
                        hasError={!!errors.maxREG}
                      />
                    </div>

                    <div className="container d-flex  align-items-end justify-content-between  mb-3">
                      <SelectInput
                        addClass="col-5 me-1"
                        forText="type"
                        titleCh="活動品牌"
                        titleEn="brand"
                        name="brand"
                        onChange={handleInputChange}
                        hasError={!!errors.brand}
                      />
                      <p className="col d-flex justify-content-center align-items-center opacity-0">
                        <PiArrowRight className="ph" />
                      </p>
                      <InputStyle
                        addclass="col-7 ms-1"
                        forText="address"
                        titleCh="活動地點"
                        titleEn=" | address"
                        typeText="text"
                        placeholder="請填入地址"
                        name="address"
                        onChange={handleInputChange}
                        hasError={!!errors.address}
                      />
                    </div>
                    <div className="container d-flex align-items-end justify-content-between ">
                      <InputStyle
                        addclass="col-6 me-1"
                        forText="start_at"
                        titleCh="報名開始時間"
                        titleEn=" | registration start"
                        typeText="date"
                        placeholder="開始日期"
                        name="start_at"
                        onChange={handleInputChange}
                        hasError={!!errors.start_at}
                      />
                      <p className="col d-flex justify-content-center align-items-center">
                        <PiArrowRight className="ph" />
                      </p>
                      <InputStyle
                        addclass="col-6 ms-1"
                        forText="end_at"
                        titleCh="報名結束時間"
                        titleEn=" | registration end"
                        typeText="date"
                        placeholder="結束日期"
                        name="end_at"
                        onChange={handleInputChange}
                        hasError={!!errors.end_at}
                      />
                    </div>
                  </div>
                  <div className="right col-6">
                    {' '}
                    <div className={`${styles.workshopDetail} ms-5  `}>
                      <Textarea
                        addclass="mb-4"
                        title="活動簡介"
                        titleEn=" | description"
                        name="description"
                        rows="5"
                        width="100%"
                        placeholder="活動描述..."
                        value={formData.description}
                        onChange={handleInputChange}
                        hasError={!!errors.description}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.Btncon} d-flex justify-content-end `}>
              <Link href="/admin/activity">
                <button className="btn-secondary h6 me-3" type="button">
                  取消
                </button>
              </Link>
              <button className="btn-primary h6 " type="submit">
                上架
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
