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

  const register = async (user) => {
    try {
      console.log('開始發送註冊請求:', user)

      const res = await fetch('http://localhost:3005/api/user/register', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(user),
      })

      const resData = await res.json()

      console.log('伺服器響應:', resData) // 調試輸出

      if (resData.status === 'success') {
        confirm(
          'success',
          '註冊成功',
          '你已成功註冊，現在要跳轉到登入頁面嗎？',
          '去登入',
          () => {
            router.push('/user/login')
          }
        )
      } else {
        confirm('error', '失敗', resData.message, '重試', () => {
          // 在這裡加入重新操作或其他處理邏輯
        })
      }
    } catch (error) {
      console.error('註冊過程中發生錯誤:', error) // 調試輸出
      confirm('error', '失敗', '伺服器錯誤，請稍後重試', '重試', () => {
        // 在這裡加入重新操作或其他處理邏輯
      })
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
      setAuth({
        isAuth: true,
        userData: user,
      })

      // 歡迎訊息與詢問是否要到個人資料頁
      if (confirm('你好，是否要前往個人資料頁?')) {
        router.push('/user')
      }
    } else {
      alert('帳號或密碼錯誤')
    }
  }

  // 更新資料
  const update = async (user) => {
    // 向伺服器作fetch
    const res = await fetch('http://localhost:3005/api/user', {
      credentials: 'include', // 設定cookie必要設定，如果有需要授權或認証一定要加
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT', //更新時用PUT
      body: JSON.stringify(user),
    })

    const resData = await res.json()
    if (resData.status === 'success') {
      confirm('success', '更新完成', '已更新完成', '確認', () => {
        // 在這裡可以添加更新完成後的操作
      })
    } else {
      confirm(
        'error',
        '失敗',
        `${resData.message}\n請檢查以下錯誤詳細信息：${JSON.stringify(
          resData.errors || {}
        )}`,
        '重試',
        () => {
          // 在這裡可以添加失敗後的操作
        }
      )
    }
  }

  // 會員登出
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
      router.push('/')
      console.log('登出成功')
      // 導到首頁
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

  // 很簡單的保護，但還是會先瀏覽到那頁面，如果要檔的話，要加入載入動畫去檔
  // 登入路由 - 當要進入隱私路由但未登入時，會跳轉到登入路由
  const loginRoute = '/user/login'
  // 隱私(保護)路由
  const protectedRoutes = ['/user']
  // 檢查會員狀態
  const checkState = async () => {
    try {
      const url = 'http://localhost:3005/api/user'
      const res = await fetch(url, {
        credentials: 'include', // 設定cookie或是存取隱私資料時要加這個參數
        method: 'GET',
      })

      const resData = await res.json()
      console.log(resData)

      if (resData.status === 'success') {
        const user = resData.data.user
        // 設定全域的AuthContext(useAuth勾子)
        const nextAuth = {
          isAuth: true,
          userData: {
            id: user.id,
            account: user.account,
          },
        }
        setAuth(nextAuth)
      } else {
        // 作隱私路由跳轉
        if (protectedRoutes.includes(router.pathname)) {
          // 減緩跳轉時間
          setTimeout(() => {
            alert('無進入權限，請先登入!')
            router.push(loginRoute)
          }, 1500)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
  // didMount+didUpdate
  useEffect(() => {
    if (router.isReady && !auth.isAuth) {
      checkState()
    }
    // 加入router.pathname是為了要在伺服器檢查後
    // 如果是隱私路由+未登入，就要執行跳轉到登入頁路由的工作
    // eslint-disable-next-line
   }, [router.isReady, router.pathname])

  //3. 最外(上)元件階層包裹提供者元件，可以提供它的值給所有後代⼦孫元件使⽤，包含所有頁面元件，與頁面中的元件
  return (
    <AuthContext.Provider
      value={{ auth, getUser, login, logout, register, update }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
