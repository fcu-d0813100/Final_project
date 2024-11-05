import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// 建立管理員的 Context
const AdminAuthContext = createContext(null)
AdminAuthContext.displayName = 'AdminAuthContext'

export function AdminAuthProvider({ children }) {
  const router = useRouter()

  const [adminAuth, setadminAuth] = useState({
    isadminAuth: false,
    adminData: {
      id: 0,
      name: '',
      account: '',
    },
  })

  // // 解析accessTeacherToken用的函式
  // const parseJwt = (token) => {
  //   const base64Payload = token.split('.')[1]
  //   const payload = Buffer.from(base64Payload, 'base64')
  //   return JSON.parse(payload.toString())
  // }

  // 得到會員個人的資料(登入之後才可以用)
  const getadmin = async () => {
    // 向伺服器作fetch
    const res = await fetch(`http://localhost:3005/api/admin`, {
      credentials: 'include', // 設定cookie必要設定，如果有需要授權或認証一定要加
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
    const resAdminData = await res.json()

    if (resAdminData.status === 'success') {
      return resAdminData.data.admin
    } else {
      console.warn(resAdminData)
      return {}
    }
  }

  // 管理員登入
  const adminLogin = async (account, password) => {
    // 向伺服器作fetch
    const res = await fetch('http://localhost:3005/api/admin/admin-login', {
      credentials: 'include', // 設定cookie必要設定，如果有需要授權或認証一定要加
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ account, password }),
    })

    const resAdminData = await res.json()
    console.log(resAdminData)

    if (resAdminData.status === 'success') {
      // 可以得到id和username
      // const jwtData = parseJwt(resAdminData.data.accessadminToken)

      // console.log(jwtData)
      // 獲得會員其它個人資料(除了密碼之外)
      // const admin = await getadmin(jwtData.id)

      // console.log(admin)

      //   // 設定到狀態中
      setadminAuth({
        isadminAuth: true,
        // adminData: admin,
      })
      // 歡迎訊息與詢問是否要到個人資料頁
      if (confirm('你好，是否要前往後台管理介面?')) {
        router.push('/admin/activity')
      }
    } else {
      alert('帳號或密碼錯誤')
    }
  }

  // 管理員登出
  const adminLogout = async () => {
    // 向伺服器作fetch
    const res = await fetch('http://localhost:3005/api/admin/admin-logout', {
      credentials: 'include', // 設定cookie必要設定，如果有需要授權或認証一定要加
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: '',
    })

    const resAdminData = await res.json()

    if (resAdminData.status === 'success') {
      router.push('/')
      console.log('登出成功')
      // 導到首頁
      setadminAuth({
        isadminAuth: false,
        adminData: {
          id: 0,
          name: '',
          account: '',
        },
      })
    } else {
      alert('登出失敗!')
      console.warn(resAdminData)
    }
  }

  return (
    <AdminAuthContext.Provider
      value={{ adminAuth, setadminAuth, adminLogin, adminLogout }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminAuthContext)
}
