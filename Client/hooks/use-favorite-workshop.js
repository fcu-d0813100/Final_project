// hooks/useFavorite.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/use-auth'

export function useFavoriteWorkshop() {
  const { auth, addFavorite, removeFavorite } = useAuth() // 取得登入狀態和收藏操作方法
  const [favoriteWorkshops, setFavoriteWorkshops] = useState({})
  const [favoritesList, setFavoritesList] = useState([]) // 儲存收藏列表
  const router = useRouter()

  useEffect(() => {
    if (auth.isAuth) {
      fetchFavorites() // 登入後加載收藏列表
    }
  }, [auth.isAuth])

  const fetchFavorites = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/workshop/favorite/search/${auth.userData.id}`
      )
      const data = await response.json()
      setFavoritesList(data)
      setFavoriteWorkshops(
        data.reduce((acc, workshop) => {
          acc[workshop.workshop_id] = true
          return acc
        }, {})
      )
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  // 處理收藏按鈕點擊事件
  const handleFavoriteClick = async (workshop) => {
    console.log('Workshop details:', workshop)

    if (!auth.isAuth) {
      // 如果未登入，跳轉到登入頁面
      toast.error('請先登入以使用收藏功能', {
        style: {
          border: '1.2px solid #90957a',
          padding: '12px 40px',
          color: '#963827',
        },
        iconTheme: { primary: '#963827', secondary: '#fff' },
      })
      router.push('/user/login/user') // 跳轉到登入頁面
      return
    }

    const { workshop_id } = workshop
    if (!workshop_id) {
      console.error('Error: color_id is undefined')
      return
    }

    try {
      if (favoriteWorkshops[workshop_id]) {
        await removeFavorite(workshop_id, auth.userData.id) // 移除收藏
        setFavoriteWorkshops((prevFavorites) => ({
          ...prevFavorites,
          [workshop_id]: false,
        }))
        setFavoritesList(
          favoritesList.filter((item) => item.workshop_id !== workshop_id)
        )
      } else {
        await addFavorite(workshop, auth.userData.id) // 添加到收藏
        setFavoriteWorkshops((prevFavorites) => ({
          ...prevFavorites,
          [workshop_id]: true,
        }))
        setFavoritesList([...favoritesList, workshop])
        // 成功收藏後顯示提示信息
        toast.success('您已收藏此課程', {
          style: {
            border: '1.2px solid #626553',
            padding: '12px 40px',
            color: '#626553',
          },
          iconTheme: { primary: '#626553', secondary: '#fff' },
        })
        // 成功收藏後，跳轉到收藏頁面
        router.push('/user/favorite')
      }
    } catch (error) {
      console.error('Error adding/removing favorite:', error)
    }
  }

  return { favoriteWorkshops, handleFavoriteClick, favoritesList }
}
