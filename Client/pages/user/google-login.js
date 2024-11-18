import useFirebase from '@/hooks/use-firebase'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { googleLogin, checkAuth, logout, parseJwt } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'
import GoogleLogo from '@/components/icons/google-logo'

export default function GoogleLoginPopup() {
  const { loginGoogle, logoutFirebase } = useFirebase()
  const { auth, setAuth } = useAuth()

  // 處理google登入後，要向伺服器進行登入動作
  const callbackGoogleLoginPopup = async (providerData) => {
    console.log('Google登入資料:', providerData)

    if (auth.isAuth) return

    try {
      const res = await googleLogin(providerData)
      console.log('Google登入回應:', res.data)

      if (res.data.status === 'success') {
        const jwtUser = parseJwt(res.data.data.accessToken)
        console.log('JWT用戶資料:', jwtUser)

        // 只需要initUserData中的定義屬性值，詳見use-auth勾子
        const userData = { ...initUserData, ...jwtUser }

        // 設定到全域狀態中
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
        toast.error('登入失敗'),
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
    } catch (error) {
      console.error('Google登入失敗:', error)
      toast.error('登入失敗') <
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

  // 處理檢查登入狀態
  const handleCheckAuth = async () => {
    const res = await checkAuth()
    console.log('檢查登入狀態回應:', res.data)

    if (res.data.status === 'success') {
      toast.success('已登入會員'),
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
      toast.error('非會員身份'),
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

  // 處理登出
  const handleLogout = async () => {
    logoutFirebase()

    const res = await logout()

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

  return (
    <>
      <h1>Google Login跳出視窗(popup)測試頁</h1>
      <p>會員狀態:{auth.isAuth ? '已登入' : '未登入'}</p>
      <button onClick={() => loginGoogle(callbackGoogleLoginPopup)}>
        <GoogleLogo /> Google登入
      </button>
      <br />
      <button onClick={handleLogout}>登出</button>
      <br />
      <button onClick={handleCheckAuth}>向伺服器檢查登入狀態</button>
      <hr />
      {/* 土司訊息視窗用 */}
      <Toaster />
    </>
  )
}
