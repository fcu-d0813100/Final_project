import { useState, useEffect } from 'react'
// countdown use
import useInterval from '@/hooks/use-interval'
import { requestOtpToken, resetPassword } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'
import styles from './index.module.scss'
import { PiEyeClosed, PiEye, PiLockLight } from 'react-icons/pi'
import { CiMail } from 'react-icons/ci'
import Router from 'next/router'
export default function ForgetPassword() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [disableBtn, setDisableBtn] = useState(false)

  //   可以觀看的密碼的眼睛
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 倒數計時 countdown use
  const [count, setCount] = useState(60) // 60s
  const [delay, setDelay] = useState(null) // delay=null可以停止, delay是數字時會開始倒數

  // 倒數計時 countdown use
  useInterval(() => {
    setCount(count - 1)
  }, delay)
  // 倒數計時 countdown use
  useEffect(() => {
    if (count <= 0) {
      setDelay(null)
      setDisableBtn(false)
    }
  }, [count])

  // 處理要求一次性驗證碼用
  const handleRequestOtpToken = async () => {
    if (delay !== null) {
      toast.error(' 60s內無法重新獲得驗證碼', {
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
      return
    }

    const res = await requestOtpToken(email)

    // 除錯用
    console.log(res.data)

    if (res.data.status === 'success') {
      toast.success('驗證碼已寄送到電子郵件中', {
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
      setCount(60) // 倒數 60秒
      setDelay(1000) // 每 1000ms = 1s 減1
      setDisableBtn(true)
    } else {
      toast.error(`${res.data.message}`, {
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

  // 處理重設密碼用
  const handleResetPassword = async () => {
    // 表單驗証 - START
    if (!email) {
      toast.error('請填寫電子郵件', {
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

    // 表單驗証 - START
    if (!token) {
      toast.error('請填寫驗證碼', {
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
    if (!password || !confirmPassword) {
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

    if (password !== confirmPassword) {
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

    const res = await resetPassword(email, password, token)
    // 除錯用
    // console.log(res.data)

    if (res.data.status === 'success') {
      toast.success('密碼已成功修改', {
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
      setTimeout(() => {
        Router.push('/user/login/user')
      }, 2000)
    } else {
      toast.error(` ${res.data.message}`, {
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
  // 處理取消按鈕
  const handleCancel = () => {
    setEmail('')
    setToken('')
    setPassword('')
    setConfirmPassword('')
  }
  return (
    <>
      <div className="container my-5">
        <div className="row mt-4 d-flex justify-content-center align-items-center">
          <div className="col-11 col-xl-8 mb-3">
            <h3 className={`pb-5 ${styles.title}`}>忘記密碼</h3>
            <label htmlFor="email" className="form-label h6">
              電子郵件信箱
            </label>
          </div>
          <div className="col-11 col-xl-8 mb-2">
            <div className={`${styles['input-password']} col-12`}>
              <CiMail className={`${styles['icon-lock']}`} />
              <input
                type="text"
                name="email"
                className={`form-control ${styles['form-focus']}`}
                placeholder="請輸入會員信箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="row mt-3">
              <div className="col-12 col-xl-8">
                <div className="input-group">
                  {/* 一次性驗證碼 */}
                  <button
                    onClick={handleRequestOtpToken}
                    disabled={disableBtn}
                    className={`btn btn-outline-secondary ${styles['btn-style']}`}
                    id="button-addon2"
                  >
                    {delay ? count + '秒後可以再次取得驗證碼' : '取得驗證碼'}
                  </button>
                  <input
                    className={`form-control ps-3 ${styles['form-focus']} ${styles['input-token']}`}
                    placeholder="請輸入6碼信箱驗證碼"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4 d-flex justify-content-center align-items-center">
          <div className="col-11 col-xl-8 mb-2">
            <label htmlFor="new-password" className="form-label h6">
              新密碼
            </label>
          </div>
          <div className="col-11 col-xl-8 mb-3">
            <div className={`${styles['input-password']} col-12`}>
              <PiLockLight className={`${styles['icon-lock']}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${styles['form-focus']}`}
                name="new"
                placeholder="請輸入新密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
        </div>

        <div className="row mt-4 d-flex justify-content-center align-items-center">
          <div className="col-11 col-xl-8 mb-2">
            <label htmlFor="confirm-password" className="form-label h6">
              確認密碼
            </label>
          </div>
          <div className="col-11 col-xl-8 mb-3">
            <div className={`${styles['input-password']} col-12`}>
              <PiLockLight className={`${styles['icon-lock']}`} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`form-control ${styles['form-focus']}`}
                placeholder="請再次輸入新密碼"
                name="confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.eyeiclosed}
              >
                {showConfirmPassword ? <PiEye /> : <PiEyeClosed />}
              </button>
            </div>
            <div>
              <p className="ps pt-5">
                ※所有會員修改，將同時變更於Beautique會員資料。
              </p>
            </div>
          </div>
        </div>

        <div className="row d-flex justify-content-end align-items-center">
          <div className="col-6 h6 d-flex ">
            <button
              className="btn btn-secondary h6 me-3"
              onClick={handleCancel}
            >
              取消
            </button>
            <button
              className="btn btn-primary h6 me-3"
              onClick={handleResetPassword}
            >
              確認
            </button>
          </div>
        </div>
      </div>

      {/* 土司訊息視窗用 */}
      <Toaster />
    </>
  )
}
