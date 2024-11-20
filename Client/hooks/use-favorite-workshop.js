import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/use-auth'

export function useFavoriteWorkshop() {
  const { auth, addFavoriteWorkshop, removeFavoriteWorkshop } = useAuth() // 取得登入狀態和收藏操作方法
  const [favoriteWorkshop, setFavoriteWorkshop] = useState({})
  const [favoritesWorkshopList, setfavoritesWorkshopList] = useState([]) // 儲存收藏列表
  const router = useRouter()

  useEffect(() => {
    if (auth.isAuth) {
      fetchFavoritesWorkshop()
    }
  }, [auth.isAuth])

  const fetchFavoritesWorkshop = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/workshop/favorite/search/${auth.userData.id}`
      )
      const data = await response.json()
      setfavoritesWorkshopList(data)
      setFavoriteWorkshop(
        data.reduce((acc, workshop) => {
          acc[workshop.workshop_id] = true
          return acc
        }, {})
      )
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const handleFavoriteWorkshopClick = async (workshop) => {
    const { workshop_id } = workshop
    console.log('Workshop details:', workshop)

    if (!auth.isAuth) {
      toast.error('請先登入以使用收藏功能', {
        style: {
          padding: '12px 40px',
          color: '#963827',
          fontSize: '18px',
        },
        iconTheme: {
          primary: '#963827',
          secondary: '#fff',
        },
      })
      router.push('/user/login/user')
      return
    }

    if (!workshop || !workshop_id) {
      console.error('Error: workshop or workshop_id is missing')
      return
    }

    try {
      if (favoriteWorkshop[workshop_id]) {
        // 移除收藏
        await removeFavoriteWorkshop(workshop_id, auth.userData.id)
        setFavoriteWorkshop((prevFavorites) => {
          const updatedFavorites = { ...prevFavorites }
          delete updatedFavorites[workshop_id]
          return updatedFavorites
        })

        setfavoritesWorkshopList((prevList) =>
          prevList.filter((item) => item.workshop_id !== workshop_id)
        )

        console.log('Removing favorite for workshop_id:', workshop_id)

        toast.success('已移除收藏', {
          style: {
            padding: '12px 40px',
            color: '#626553',
            fontSize: '18px',
          },
          iconTheme: {
            primary: '#626553',
            secondary: '#fff',
          },
        })
      } else {
        // 新增收藏
        await addFavoriteWorkshop(workshop, auth.userData.id)

        setFavoriteWorkshop((prevFavorites) => ({
          ...prevFavorites,
          [workshop_id]: true,
        }))

        setfavoritesWorkshopList((prevList) => [...prevList, workshop])

        toast.success('您已收藏此課程', {
          style: {
            padding: '12px 40px',
            color: '#626553',
            fontSize: '18px',
          },
          iconTheme: {
            primary: '#626553',
            secondary: '#fff',
          },
        })
      }
    } catch (error) {
      console.error('Error adding/removing favorite:', error)
    }
  }

  return {
    favoriteWorkshop,
    handleFavoriteWorkshopClick,
    favoritesWorkshopList,
  }
}
