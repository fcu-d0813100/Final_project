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

  // 模擬會員登入
  const login = (account, password) => {
    if (account === 'herry' && password === '12345') {
      setAuth({
        isAuth: true,
        userData: {
          id: 1,
          name: '哈利',
          email: 'herry@test.com',
          account: 'herry',
        },
      })

      // 歡迎訊息與詢問是否要到個人資料頁
      if (confirm('你好，是否要前往個人資料頁?')) {
        router.push('/user')
      }
    } else {
      alert('帳號或密碼錯誤')
    }
  }

  // 模擬會員登出
  const logout = () => {
    setAuth({
      isAuth: false,
      userData: {
        id: 0,
        name: '',
        email: '',
        account: '',
      },
    })
  }

  //3. 最外(上)元件階層包裹提供者元件，可以提供它的值給所有後代⼦孫元件使⽤，包含所有頁面元件，與頁面中的元件
  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
