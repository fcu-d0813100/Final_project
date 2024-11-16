import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
// import { PiEyeClosed } from 'react-icons/pi'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'
export default function TeacherLogin(props) {
  const router = useRouter()
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const role = 'teacher'

  const { auth, login, logout } = useAuth()

  // checkbox 呈現密碼用
  // const [showPassword, setShowPassword] = useState(false)
  const handleLogin = () => {
    login(account, password, role)
  }
  return (
    <>
      <div className={styles['bg-img']}>
        <div className={`container ${styles['container-login']}`}>
          <div
            className={`vh-100 d-flex justify-content-center align-items-center flex-column py-2 ${styles['login-section']}`}
          >
            <div
              className={`shadow d-flex justify-content-between align-items-center ${styles['bg-card']}`}
            >
              {/* 圖片區塊 */}
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
                <h3 className={styles['slogan']}>WELCOME！Makeup Artist </h3>
                <h6 className={`h6 ${styles['text']}`}>
                  我們的專業，成就您的美麗。
                  <br />
                  課程由業界資深化妝師親自授課，擁有豐富的經驗和技巧，
                  <br />
                  將前沿的化妝技術傳授給學員。
                </h6>
              </div>
              {/* 登入表單區塊 */}

              <div className={`d-inline ${styles['card-login']}`}>
                <div className={styles['admin-title']}>Makeup Artist</div>
                <div className={styles['input-padding']}>
                  <div>
                    <h1 className={styles['login-title']}>LOGIN</h1>
                  </div>
                  <label htmlFor="username" className={styles['text-input']}>
                    帳號
                  </label>
                  <input
                    type="text"
                    value={account}
                    onChange={(e) => {
                      setAccount(e.target.value)
                    }}
                    className={styles['line-input']}
                    placeholder="請輸入教師帳號"
                  />
                  <div
                    className={`${styles['input-area']} ${styles['line-input-pw']}`}
                  >
                    <label htmlFor="password" className={styles['text-input']}>
                      密碼
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                      }}
                      className={`${styles['line-input']} `}
                      placeholder="請輸入教師密碼"
                    />
                    {/* <PiEyeClosed className={styles.eyeiclosed} /> */}
                  </div>

                  <div className="d-grid col-12 pt-4">
                    <button
                      onClick={handleLogin}
                      className={`btn-primary h6 ${styles['btn-primary']}`}
                    >
                      登入
                    </button>
                  </div>

                  {/* <button
                    onClick={() => {
                      setAccount('Gina-Bettelli')
                      setPassword('12345')
                    }}
                  >
                    一鍵輸入
                  </button> */}
                  {/*  */}
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
    </>
  )
}
