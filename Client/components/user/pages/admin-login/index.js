import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'
export default function AdminLogin(props) {
  const router = useRouter()
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const role = 'admin'
  const { auth, login, logout } = useAuth()
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
                <h3 className={styles['slogan']}>WELCOME！Admin </h3>
                <h6 className={`h6 ${styles['text']}`}>
                  歡迎回到 Beautique 管理介面！
                  <br />
                  請輸入您的帳號與密碼，立即進入，開啟今日的管理任務。{' '}
                </h6>
              </div>
              {/* 登入表單區塊 */}

              <div className={`d-inline ${styles['card-login']}`}>
                <div className={styles['admin-title']}>Beautiuqe Admin</div>
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
                    placeholder="請輸入帳號/信箱"
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
                      placeholder="請輸入英文字母及數字"
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
