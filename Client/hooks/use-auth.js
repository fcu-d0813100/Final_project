import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast'
import { googleLogin, parseJwt } from '@/services/user'
import { deleteUser } from 'firebase/auth'

// import { register } from 'module'

// 初始化會員狀態(登出時也要用)
// 只需要必要的資料即可，沒有要多個頁面或元件用的資料不需要加在這裡
// !!注意JWT存取令牌中只有id, username, google_uid, line_uid在登入時可以得到
export const initUserData = {
  id: 0,
  account: '',
  google_uid: '',
  line_uid: '',
  name: '',
  email: '',
}

// 1. 建立與導出它
// 傳入參數為defaultValue，是在套用context時錯誤或失敗才會得到的值。
// 可以使用有意義的預設值，或使用null(通常目的是為了除錯)
const AuthContext = createContext(null)
// 設定displayName屬性，這是搭配React DevTools使用的
AuthContext.displayName = 'AuthContext'

export function AuthProvider({ children }) {
  const router = useRouter()

  // 加入收藏函數
  const addFavorite = async (product) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/product/favorite/${product.color_id}/${auth.userData.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      if (!response.ok) throw new Error('收藏失敗')
      console.log(`Added product to favorites: ${product.color_id}`)
    } catch (error) {
      console.error('Error adding favorite:', error)
    }
  }

  // 移除收藏函數
  const removeFavorite = async (color_id) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/product/favorite/${color_id}/${auth.userData.id}`,
        {
          method: 'DELETE',
        }
      )
      if (!response.ok) throw new Error('取消收藏失敗')
      console.log(`Removed product from favorites with color_id: ${color_id}`)
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  const [auth, setAuth] = useState({
    isAuth: false, // 代表會員是否已經登入的信號值
    userData: {
      id: 0,
      name: '',
      email: '',
      account: '',
      google_uid: '',
      line_uid: '',
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

  // 會員註冊
  const register = async (user) => {
    try {
      // console.log('開始發送註冊請求:', user)
      const res = await fetch('http://localhost:3005/api/user/register', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(user),
      })

      const resData = await res.json()
      // console.log('伺服器響應:', resData)

      if (resData.status === 'success') {
        toast.success('您已註冊成功', {
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
        setTimeout(() => {
          router.push('/user/login/user')
        }, 1500)
      } else if (resData.message === '電子郵件或帳號已被註冊') {
        toast.error(resData.message, {
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
      } else {
        toast.error('註冊失敗，請稍後再試', {
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
      // console.error('註冊過程中發生錯誤:', error)
      toast.error('註冊過程中發生錯誤，請稍後再試', {
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
        setTimeout(() => {
          router.push('/user')
        }, 1500)
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

  // 會員登入
  const login = async (account, password, role) => {
    try {
      // 向伺服器作 fetch
      const res = await fetch(`http://localhost:3005/api/user/login/${role}`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ account, password }),
      })

      const resData = await res.json()

      if (resData.status === 'success') {
        // 可以得到 id 和 username
        const jwtData = parseJwt(resData.accessToken)
        console.log(jwtData)
        // 獲得會員其它個人資料 (除了密碼之外)
        const user = await getUser(jwtData.id)

        // 設定到狀態中
        setAuth({
          isAuth: true,
          userData: user,
        })

        // 顯示成功訊息
        toast.success('您已登入成功', {
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

        // 根據角色跳轉到相應頁面
        setTimeout(() => {
          switch (role) {
            case 'admin':
              router.push('/admin/activity')
              break
            case 'teacher':
              router.push('/teacher/information')
              break
            case 'user':
              router.push('/user')
              break
            default: // 處理身份不明的情況
              router.push('/login')
              break
          }
        }, 2000)
      } else {
        // 根據不同錯誤訊息顯示相應的吐司提示
        switch (resData.message) {
          case '身份不符合':
            toast.error('您無登入權限', {
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
            break
          case '無教師權限':
            toast.error('您並無老師登入權限', {
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
            break
          case '無管理員權限':
            toast.error('您並無管理員登入權限', {
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
            break
          case '密碼錯誤':
            toast.error('帳號或密碼錯誤', {
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
            break
          case '該會員不存在':
            toast.error('您並未註冊', {
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
            break
          default:
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
            break
        }
      }
    } catch (error) {
      // console.error('登入過程中發生錯誤:', error)
      toast.error('登入過程中發生錯誤，請稍後再試', {
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

  const update = async (user, selectedFile) => {
    const formData = new FormData()
    formData.append('name', user.name)
    formData.append('email', user.email)
    formData.append('nickname', user.nickname)
    formData.append('gender', user.gender)
    formData.append('phone', user.phone)
    formData.append('address', user.address)
    formData.append('birthday', user.birthday)

    if (selectedFile) {
      formData.append('avatar', selectedFile)
    }

    try {
      const res = await fetch('http://localhost:3005/api/user', {
        credentials: 'include',
        method: 'PUT',
        body: formData,
      })

      // 檢查回應是否有效
      if (!res.ok) {
        console.error(`HTTP error! status: ${res.status}`)
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      // 確保返回解析後的 JSON
      const resData = await res.json()
      return resData // 確保返回已解析的 JSON
    } catch (error) {
      console.error('更新失敗:', error)
      return { status: 'error', message: '更新失敗' } // 返回錯誤格式
    }
  }

  // 會員登出
  const logout = async () => {
    try {
      const res = await fetch('http://localhost:3005/api/user/logout', {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const resData = await res.json()

      if (resData.status === 'success') {
        toast.success('您已登出', {
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
        router.push('/')
        setAuth({
          isAuth: false,
          userData: {
            id: 0,
            name: '',
            email: '',
            account: '',
            google_uid: '',
            line_uid: '',
          },
        })
      } else {
        toast.error('登出失敗，請稍後再試', {
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
      console.error('登出過程中發生錯誤:', error)
      toast.error('登出過程中發生錯誤，請稍後再試', {
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

  // 會員軟刪除
  const deleteUser = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3005/api/user/${userId}`, {
        method: 'DELETE',
        credentials: 'include', // 設定cookie必要設定，如果有需要授權或認証一定要加
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const resData = await res.json()

      if (resData.status === 'success') {
        toast.success('用戶已成功標記為刪除', {
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
        setTimeout(() => {
          router.push('/user/information/update')
        }, 2000)
      } else {
        toast.error('刪除失敗，請稍後再試', {
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
      toast.error('刪除過程中發生錯誤，請稍後再試', {
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

  // 很簡單的保護，但還是會先瀏覽到那頁面，如果要檔的話，要加入載入動畫去檔
  // 登入路由 - 當要進入隱私路由但未登入時，會跳轉到登入路由
  const loginRoute = '/user/login/user'
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
      // console.log(resData)

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
          toast.error('請先登入以訪問該頁面', {
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
          router.push(loginRoute)
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
      value={{
        auth,
        getUser,
        login,
        logout,
        register,
        update,
        setAuth,
        callbackGoogleLogin,
        deleteUser,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
