import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// import { register } from 'module'

// 1. 建立與導出它
// 傳入參數為defaultValue，是在套用context時錯誤或失敗才會得到的值。
// 可以使用有意義的預設值，或使用null(通常目的是為了除錯)
const AuthContext = createContext(null)
// 設定displayName屬性，這是搭配React DevTools使用的
AuthContext.displayName = 'AuthContext'

export function AuthProvider({ children }) {
  const router = useRouter()

  const [auth, setAuth] = useState({
    isAuth: false, // 代表會員是否已經登入的信號值
    userData: {
      id: 0,
      name: '',
      email: '',
      account: '',
    },
  })

  // 解析accessToken用的函式
  const parseJwt = (token) => {
    const base64Payload = token.split('.')[1]
    const payload = Buffer.from(base64Payload, 'base64')
    return JSON.parse(payload.toString())
  }

  // 得到會員個人的資料(登入之後才可以用)
  const getUser = async () => {
    // 向伺服器作fetch
    const res = await fetch(`http://localhost:3005/api/user`, {
      credentials: 'include', // 設定cookie必要設定，如果有需要授權或認証一定要加
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
    const resData = await res.json()

    if (resData.status === 'success') {
      return resData.data.user
    } else {
      console.warn(resData)
      return {}
    }
  }

  // 註冊
  const register = async (user) => {
    // 向伺服器作fetch
    const res = await fetch('http://localhost:3005/api/user', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(user),
    })

    const resData = await res.json()

    if (resData.status === 'success') {
      confirm(
        'success',
        '歡迎',
        '你已註冊成功，現在要進行登入嗎？',
        '進行登入',
        () => {
          router.push('/user/login')
        }
      )
    } else {
      'error', '失敗', resData.message
    }
  }

  // 模擬會員登入
  const login = async (account, password) => {
    // 向伺服器作fetch
    const res = await fetch('http://localhost:3005/api/user/login', {
      credentials: 'include', // 設定cookie必要設定，如果有需要授權或認証一定要加
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ account, password }),
    })

    const resData = await res.json()

    if (resData.status === 'success') {
      // 可以得到id和username
      const jwtData = parseJwt(resData.data.accessToken)

      console.log(jwtData)
      // console.log(user)
      // 獲得會員其它個人資料(除了密碼之外)
      const user = await getUser(jwtData.id)

      console.log(user)

      //   // 設定到狀態中
      //   setAuth({
      //     isAuth: true,
      //     userData: user,
      //   })

      // 歡迎訊息與詢問是否要到個人資料頁
      if (confirm('你好，是否要前往個人資料頁?')) {
        router.push('/user')
      }
    } else {
      alert('帳號或密碼錯誤')
    }
  }

  // 模擬會員登出
  const logout = async () => {
    // 向伺服器作fetch
    const res = await fetch('http://localhost:3005/api/user/logout', {
      credentials: 'include', // 設定cookie必要設定，如果有需要授權或認証一定要加
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: '',
    })

    const resData = await res.json()

    if (resData.status === 'success') {
      alert('成功登出!')

      setAuth({
        isAuth: false,
        userData: {
          id: 0,
          name: '',
          email: '',
          account: '',
        },
      })
    } else {
      alert('登出失敗!')
    }
  }

  //3. 最外(上)元件階層包裹提供者元件，可以提供它的值給所有後代⼦孫元件使⽤，包含所有頁面元件，與頁面中的元件
  return (
    <AuthContext.Provider value={{ auth, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
