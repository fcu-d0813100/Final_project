import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { initUserData, useAuth } from '@/hooks/use-auth'
import {
  lineLoginRequest,
  lineLogout,
  lineLoginCallback,
  getUserById,
  parseJwt,
} from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'

export default function LineLogin() {
  const { auth, setAuth } = useAuth()
  const router = useRouter()

  // 處理登出
  const handleLineLogout = async () => {
    if (!auth.isAuth) return

    const line_uid = auth.userData.line_uid
    console.log('傳遞的 line_uid:', line_uid)

    const res = await lineLogout(line_uid)

    console.log(res.data)

    // 成功登出並回復初始會員狀態
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

      // 檢查用戶資料返回的結構
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

      // 清理URL
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
      <h1>Line登入頁面+回調頁</h1>

      <p>會員狀態: {auth.isAuth ? '已登入' : '未登入'}</p>
      <p>會員資料: {JSON.stringify(auth.userData)}</p>
      <hr />
      <button onClick={goLineLogin}>LINE 登入</button>
      <br />
      <button onClick={handleLineLogout}>LINE 登出(logout)</button>
      <Toaster />
    </>
  )
}
