import { useState } from 'react'
import styles from './index.module.scss'
import { GrGoogle } from 'react-icons/gr'
import { FaLine } from 'react-icons/fa6'
import { PiEyeClosed, PiEye } from 'react-icons/pi'
import Link from 'next/link'
import { initUserData, useAuth } from '@/hooks/use-auth'
import toast, { Toaster } from 'react-hot-toast'
import { googleLogin, parseJwt } from '@/services/user'
import useFirebase from '@/hooks/use-firebase'

export default function UserLogin() {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const role = 'user'
  const { auth, login, setAuth } = useAuth()
  const { loginGoogle, logoutFirebase } = useFirebase()
  const [showPassword, setShowPassword] = useState(false)

  // 處理一般登入
  const handleLogin = () => {
    login(account, password, role)
  }

  // 處理Google登入
  const callbackGoogleLogin = async (providerData) => {
    console.log('Google登入資料:', providerData)

    if (auth.isAuth) return

    try {
      const res = await googleLogin(providerData)
      console.log('Google登入回應:', res.data)

      if (res.data.status === 'success') {
        const jwtUser = parseJwt(res.data.data.accessToken)
        console.log('JWT用戶資料:', jwtUser)

        const userData = { ...initUserData, ...jwtUser }

        setAuth({
          isAuth: true,
          userData,
        })

        toast.success('已成功登入', {
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
      } else {
        toast.error('登入失敗，請稍後再試', {
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
    } catch (error) {
      toast.error('登入失敗，請稍後再試', {
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
              {/* 左側圖片區塊 */}
              <div
                className={`d-flex flex-column align-items-center justify-content-center ${styles['card-img']}`}
              >
                <h2 className={styles['logo']}>Beautique</h2>
                <h3 className={styles['slogan']}>
                  Where Beauty <br /> Meets Uniqueness.
                </h3>
                <h6 className={`h6 ${styles['text']}`}>
                  註冊成為Beautique會員，第一時間掌握最新美妝潮流！
                </h6>
                <div className="col-12 d-flex justify-content-center align-items-center">
                  <Link href="/user/register">
                    <button
                      type="button"
                      className={`btn-outline h6 ${styles['btn-outline']}`}
                    >
                      立即註冊
                    </button>
                  </Link>
                </div>
              </div>
              {/* 右側登入表單區塊 */}
              <div className={`d-inline ${styles['card-login']}`}>
                <div>
                  <h1 className={styles['login-title']}>LOGIN</h1>
                </div>
                <div className={styles['input-area']}>
                  <label htmlFor="account" className={styles['text-input']}>
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
                </div>
                <div
                  className={`${styles['input-area']} ${styles['line-input-pw']}`}
                >
                  <label htmlFor="password" className={styles['text-input']}>
                    密碼
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                    }}
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
                <div className={`form-check ${styles['form-area']} my-4 `}>
                  <div>
                    <input
                      className={`form-check-input ${styles['form-check-input2']}`}
                      type="checkbox"
                      value=""
                      id="remember"
                    />
                    <label className={`form-check-label ps`} htmlFor="remember">
                      記住帳密
                    </label>
                  </div>
                  <a href="#" className={`${styles['forget-ps']} ps`}>
                    忘記密碼
                  </a>
                </div>
                <div className="d-grid col-12 pt-4">
                  <button
                    onClick={handleLogin}
                    className={`btn-primary h6 ${styles['btn-primary']}`}
                  >
                    登入
                  </button>
                </div>
                {/*  */}
                <button
                  onClick={() => {
                    setAccount('Bella')
                    setPassword('12345')
                  }}
                >
                  一鍵輸入
                </button>
                {/*  */}
                <div className="row pt-4 d-flex justify-content-end align-items-start">
                  <div className={`col-7 ${styles['signin-rwd']}`}>
                    還沒有帳號?{' '}
                    <Link href="/user/signup" className="text-black">
                      立即註冊
                    </Link>
                  </div>
                  <div className="col-5 d-flex justify-content-end align-items-center">
                    <FaLine className={styles['icon-line']} />
                    <GrGoogle
                      className={styles['icon-google']}
                      onClick={() => loginGoogle(callbackGoogleLogin)}
                    />
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
      <Toaster />
    </>
  )
}
