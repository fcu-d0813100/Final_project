import { useState, useEffect } from 'react'
import styles from './index.module.scss'
import { useRouter } from 'next/router'
import { GrGoogle } from 'react-icons/gr'
import { FaLine } from 'react-icons/fa6'
import { PiEyeClosed, PiEye } from 'react-icons/pi'
import Link from 'next/link'
import { initUserData, useAuth } from '@/hooks/use-auth'
import toast, { Toaster } from 'react-hot-toast'
import useFirebase from '@/hooks/use-firebase'
import {
  lineLoginRequest,
  lineLogout,
  lineLoginCallback,
  getUserById,
  parseJwt,
} from '@/services/user'

export default function UserLogin() {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const role = 'user'
  const { auth, login, callbackGoogleLogin, setAuth } = useAuth()
  const { loginGoogle, logoutFirebase } = useFirebase()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  // 處理一般登入
  const handleLogin = () => {
    if (auth.isAuth) {
      toast.error('您已經登入了'),
        {
          style: {
            padding: '12px 40px',
            color: '#963827',
            fontSize: '18px',
          },
          iconTheme: {
            primary: '#963827',
            secondary: '#fff',
          },
        }
      return
    }
    login(account, password, role)
  }

  // 處理登出
  const handleLineLogout = async () => {
    if (!auth.isAuth) return

    const line_uid = auth.userData.line_uid
    console.log('傳遞的 line_uid:', line_uid)

    const res = await lineLogout(line_uid)
    console.log(res.data)

    if (res.data.status === 'success') {
      toast.success('已成功登出'),
        {
          style: {
            padding: '12px 40px',
            color: '#626553',
            fontSize: '18px',
          },
          iconTheme: {
            primary: '#626553',
            secondary: '#fff',
          },
        }
      setAuth({
        isAuth: false,
        userData: initUserData,
      })
    } else {
      toast.error('登出失敗'),
        {
          style: {
            padding: '12px 40px',
            color: '#963827',
            fontSize: '18px',
          },
          iconTheme: {
            primary: '#963827',
            secondary: '#fff',
          },
        }
    }
  }

  const callbackLineLogin = async (query) => {
    const res = await lineLoginCallback(query)
    console.log('Callback Response:', res.data)

    if (res.data.status === 'success') {
      const jwtUser = parseJwt(res.data.data.accessToken)
      console.log('JWT User:', jwtUser)

      const res1 = await getUserById(jwtUser.id)
      console.log('User Data Response:', res1.data)

      if (res1.data && res1.data.user) {
        const dbUser = res1.data.user
        console.log('Database User:', dbUser)
        const userData = { ...initUserData }

        for (const key in userData) {
          if (Object.hasOwn(dbUser, key)) {
            userData[key] = dbUser[key] || ''
          }
        }

        console.log('UserData:', userData)

        setAuth({
          isAuth: true,
          userData,
        })

        toast.success('已成功登入'),
          {
            style: {
              padding: '12px 40px',
              color: '#626553',
              fontSize: '18px',
            },
            iconTheme: {
              primary: '#626553',
              secondary: '#fff',
            },
          }
      } else {
        console.error(
          '登入後無法得到會員資料:',
          res1.data.message || '未知錯誤'
        )
        toast.error('登入後無法得到會員資料'),
          {
            style: {
              padding: '12px 40px',
              color: '#963827',
              fontSize: '18px',
            },
            iconTheme: {
              primary: '#963827',
              secondary: '#fff',
            },
          }
      }
    } else {
      console.error('已是登入狀態或登入失敗:', res.data.message || '未知錯誤')
      toast.error('已是登入狀態或登入失敗'),
        {
          style: {
            padding: '12px 40px',
            color: '#963827',
            fontSize: '18px',
          },
          iconTheme: {
            primary: '#963827',
            secondary: '#fff',
          },
        }
    }
  }

  // 處理登入
  const goLineLogin = () => {
    if (auth.isAuth) return
    lineLoginRequest()
  }

  // 從line登入畫面後回調到本頁面用
  useEffect(() => {
    if (router.isReady) {
      if (!router.query.code) return
      callbackLineLogin(router.query)

      const cleanUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname
      window.history.replaceState({ path: cleanUrl }, '', cleanUrl)
    }
  }, [router.isReady, router.query])

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
                <button
                  type="button"
                  className={styles['logo']}
                  onClick={() => {
                    setTimeout(() => {
                      router.push('/')
                    }, 1000)
                  }}
                >
                  Beautique
                </button>
                <h3 className={styles['slogan']}>
                  Where Beauty <br /> Meets Unique.
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
                    onChange={(e) => setAccount(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
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
                  <Link
                    href="/user/forget-password"
                    className={`${styles['forget-ps']} ps`}
                  >
                    忘記密碼
                  </Link>
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
                {/* <button
                  onClick={() => {
                    setAccount('Bella')
                    setPassword('12345')
                  }}
                >
                  一鍵輸入
                </button> */}
                {/*  */}
                <div
                  className={`${styles['signin-area']} row pt-4 d-flex justify-content-end align-items-start`}
                >
                  <div className={`col-7 ${styles['signin-rwd']}`}>
                    還沒有帳號?{' '}
                    <Link href="/user/register" className="text-black">
                      立即註冊
                    </Link>
                  </div>
                  <div className="col-5 d-flex justify-content-end align-items-center">
                    <FaLine
                      className={styles['icon-line']}
                      onClick={goLineLogin}
                    />
                    <GrGoogle
                      className={styles['icon-google']}
                      onClick={() => {
                        if (auth.isAuth) {
                          toast.error('您已經登入了'),
                            {
                              style: {
                                padding: '12px 40px',
                                color: '#963827',
                                fontSize: '18px',
                              },
                              iconTheme: {
                                primary: '#963827',
                                secondary: '#fff',
                              },
                            }
                          return
                        }
                        loginGoogle(callbackGoogleLogin)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles['copyright']}>
              <p className={`ps-phone text-white text-center `}>
                © 2024 COPYRIGHT@BEAUTIQUE CO.,LTD.ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
