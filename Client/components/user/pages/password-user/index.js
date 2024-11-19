import React, { useState } from 'react'
import UserSection from '@/components/user/common/user-section'
import styles from './index.module.scss'
import { PiEyeClosed, PiEye, PiLockLight } from 'react-icons/pi'
import toast, { Toaster } from 'react-hot-toast'
import { updatePassword } from '@/services/user'
import { useAuth } from '@/hooks/use-auth'

// 定義要在此頁呈現/編輯的會員資料初始物件
const initUserPassword = {
  origin: '', // 原本密碼，要比對成功才能修改
  new: '', // 新密碼
  confirm: '', //確認新密碼用(前端檢查用，不送後端)
}
// checkbox 呈現密碼用

export default function Password() {
  // 需要會員登入時的id
  const { auth } = useAuth()
  // 本頁狀態用
  const [userPassword, setUserPassword] = useState(initUserPassword)
  // 純粹觀察userPassword狀態變化用
  // useEffect(() => {
  //   console.log('userPassword狀態變化', userPassword)
  // }, [userPassword])

  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 輸入資料用
  const handleFieldChange = (e) => {
    setUserPassword({ ...userPassword, [e.target.name]: e.target.value })
  }

  // 送出表單用
  const handleSubmit = async (e) => {
    // 阻擋表單預設送出行為
    e.preventDefault()

    // 表單驗証 - START
    if (!userPassword.new || !userPassword.origin || !userPassword.confirm) {
      toast.error('密碼欄位為必填', {
        style: {
          padding: '12px 40px',
          color: '#963827',
          fontSize: '18px',
        },
        iconTheme: {
          primary: '#963827',
          secondary: '#fff',
        },
      })
      return // 跳出函式
    }

    if (userPassword.new !== userPassword.confirm) {
      toast.error('新密碼與確認密碼不同', {
        style: {
          padding: '12px 40px',
          color: '#963827',
          fontSize: '18px',
        },
        iconTheme: {
          primary: '#963827',
          secondary: '#fff',
        },
      })
      return // 跳出函式
    }
    // 表單驗証 - END

    // 送到伺服器進行更新
    const password = { origin: userPassword.origin, new: userPassword.new }
    const res = await updatePassword(auth.userData.id, password)

    console.log(res.data)

    if (res.data.status === 'success') {
      toast.success('密碼修改成功', {
        style: {
          padding: '12px 40px',
          color: '#626553',
          fontSize: '18px',
        },
        iconTheme: {
          primary: '#626553',
          secondary: '#fff',
        },
      })
      setUserPassword(initUserPassword)
    } else {
      toast.error('密碼修改失敗', {
        style: {
          padding: '12px 40px',
          color: '#963827',
          fontSize: '18px',
        },
        iconTheme: {
          primary: '#963827',
          secondary: '#fff',
        },
      })
    }
  }

  // 未登入時，不會出現頁面內容
  if (!auth.isAuth) return <></>
  return (
    <>
      <UserSection titleCN="變更密碼" titleENG="Password">
        <form onSubmit={handleSubmit}>
          <div
            className={`${styles['password-area']} row d-flex justify-content-center align-items-center`}
          >
            <div className="col-11 col-xl-8 mb-3">
              <label htmlFor="old-password" className="form-label h6">
                原密碼
              </label>
            </div>
            <div className={`${styles['input-password']} col-11 col-xl-8 mb-3`}>
              <PiLockLight className={`${styles['icon-lock']}`} />
              <input
                name="origin"
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${styles['form-focus']}`}
                value={userPassword.origin}
                onChange={handleFieldChange}
                placeholder="請輸入原密碼"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeiclosed}
              >
                {showPassword ? <PiEye /> : <PiEyeClosed />}
              </button>
            </div>
          </div>
          <div className="row mt-4 d-flex justify-content-center align-items-center">
            <div className="col-11 col-xl-8 mb-3">
              <label htmlFor="new-password" className="form-label h6">
                新密碼
              </label>
            </div>
            <div className={`${styles['input-password']} col-11 col-xl-8 mb-3`}>
              <PiLockLight className={`${styles['icon-lock']}`} />
              <input
                type={showNewPassword ? 'text' : 'password'}
                className={`form-control ${styles['form-focus']}`}
                name="new"
                value={userPassword.new}
                onChange={handleFieldChange}
                placeholder="請輸入新密碼"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className={styles.eyeiclosed}
              >
                {showNewPassword ? <PiEye /> : <PiEyeClosed />}
              </button>
            </div>
          </div>

          <div className="row mt-4 d-flex justify-content-center align-items-center">
            <div className="col-11 col-xl-8 mb-3">
              <label htmlFor="confirm-password" className="form-label h6">
                確認密碼
              </label>
            </div>
            <div className={`${styles['input-password']} col-11 col-xl-8 mb-3`}>
              <PiLockLight className={`${styles['icon-lock']}`} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`form-control ${styles['form-focus']}`}
                placeholder="請再次輸入新密碼"
                name="confirm"
                value={userPassword.confirm}
                onChange={handleFieldChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.eyeiclosed}
              >
                {showConfirmPassword ? <PiEye /> : <PiEyeClosed />}
              </button>
            </div>
          </div>

          {/* <div
            className={`${styles['email-area']} row d-flex justify-content-center align-items-center mt-5`}
          >
            <div
              className={`${styles['email-rwd']} col-11 col-xl-4 justify-content-center align-items-center`}
            >
              <div className="form-check col-6 col-xl-12">
                <input
                  className={`form-check-input ${styles['form-check-input2']}`}
                  type="checkbox"
                  value=""
                  id="default-check1"
                />
                <label className="form-check-label p" htmlFor="default-check1">
                  email 密碼驗證
                </label>
              </div>
              <div className="col-6 col-xl-12">
                <p className={`${styles['email-text']} ps`}>
                  *以個人資訊 email驗證
                </p>
              </div>
            </div>

            <div className="col-11 col-xl-4">
              <div className="input-group mb-3">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  驗證碼
                </span>
                <input
                  type="text"
                  className={`form-control ps-3 ${styles['form-focus']}`}
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                  placeholder="請輸入信箱驗證碼"
                />
              </div>
            </div>
          </div> */}

          <div
            className={`${styles['line-title-down']} row d-flex justify-content-end align-items-center`}
          >
            <div className="col-12 h6 d-flex justify-content-end pt-5">
              <button className="btn btn-secondary h6 me-3">取消</button>
              <button className="btn btn-primary h6" type="submit">
                確認
              </button>
            </div>
          </div>
        </form>
        {/* 土司訊息視窗用 */}
        <Toaster />
      </UserSection>
    </>
  )
}
