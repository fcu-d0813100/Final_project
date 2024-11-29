import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import UploadImg from '@/components/activity/common/uploadImg'
import SelectInput from '@/components/activity/common/inputSelect'
import Sidebar from '@/components/activity/common/Sidebar'
import DashboardTitle from '@/components/shared/dashboard-title-y'
import styles from '@/components/activity/page/activity-Edit/index.module.scss'
import Swal from 'sweetalert2'
import ReactDOMServer from 'react-dom/server'
import { RiCheckboxCircleFill, RiCloseCircleFill } from 'react-icons/ri'
import { PiArrowRight } from 'react-icons/pi'
import AdminSideBar from '@/components/activity/common/admin-side-bar'
export default function Edit() {
  const router = useRouter()
  const { id } = router.query
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

  useEffect(() => {
    if (id) {
      const fetchActivity = async () => {
        try {
          const response = await fetch(
            `http://localhost:3005/api/activity/id?id=${id}`
          )
          if (response.ok) {
            const data = await response.json()
            setFormData(data)
          } else {
            console.error('Failed to load activity data')
          }
        } catch (error) {
          console.error('Error fetching activity data:', error)
        }
      }
      fetchActivity()
    }
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
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
      showConfirmButton: false,
      timer: 2000,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value)
      })
      selectedFiles.forEach((file) => data.append('files', file))

      const response = await fetch(
        `http://localhost:3005/api/activity/activity-edit/${id}`,
        {
          method: 'PUT',
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
          text: '活動編輯成功！',
          showConfirmButton: false,
          timer: 2000,
        })
        router.push('/admin/activity')
      } else {
        showErrorAlert('活動編輯失敗，請重試')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      showErrorAlert('活動編輯失敗，請重試')
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
            <DashboardTitle chTitle="活動編輯" enTitle="Activity Edit" />
            <div className={`${styles.section1} d-flex align-items-end`}>
              <UploadImg
                width="200px"
                height="200px"
                onFileChange={handleFileChange}
              />
            </div>
            <hr className="opacity-75" />
            <div className={`${styles.section02} d-flex`}>
              <div className={`${styles.uploadMainInfo} flex-grow-1 col-6`}>
                <div className={styles.subtitle}>
                  <h4 className="h4 pb-2">主要資訊</h4>
                </div>
                <div className={styles.inputArea}>
                  <div className="container d-flex justify-content-between gap-3 mb-3">
                    <div className={`${styles.inputstyle} col-4`}>
                      <label htmlFor="CHN_name" className="d-block p mb-2">
                        活動中文名稱 <span>| name</span>
                      </label>
                      <input
                        type="text"
                        placeholder="請輸入活動名稱"
                        name="CHN_name"
                        value={formData.CHN_name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={`${styles.inputstyle} col-4`}>
                      <label htmlFor="ENG_name" className="d-block p mb-2">
                        活動英文名稱 <span>| name</span>
                      </label>
                      <input
                        type="text"
                        placeholder="請輸入活動名稱"
                        name="ENG_name"
                        value={formData.ENG_name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={`${styles.inputstyle} col-4`}>
                      <label htmlFor="maxREG" className="d-block p mb-2">
                        活動名額 <span>| amount</span>
                      </label>
                      <input
                        type="text"
                        placeholder="請填入活動名額"
                        name="maxREG"
                        value={formData.maxREG}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="container d-flex  mb-3">
                    <SelectInput
                      addClass="col-5 me-1"
                      forText="brand"
                      titleCh="活動品牌"
                      titleEn="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                    />
                    <p className="col d-flex justify-content-center align-items-center opacity-0">
                      <PiArrowRight className="ph" />
                    </p>
                    <div className={`${styles.inputstyle} col-7 ms-1`}>
                      <label htmlFor="address" className="d-block p mb-2">
                        活動地點 <span>| address</span>
                      </label>
                      <input
                        type="text"
                        placeholder="請填入活動地點"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="container d-flex align-items-end justify-content-between">
                    <div className={`${styles.inputstyle} col-6 me-1`}>
                      <label htmlFor="start_at" className="d-block p mb-2">
                        報名開始時間 <span>| registration start</span>
                      </label>
                      <input
                        type="date"
                        name="start_at"
                        value={formData.start_at}
                        onChange={handleInputChange}
                      />
                    </div>

                    <p className="col d-flex justify-content-center align-items-center">
                      <PiArrowRight className="ph" />
                    </p>
                    <div className={`${styles.inputstyle} col-6 ms-1`}>
                      <label htmlFor="end_at" className="d-block p mb-2">
                        報名結束時間 <span>| registration end</span>
                      </label>
                      <input
                        type="date"
                        name="end_at"
                        value={formData.end_at}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${styles.workshopDetail} p-5 col-6`}>
                <div className={`mb-4`}>
                  <label
                    htmlFor="description"
                    className={`${styles.label} h4 mb-3 d-block`}
                  >
                    活動簡介
                    <span>| description</span>
                  </label>
                  <textarea
                    name="description"
                    rows="5"
                    className={`${styles.detailTextarea} p-3`}
                    style={{ width: '100%' }}
                    placeholder="最多輸入200字"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className={`${styles.Btncon} d-flex justify-content-end`}>
              <Link href="/admin/activity">
                <button className="btn-secondary h6 me-3">取消</button>
              </Link>
              <button className="btn-primary h6" type="submit">
                儲存
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
