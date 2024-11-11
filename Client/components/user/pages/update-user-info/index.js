import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import UserSection from '@/components/user/common/user-section'
import styles from './index.module.scss'
import Image from 'next/image'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'
import DeleteModal from '@/components/shared/modal-delete'
import { toast, Toaster } from 'react-hot-toast'

export default function UpdateInfo() {
  // 從勾子的context得到註冊函式
  const { update, getUser, deleteUser } = useAuth()
  const router = useRouter()
  // 狀態為物件，屬性對應到表單的欄位名稱
  const [user, setUser] = useState({
    name: '',
    // account: '',
    // password: '',
    // confirmPassword: '',
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
    // account: '',
    // password: '',
    // confirmPassword: '',
  })

  // 多欄位共用事件函式
  const handleFieldChange = (e) => {
    // ES6特性: 計算得來的物件屬性名稱(computed property name)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { newErrors, hasErrors } = checkError(user)
    console.log('錯誤檢查:', newErrors, hasErrors) // 檢查錯誤狀態
    setErrors(newErrors)
    if (hasErrors) {
      return
    }
    try {
      console.log('發送用戶資料:', user) // 確認發送的資料
      await update(user)
      console.log('更新成功')
      router.push('/user') // 跳轉到 /user 頁面
    } catch (error) {
      console.error('更新失敗:', error)
    }
  }
  // 初始化資料的狀態
  // const [initialUser] = useState({
  //   name: '',
  //   account: '',
  //   nickname: '',
  //   gender: '',
  //   birthday: '',
  //   email: '',
  //   img: '',
  //   phone: '',
  //   address: '',
  //   create_at: '',
  //   updated_at: 'Now()',
  // })

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
      await deleteUser(user.id)
      toast.success('您已成功申請停權')
      router.push('/user/information/update')
    } catch (error) {
      console.error('刪除過程中發生錯誤:', error)
    }
  }
  const openModal = (e) => {
    e.preventDefault()
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
                  <Image
                    width={255}
                    height={255}
                    className={styles.avatar}
                    src={`/user/img/${user.img}`}
                    alt=""
                  />
                </div>
              </div>
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
                onClick={openModal}
                className={`btn btn-danger ${styles['delete-account']}`}
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
