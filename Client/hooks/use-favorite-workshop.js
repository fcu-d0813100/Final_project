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

  // useEffect(() => {
  //   // 當 favoriteWorkshop 狀態變更時，重新抓取收藏列表
  //   fetchFavoritesWorkshop()
  // }, [favoriteWorkshop])

  const fetchFavoritesWorkshop = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/workshop/favorite/search/${auth.userData.id}`
      )
      const data = await response.json()
      setfavoritesWorkshopList(data)
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

  const handleFavoriteWorkshopClick = async (workshop) => {
    const { workshop_id } = workshop // 直接從 workshop 中提取 workshop_id
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
          delete updatedFavorites[workshop_id] // 根據 workshop_id 移除收藏
          return updatedFavorites
        })

        // 更新收藏列表並即時反映在介面上
        setfavoritesWorkshopList((prevList) =>
          prevList.filter((item) => item.workshop_id !== workshop_id)
        )

        console.log('Removing favorite for workshop_id:', workshop_id)

        toast.success('已移除收藏', {
          style: {
            border: '1.2px solid #626553',
            padding: '12px 40px',
            color: '#626553',
          },
          iconTheme: { primary: '#626553', secondary: '#fff' },
        })
      } else {
        // 新增收藏
        await addFavoriteWorkshop(workshop, auth.userData.id)

        setFavoriteWorkshop((prevFavorites) => ({
          ...prevFavorites,
          [workshop_id]: true, // 新增收藏時設為 true
        }))

        // 立即更新收藏列表並反映在介面上
        setfavoritesWorkshopList((prevList) => [...prevList, workshop])

        toast.success('您已收藏此課程', {
          style: {
            border: '1.2px solid #626553',
            padding: '12px 40px',
            color: '#626553',
          },
          iconTheme: { primary: '#626553', secondary: '#fff' },
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
