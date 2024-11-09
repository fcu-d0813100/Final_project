import { useState, useEffect } from 'react'
// countdown use
import useInterval from '@/hooks/use-interval'
import { requestOtpToken, resetPassword } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'
import styles from './index.module.scss'
import { PiEyeClosed, PiEye, PiLockLight } from 'react-icons/pi'
import { CiMail } from 'react-icons/ci'

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

  // 處理要求一次性驗証碼用
  const handleRequestOtpToken = async () => {
    if (delay !== null) {
      toast.error('錯誤 - 60s內無法重新獲得驗証碼')
      return
    }

    const res = await requestOtpToken(email)

    // 除錯用
    console.log(res.data)

    if (res.data.status === 'success') {
      toast.success('資訊 - 驗証碼已寄送到電子郵件中')
      setCount(60) // 倒數 60秒
      setDelay(1000) // 每 1000ms = 1s 減1
      setDisableBtn(true)
    } else {
      toast.error(`錯誤 - ${res.data.message}`)
    }
  }

  // 處理重設密碼用
  const handleResetPassword = async () => {
    const res = await resetPassword(email, password, token)
    // 除錯用
    console.log(res.data)

    if (res.data.status === 'success') {
      toast.success('資訊 - 密碼已成功修改')
    } else {
      toast.error(`錯誤 - ${res.data.message}`)
    }
  }
  return (
    <>
      <div
        className={`${styles['password-area']} row d-flex justify-content-center align-items-center`}
      >
        <div className="col-11 col-xl-8 mb-3">
          <h2 className="pb-5">忘記密碼</h2>

          <label
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            htmlFor="email"
            className="form-label h6"
          >
            電子郵件信箱
          </label>
        </div>
        <div className={`${styles['input-password']} col-11 col-xl-8 mb-3`}>
          <CiMail className={`${styles['icon-lock']}`} />
          <input
            name="email"
            type="text"
            className={`form-control ${styles['form-focus']}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="請輸入電子郵件信箱"
          />
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
      </div>

      <div
        className={`${styles['email-area']} row d-flex justify-content-center align-items-center mt-5`}
      >
        <div className="col-11 col-xl-4">
          <div className="input-group mb-3">
            <span
              className={`input-group-text ${styles['span-color']}`}
              id="inputGroup-sizing-default"
            >
              驗證碼
            </span>
            <input
              className={`form-control ps-3 ${styles['form-focus']}`}
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              placeholder="請輸入信箱驗證碼"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div
        className={`${styles['line-title-down']} row d-flex justify-content-end align-items-center`}
      >
        <div className="col-12 h6 d-flex justify-content-end pt-5">
          <button className="btn btn-secondary h6 me-3">取消</button>
          <button
            className="btn btn-primary h6 me-3"
            onClick={handleResetPassword}
          >
            重設密碼
          </button>
        </div>
      </div>

      {/* <label>
        電子郵件信箱:
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleRequestOtpToken} disabled={disableBtn}>
        {delay ? count + '秒後可以再次取得驗証碼' : '取得驗証碼'}
      </button>
      <br />
      <label>
        一次性驗証碼:
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </label>
      <br />
      <label>
        新密碼:
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleResetPassword}>重設密碼</button> */}
      {/* 土司訊息視窗用 */}
      <Toaster />
    </>
  )
}
