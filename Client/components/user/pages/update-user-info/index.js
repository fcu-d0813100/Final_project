import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import UserSection from '@/components/user/common/user-section'
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './index.module.scss'
import Image from 'next/image'
import { useAuth } from '@/hooks/use-auth'

export default function UpdateInfo() {
  // 從勾子的context得到註冊函式
  const { update, getUser } = useAuth()
  // 狀態為物件，屬性對應到表單的欄位名稱
  const [user, setUser] = useState({
    name: '',
    account: '',
    // password: '',
    // confirmPassword: '',
    nickname: '',
    gender: '',
    birthday: '',
    email: '',
    Img: '',
    phone: '',
    address: '',
    create_at: '',
    updated_at: '',
    // points: '',
  })
  // 錯誤訊息狀態
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    account: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e) => {
    // 固定的ajax/fetch的語法，會在表單submit觸發的第一行阻擋表單的預設行為
    e.preventDefault()

    // 檢查錯誤
    const { newErrors, hasErrors } = checkError(user)
    // 呈現錯誤訊息
    setErrors(newErrors)
    // 有錯誤，不送到伺服器，跳出此函式
    if (hasErrors) {
      return // 跳出此函式，在下面的程式碼不會再執行
    }

    // 送到伺服器
    // 刪除不必要的欄位(不一定需要)
    const { confirmPassword, ...newUser } = user
    // 呼叫register(useAuth勾子裡)
    await update(newUser)
  }
  const { auth } = useAuth()
  // 初始化會員資料
  const initUserData = async () => {
    const user = await getUser()
    // 這是要更改密碼才會有的欄位
    // setUser({ ...member, password: '', confirmPassword: '' })
    setUser(user)
  }

  // 本頁一開始render後就會設定到user狀態中
  useEffect(() => {
    initUserData()
  }, [])
  return (
    <>
      <UserSection titleCN="更新資訊" titleENG="Information">
        <form action="" method="post" encType="multipart/form-data">
          <div class="d-flex mt-4 container">
            <div class="d-flex row justify-content-between align-items-center">
              <div class="col-9 px-0   d-flex flex-wrap">
                <div class={`col-4 mt-5 ${styles.info} `}>
                  <label htmlFor="name" class="form-label pb-2">
                    姓名 <span class=" ps pe-4 ">| name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    class={`form-control ${styles['form-control2']} `}
                  />
                </div>
                <div class={`col-4 mt-5 ${styles.info} `}>
                  <label class="form-label pb-2">
                    暱稱 <span class="ps pe-4">| nickname</span>
                  </label>
                  <input
                    type="text"
                    class={`form-control ${styles['form-control2']} `}
                  />
                </div>
                <div class={`col-4 mt-5 ${styles.info} `}>
                  <label class="form-label pb-2">
                    稱謂 <span class=" ps pe-4">| title</span>
                  </label>
                  <input
                    type="text"
                    class={`form-control ${styles['form-control2']} `}
                  />
                </div>
                <div class={`col-3 ${styles.info} mt-5`}>
                  <label class="form-label pb-2">
                    生日 <span class=" ps pe-4">| birthday</span>
                  </label>
                  <input
                    type="date"
                    class={`form-control ${styles['form-control2']} `}
                    name="birthday"
                  />
                </div>
                <div class={`col-3 ${styles.info} mt-5`}>
                  <label class="form-label pb-2">
                    手機 <span class=" ps pe-4">| phone</span>
                  </label>
                  <input
                    type="tel"
                    class={`form-control ${styles['form-control2']} `}
                    pattern="\d{10}"
                    name="phone"
                  />
                </div>
                <div class={`col-6 ${styles.info} mt-5`}>
                  <label class="form-label pb-2">
                    信箱 <span class=" ps pe-5">| email</span>
                  </label>
                  <input
                    type="email"
                    class={`form-control ${styles['form-control2']} `}
                    name="email"
                  />
                </div>
              </div>
              <div class="col-3 d-flex align-items-center">
                <div class="ratio ratio-1x1 w-75">
                  <Image
                    width={255}
                    height={255}
                    className={styles.avatar}
                    src="/user/img/avatar02.jpg"
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
              <label className={`form-label pb-2`}>
                居住縣市{' '}
                <span className={`ps ${styles['info-address']}`}>| city</span>
              </label>
              <select className={`form-select ${styles['form-select2']}`}>
                <option value="" disabled selected>
                  請選擇縣市
                </option>
                {/* Options omitted for brevity */}
              </select>
            </div>
            <div className={`col ${styles.info} ${styles['address-margin']}`}>
              <label className={`form-label pb-2`}>
                居住區域{' '}
                <span className={` ps ${styles['info-address']}`}>| area</span>
              </label>
              <select className={`form-select ${styles['form-select2']}`}>
                <option value="" disabled selected>
                  請選擇區域
                </option>
              </select>
            </div>
            <div className={`col-7 ${styles.info} ${styles['address-margin']}`}>
              <label className={`form-label pb-2`}>
                地址{' '}
                <span className={`ps ${styles['info-address']}`}>
                  | address
                </span>
              </label>
              <input
                type="text"
                className={`form-control ${styles['form-control2']}`}
                name="streetAddress"
                placeholder="請輸入完整地址"
              />
            </div>
          </div>

          {/* 注意事項與提交按鈕 */}
          <div
            className={`row d-flex justify-content-between align-items-center mt-3`}
          >
            <div className={`col-6`}>
              <p className={styles.ps}>
                ※請填寫完整的個人資訊，以享有更多會員權益。
              </p>
            </div>
            <div
              className={`col-3 d-flex justify-content-end align-items-center`}
            >
              <a href="" className={`p ${styles['delete-account']}`}>
                停用會員帳戶
              </a>
            </div>
          </div>

          <div
            className={`${styles['submit-area']} d-flex justify-content-end align-items-center row`}
          >
            <Link href="/user/information">
              <button type="button" className={`btn-success h6 me-4`}>
                上一頁
              </button>
            </Link>
            <button type="button" className={`btn-secondary h6 me-4`}>
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
