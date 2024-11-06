import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// 建立教師的 Context
const TeacherAuthContext = createContext(null)
TeacherAuthContext.displayName = 'TeacherAuthContext'

export function TeacherAuthProvider({ children }) {
  const router = useRouter()

  const [teacherAuth, setTeacherAuth] = useState({
    isTeacherAuth: false,
    teacherData: {
      id: 0,
      name: '',
      account: '',
    },
  })

  // 解析accessTeacherToken用的函式
  const parseJwt = (token) => {
    const base64Payload = token.split('.')[1]
    const payload = Buffer.from(base64Payload, 'base64')
    return JSON.parse(payload.toString())
  }

  // 得到會員個人的資料(登入之後才可以用)
  const getTeacher = async () => {
    // 向伺服器作fetch
    const res = await fetch(`http://localhost:3005/api/teacher`, {
      credentials: 'include', // 設定cookie必要設定，如果有需要授權或認証一定要加
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
    const resTeacherData = await res.json()
    console.log('伺服器回應:', resTeacherData)

    if (resTeacherData.status === 'success') {
      return resTeacherData.data.teacher
    } else {
      console.warn(resTeacherData)
      return {}
    }
  }

  // 教師登入
  const teacherLogin = async (account, password) => {
    // 向伺服器作fetch
    const res = await fetch(
      'http://localhost:3005/api/teacher-login/teacher-login',
      {
        credentials: 'include', // 設定cookie必要設定，如果有需要授權或認証一定要加
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ account, password }),
      }
    )

    const resTeacherData = await res.json()
    console.log(resTeacherData)

    if (resTeacherData.status === 'success') {
      // 可以得到id和username
      const jwtData = parseJwt(resTeacherData.data.accessTeacherToken)

      // console.log(jwtData)
      // 獲得會員其它個人資料(除了密碼之外)
      const teacher = await getTeacher(jwtData.id)

      // console.log(teacher)

      //   // 設定到狀態中
      setTeacherAuth({
        isTeacherAuth: true,
        teacherData: teacher,
      })
      // 歡迎訊息與詢問是否要到個人資料頁
      if (confirm('你好，是否要前往教師資料頁?')) {
        router.push('/teacher/information')
      }
    } else {
      alert('帳號或密碼錯誤')
    }
  }

  // 教師登出
  const teacherLogout = async () => {
    // 向伺服器作fetch
    const res = await fetch(
      'http://localhost:3005/api/teacher-login/teacher-logout',
      {
        credentials: 'include', // 設定cookie必要設定，如果有需要授權或認証一定要加
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: '',
      }
    )

    const resTeacherData = await res.json()

    if (resTeacherData.status === 'success') {
      router.push('/')
      console.log('登出成功')
      // 導到首頁
      setTeacherAuth({
        isTeacherAuth: false,
        teacherData: {
          id: 0,
          name: '',
          account: '',
        },
      })
    } else {
      alert('登出失敗!')
      console.warn(resTeacherData)
    }
  }

  return (
    <TeacherAuthContext.Provider
      value={{ teacherAuth, setTeacherAuth, teacherLogin, teacherLogout }}
    >
      {children}
    </TeacherAuthContext.Provider>
  )
}

export function useTeacherAuth() {
  return useContext(TeacherAuthContext)
}
