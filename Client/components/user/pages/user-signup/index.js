import { useState } from 'react'
import styles from './index.module.scss'
import { PiEyeClosed, PiEye } from 'react-icons/pi'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'

export default function RegisterForm() {
  // 從勾子的context得到註冊函式
  const { register } = useAuth()
  const router = useRouter()
  // 狀態為物件，屬性對應到表單的欄位名稱
  const [user, setUser] = useState({
    account: '',
    password: '',
    confirmPassword: '',
    name: '',
    // gender: '',
    // birthday: '',
    email: '',
    agree: false, // checkbox 同意會員註冊條款
  })
  // 錯誤訊息狀態
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    account: '',
    password: '',
    confirmPassword: '',
    agree: '', // 錯誤訊息用字串
  })
  // checkbox 呈現密碼用
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  // 多欄位共用事件函式
  const handleFieldChange = (e) => {
    // ES6特性: 計算得來的物件屬性名稱(computed property name)
    let nextUser = { ...user, [e.target.name]: e.target.value }

    if (e.target.name === 'agree') {
      nextUser = { ...user, agree: e.target.checked }
    }
    setUser(nextUser)
  }

  const checkError = (user) => {
    // 表單檢查--START---
    // 1. 建立一個全新的錯誤訊息用物件
    const newErrors = {
      name: '',
      email: '',
      account: '',
      password: '',
      confirmPassword: '',
      agree: '',
    }

    // 2.開始作各欄位的表單檢查，如果有錯誤訊息就加到newErrors
    if (!user.name) {
      newErrors.name = '姓名為必填'
    }

    if (!user.email) {
      newErrors.email = 'Email為必填'
    }

    if (!user.account) {
      newErrors.account = '帳號為必填'
    }

    if (!user.agree) {
      newErrors.agree = '請先同意會員註冊條款'
    }

    if (user.password !== user.confirmPassword) {
      newErrors.password = '密碼與確認密碼需要相同'
      newErrors.confirmPassword = '密碼與確認密碼需要相同'
    }

    // if (user.password.length < 6) {
    //   newErrors.password = '密碼長度不能小於6'
    // }

    if (!user.password) {
      newErrors.password = '密碼為必填'
    }

    if (!user.confirmPassword) {
      newErrors.confirmPassword = '確認密碼為必填'
    }

    // 如果newErrors中的物件值中其中有一個非空白字串，代表有錯誤發生
    const hasErrors = Object.values(newErrors).some((v) => v)

    // 表單檢查--END---
    return { newErrors, hasErrors }
  }
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
    // 刪除不必要的欄位
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, agree, ...newUser } = user
    // 呼叫register(useAuth勾子裡)
    await register(newUser)
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={styles['bg-img']}>
          <div className={`container ${styles['container-login']}`}>
            <div
              className={`vh-100 d-flex justify-content-center align-items-center flex-column py-2 ${styles['login-section']}`}
            >
              <div
                className={`shadow d-flex justify-content-between align-items-center ${styles['bg-card']}`}
              >
                {/* 註冊表單區塊 */}

                <div className={`d-inline ${styles['card-login']}`}>
                  <div>
                    <h1 className={styles['login-title']}>SIGNUP</h1>
                  </div>
                  <div className={styles['input-area']}>
                    <label htmlFor="account" className={styles['text-input']}>
                      帳號:{' '}
                      <span className={`d-inline ${styles['text-red']} ps-1`}>
                        *
                      </span>{' '}
                      <span className={styles.error}>{errors.account}</span>
                    </label>
                    <input
                      type="text"
                      name="account"
                      value={user.account}
                      onChange={handleFieldChange}
                      className={styles['line-input']}
                      placeholder="請輸入帳號"
                    />
                  </div>
                  <div
                    className={`${styles['input-area']} ${styles['line-input-pw']}`}
                  >
                    <label htmlFor="password" className={styles['text-input']}>
                      密碼:{' '}
                      <span className={`d-inline ${styles['text-red']} ps-1`}>
                        *
                      </span>{' '}
                      <span className={styles.error}>{errors.password}</span>
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={user.password}
                      onChange={handleFieldChange}
                      className={`${styles['line-input']} `}
                      placeholder="請輸入英文字母及數字"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles.eyeiclosed}
                    >
                      {showPassword ? <PiEye /> : <PiEyeClosed />}
                    </button>
                  </div>
                  <div
                    className={`${styles['input-area']} ${styles['line-input-pw']}`}
                  >
                    <label
                      htmlFor="confirmPassword"
                      className={styles['text-input']}
                    >
                      確認密碼:{' '}
                      <span className={`d-inline ${styles['text-red']} ps-1`}>
                        *
                      </span>
                      <span className={styles.error}>
                        {errors.confirmPassword}
                      </span>
                    </label>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={user.confirmPassword}
                      onChange={handleFieldChange}
                      className={`${styles['line-input']} `}
                      placeholder="請再次輸入密碼"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={styles.eyeiclosed}
                    >
                      {showConfirmPassword ? <PiEye /> : <PiEyeClosed />}
                    </button>
                  </div>
                  <div className="row p-0 m-0 d-flex justify-content-between">
                    <div
                      className={`${styles['input-area']} ${styles['line-input-pw']} pe-2 col-md-6 col-12`}
                    >
                      <label htmlFor="name" className={styles['text-input']}>
                        姓名:{' '}
                        <span className={`d-inline ${styles['text-red']} ps-1`}>
                          *
                        </span>{' '}
                        <span className={styles.error}>{errors.name}</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleFieldChange}
                        className={`${styles['line-input']} `}
                      />
                    </div>
                    <div
                      className={`${styles['input-area']} ${styles['line-input-pw']} pe-2 col-12 col-md-6`}
                    >
                      <label htmlFor="email" className={styles['text-input']}>
                        Email:{' '}
                        <span
                          className={`d-inline ${styles['text-red']} ps-1 `}
                        >
                          *
                        </span>{' '}
                        <span className={styles.error}>{errors.email}</span>
                      </label>
                      <input
                        type="text"
                        name="email"
                        value={user.email}
                        onChange={handleFieldChange}
                        className={`${styles['line-input']} `}
                        placeholder="請輸入Email"
                      />
                    </div>
                  </div>
                  <div className={`form-check ${styles['form-area']} my-2 `}>
                    <div>
                      <label className={`form-check-label ps`}>
                        <input
                          className={`form-check-input ${styles['form-check-input2']}`}
                          type="checkbox"
                          name="agree"
                          checked={user.agree}
                          onChange={handleFieldChange}
                        />{' '}
                        我已閱讀並同意《會員權益聲明》
                      </label>
                    </div>
                  </div>
                  <div className="d-grid col-12 pt-1">
                    <button
                      type="submit"
                      className={`btn-primary h6 ${styles['btn-primary']}`}
                    >
                      創建帳號
                    </button>
                  </div>
                  <div className="d-flex justify-content-end align-items-start">
                    <div className={`${styles['signup-rwd']} pt-3`}>
                      已經有帳號了?{' '}
                      <Link href="/user/login/user" className="text-black">
                        立即登入
                      </Link>
                    </div>
                  </div>
                </div>

                <div
                  className={`d-flex flex-column align-items-center justify-content-center ${styles['card-img']}`}
                >
                  <button
                    type="button"
                    className={styles['logo']}
                    onClick={() => {
                      setTimeout(() => {
                        router.push('/')
                      }, 1500)
                    }}
                  >
                    Beautique
                  </button>
                  <h3 className={styles['slogan']}>
                    Where Beauty <br /> Meets Unique.
                  </h3>
                  <h6 className={`h6 ${styles['text']}`}>
                    已經是Beautique會員?立即登入享受會員專屬體驗！{' '}
                  </h6>
                  <div className="col-12 d-flex justify-content-center align-items-center">
                    <Link href="/user/login/user">
                      <button
                        type="button"
                        className={`btn-outline h6 ${styles['btn-outline']}`}
                      >
                        立即登入
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <p
                className={`ps-phone text-white text-center ${styles['copyright']}`}
              >
                © 2024 COPYRIGHT@BEAUTIQUE CO.,LTD.ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
