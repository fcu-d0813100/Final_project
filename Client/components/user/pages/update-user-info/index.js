import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import UserSection from '@/components/user/common/user-section'
import styles from './index.module.scss'
import Image from 'next/image'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'
import DeleteModal from '@/components/shared/modal-delete'
import { toast, Toaster } from 'react-hot-toast'
// import { updateProfileAvatar } from '@/services/user'
// import { avatarBaseUrl } from '@/configs'
import PreviewUploadImage from '@/components/user/common/preview-upload-image'

export default function UpdateInfo() {
  const [selectedFile, setSelectedFile] = useState(null)
  const { auth, update, getUser, deleteUser } = useAuth()
  const router = useRouter()
  // 狀態為物件，屬性對應到表單的欄位名稱
  const [user, setUser] = useState({
    name: '',
    nickname: '',
    gender: '',
    birthday: '',
    email: '',
    img: '',
    phone: '',
    address: '',
    create_at: '',
    updated_at: 'Now()',
    // points: '',
  })
  // 錯誤訊息狀態
  const [errors, setErrors] = useState({
    name: '',
    email: '',
  })

  // 多欄位共用事件函式
  const handleFieldChange = (e) => {
    let nextUser = { ...user, [e.target.name]: e.target.value }
    setUser(nextUser)
  }

  const checkError = (user) => {
    // 表單檢查--START---
    // 1. 建立一個全新的錯誤訊息用物件
    const newErrors = {
      name: '',
      email: '',
    }

    // 2.開始作各欄位的表單檢查，如果有錯誤訊息就加到newErrors
    if (!user.name) {
      newErrors.name = '姓名為必填'
    }

    if (!user.email) {
      newErrors.email = 'Email為必填'
    }
    // 如果newErrors中的物件值中其中有一個非空白字串，代表有錯誤發生
    const hasErrors = Object.values(newErrors).some((v) => v)

    // 表單檢查--END---
    return { newErrors, hasErrors }
  }

  // const handleFileChange = async (e) => {
  //   // 上傳頭像用，有選擇檔案時再上傳
  //   if (selectedFile) {
  //     const formData = new FormData()
  //     // 對照server上的檔案名稱 req.files.avatar
  //     formData.append('avatar', selectedFile)

  //     const res2 = await updateProfileAvatar(formData)

  //     console.log(res2.data)
  //     if (res2.data.status === 'success') {
  //       toast.success('會員頭像修改成功')
  //     }
  //   }
  // }
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 檢查其他用戶資料並進行更新
    const { newErrors, hasErrors } = checkError(user)
    console.log('錯誤檢查:', newErrors, hasErrors) // 檢查錯誤狀態
    setErrors(newErrors)
    if (hasErrors) {
      return
    }

    // 上傳頭像用，有選擇檔案時再上傳
    if (selectedFile) {
      const formData = new FormData()
      formData.append('avatar', selectedFile)

      try {
        const res2 = await update(user, selectedFile)
        console.log('伺服器回應:', res2) // 調試輸出

        const resData = await res2.json()
        console.log('Response data:', resData) // 調試輸出

        if (resData.status === 'success') {
          toast.success('會員頭像修改成功')
        } else {
          console.error('更新失敗 - 響應數據狀態錯誤:', resData.status)
          toast.error('更新失敗，請稍後再試')
        }
      } catch (error) {
        console.error('頭貼更新失敗:', error)
        toast.error('頭貼更新失敗，請稍後再試')
      }
    }

    // 更新用戶資料
    try {
      console.log('發送用戶資料:', user) // 確認發送的資料
      await update(user)
      console.log('更新成功')
      // router.push('/user'); // 跳轉到 /user 頁面
    } catch (error) {
      console.error('更新失敗:', error)
      toast.error('更新失敗，請稍後再試')
    }
  }

  // 初始化會員資料
  const initUserData = async () => {
    const user = await getUser()
    // setUser({ ...user, password: '', confirmPassword: '' })
    setUser(user)
  }

  // 本頁一開始render後就會設定到user狀態中
  useEffect(() => {
    initUserData()
  }, [])

  const [showModal, setShowModal] = useState(false)
  const handleDeleteUser = async () => {
    try {
      // console.log(`開始刪除用戶，ID: ${user.id}`)
      // console.log('用戶刪除成功')
      toast.success('您已成功申請停權', {
        style: {
          border: '1.2px solid #90957a',
          padding: '12px 40px',
          color: '#626553',
        },
        iconTheme: {
          primary: '#626553',
          secondary: '#fff',
        },
      })
      setShowModal(false) // 確保模態對話框被關閉
      await deleteUser(user.id)
      router.push('/user/information/update')
    } catch (error) {
      // console.error('刪除過程中發生錯誤:', error)
      toast.error('刪除過程中發生錯誤，請稍後再試', {
        style: {
          border: '1.2px solid #90957a',
          padding: '12px 40px',
          color: '#963827',
        },
        iconTheme: {
          primary: '#963827',
          secondary: '#fff',
        },
      })
    }
  }

  const openModal = () => {
    // e.preventDefault()
    // 阻止表單提交
    setShowModal(true)
  }
  const closeModal = () => {
    setShowModal(false)
  }
  return (
    <>
      <UserSection titleCN="更新資訊" titleENG="Information">
        <form
          onSubmit={handleSubmit}
          method="post"
          encType="multipart/form-data"
        >
          <div className="d-flex mt-4 container">
            <div className="d-flex row justify-content-between align-items-center">
              <div className="col-9 px-0   d-flex flex-wrap">
                <div className={`col-4 mt-5 ${styles.info} `}>
                  <label htmlFor="name" className="form-label pb-2 fw-bold ">
                    姓名 <span className=" ps pe-4 fw-bold ">| name</span>
                  </label>
                  <span className={`ps ${styles.error} `}>{errors.name}</span>{' '}
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${styles['form-control2']} `}
                    onChange={handleFieldChange}
                    value={user.name}
                  />
                </div>
                <div className={`col-4 mt-5 ${styles.info} `}>
                  <label htmlFor="nickname" className="form-label pb-2 fw-bold">
                    暱稱 <span className="ps pe-4 fw-bold">| nickname</span>
                  </label>{' '}
                  <input
                    name="nickname"
                    onChange={handleFieldChange}
                    value={user.nickname}
                    type="text"
                    className={`form-control ${styles['form-control2']} `}
                  />
                </div>
                <div className={`col-4 mt-5 ${styles.info} `}>
                  <label htmlFor="title " className="form-label pb-2 fw-bold">
                    稱謂 <span className=" ps pe-4 fw-bold">| title</span>
                  </label>{' '}
                  <select
                    name="gender"
                    value={user.gender}
                    onChange={handleFieldChange}
                    className={`form-select ${styles['form-select2']}`}
                  >
                    <option value=" "></option>
                    <option value="1">男士</option>
                    <option value="2">女士</option>
                  </select>
                </div>
                <div className={`col-3 ${styles.info} mt-5`}>
                  <label htmlFor="birthday" className="form-label pb-2 fw-bold">
                    生日 <span className=" ps pe-4 fw-bold">| birthday</span>
                  </label>{' '}
                  <input
                    value={user.birthday}
                    type="date"
                    className={`form-control ${styles['form-control2']} `}
                    name="birthday"
                    onChange={handleFieldChange}
                  />
                </div>
                <div className={`col-3 ${styles.info} mt-5`}>
                  <label htmlFor="phone" className="form-label pb-2 fw-bold">
                    手機 <span className=" ps pe-4 fw-bold">| phone</span>
                  </label>{' '}
                  <input
                    value={user.phone}
                    onChange={handleFieldChange}
                    type="text"
                    className={`form-control ${styles['form-control2']} `}
                    pattern="\d{10}"
                    name="phone"
                  />
                </div>
                <div className={`col-6 ${styles.info} mt-5`}>
                  <label htmlFor="email" className="form-label pb-2 fw-bold">
                    信箱 <span className=" ps pe-5 fw-bold">| email</span>
                  </label>{' '}
                  <span className={`ps ${styles.error} `}>{errors.email}</span>
                  <input
                    value={user.email}
                    onChange={handleFieldChange}
                    type="email"
                    className={`form-control ${styles['form-control2']} `}
                    name="email"
                  />
                </div>
              </div>

              <div className="col-3 d-flex align-items-center">
                <div className="ratio ratio-1x1 w-75">
                  <PreviewUploadImage
                    userId={user.id} // 傳遞用戶ID作為變數
                    avatarBaseUrl="http://localhost:3005/avatar" // 正確的基礎URL
                    defaultImg="avatar01.jpg" // 默認圖片名
                    setSelectedFile={setSelectedFile}
                    selectedFile={selectedFile}
                  />

                  {/* <Image
                    width={255}
                    height={255}
                    className={styles.avatar}
                    src={`/user/img/${user.img}`}
                    alt=""
                    priority
                  /> */}
                </div>
              </div>
              {/* <button
                type="button"
                className="btn btn-outline"
                onClick={handleFileChange}
              >
                更換頭像
              </button> */}
            </div>
          </div>
          {/* 收件資訊 */}
          <div
            className={`row ${styles['address-line']} d-flex align-items-center pb-3 my-5`}
          >
            <h3 className={`h4 ${styles['center-title']} pb-2`}>收件資訊</h3>
          </div>
          <div
            className={`d-flex row ${styles['address-line']} ${styles['address-area']} align-items-center justify-content-start p-0 m-0`}
          >
            <div className={`col ${styles.info} ${styles['address-margin']}`}>
              <label className={`form-label pb-2 fw-bold`}>
                縣市{' '}
                <span className={`ps fw-bold ${styles['info-address']}`}>
                  | city
                </span>
              </label>
              <select className={`form-select  ${styles['form-select2']}`}>
                <option value="">請選擇縣市</option>
                {/* Options omitted for brevity */}
              </select>
            </div>
            <div className={`col ${styles.info} ${styles['address-margin']}`}>
              <label className={`form-label pb-2 fw-bold`}>
                區域{' '}
                <span className={` ps fw-bold ${styles['info-address']}`}>
                  | area
                </span>
              </label>
              <select className={`form-select ${styles['form-select2']}`}>
                <option value="">請選擇區域</option>
              </select>
            </div>
            <div className={`col-7 ${styles.info} ${styles['address-margin']}`}>
              <label className={`form-label pb-2 fw-bold`}>
                地址{' '}
                <span className={`ps ${styles['info-address']} fw-bold`}>
                  | address
                </span>
              </label>
              <input
                type="text"
                className={`form-control ${styles['form-control2']}`}
                name="streetAddress"
                placeholder="請輸入完整地址"
                value={user.address}
                onChange={handleFieldChange}
              />
            </div>
          </div>

          {/* 注意事項與提交按鈕 */}
          <div
            className={`row d-flex justify-content-between align-items-center mt-3`}
          >
            <div className={`col-6`}>
              <p className={`ps ${styles.explain}`}>
                ※請填寫完整的個人資訊，以享有更多會員權益。
              </p>
            </div>
            <div
              className={`col-3 d-flex justify-content-end align-items-center`}
            >
              <button
                type="button"
                onClick={openModal}
                className={` ${styles['delete-account']}`}
              >
                {' '}
                停用會員帳戶{' '}
              </button>{' '}
              <DeleteModal
                title="您確定要停用帳戶嗎 ?"
                content="停用帳戶後，您將無法登入及享有會員權益，如需恢復帳戶，請聯繫客服以重新啟用。"
                btnConfirm="停用帳戶"
                btnCancel="取消"
                ConfirmFn={handleDeleteUser}
                show={showModal}
                handleClose={closeModal}
              />
            </div>
          </div>

          <div
            className={`${styles['submit-area']} d-flex justify-content-end align-items-center row`}
          >
            <button
              type="button"
              className="btn-secondary h6 me-4"
              onClick={() => setUser(user)}
            >
              取消
            </button>
            <button type="submit" className={`btn-primary h6`}>
              儲存
            </button>
          </div>
        </form>
      </UserSection>
    </>
  )
}
