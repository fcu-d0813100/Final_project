import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/use-auth'

export function useFavoriteWorkshop() {
  const { auth, addFavoriteWorkshop, removeFavoriteWorkshop } = useAuth() // 取得登入狀態和收藏操作方法
  const [favoriteWorkshop, setFavoriteWorkshop] = useState({})
  const [favoritesList, setFavoritesList] = useState([]) // 儲存收藏列表
  const router = useRouter()

  useEffect(() => {
    if (auth.isAuth) {
      fetchFavoritesWorkshop() // 登入後加載收藏列表
    }
  }, [auth.isAuth])

  const fetchFavoritesWorkshop = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/workshop/favorite/search/${auth.userData.id}`
      )
      const data = await response.json()
      setFavoritesList(data)
      setFavoriteWorkshop(
        data.reduce((acc, workshop) => {
          acc[workshop.workshop_id] = true // 確保使用的是 workshop_id
          return acc
        }, {})
      )
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const handleFavoriteClick = async (workshop) => {
    console.log('Workshop details:', workshop)

    if (!auth.isAuth) {
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
      console.error('Error: workshop_id is undefined')
      return
    }

    try {
      if (favoriteWorkshop[workshop_id]) {
        await removeFavoriteWorkshop(workshop_id, auth.userData.id) // 移除收藏
        setFavoriteWorkshop((prevFavorites) => ({
          ...prevFavorites,
          [workshop_id]: false,
        }))
        setFavoritesList(
          favoritesList.filter((item) => item.workshop_id !== workshop_id)
        )
      } else {
        await addFavoriteWorkshop(workshop, auth.userData.id) // 添加到收藏
        setFavoriteWorkshop((prevFavorites) => ({
          ...prevFavorites,
          [workshop_id]: true,
        }))
        setFavoritesList([...favoritesList, workshop])
        toast.success('您已收藏此課程', {
          style: {
            border: '1.2px solid #626553',
            padding: '12px 40px',
            color: '#626553',
          },
          iconTheme: { primary: '#626553', secondary: '#fff' },
        })
        // router.push('/user/favorite') // 跳轉到收藏頁面
      }
    } catch (error) {
      console.error('Error adding/removing favorite:', error)
    }
  }

  return { favoriteWorkshop, handleFavoriteClick, favoritesList }
}
