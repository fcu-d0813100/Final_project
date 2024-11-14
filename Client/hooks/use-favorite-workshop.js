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
      fetchFavoritesWorkshop() // 登入後加載收藏列表
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
          acc[workshop.workshop_id] = true // 確保使用的是 workshop_id
          return acc
        }, {})
      )
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  // // 處理收藏按鈕點擊事件
  // const handleFavoriteWorkshopClick = async (workshop) => {
  //   const { workshop_id } = workshop
  //   console.log('Workshop details:', workshop) // 打印 product 的內容

  //   if (!auth.isAuth) {
  //     // 如果未登入，跳轉到登入頁面
  //     toast.error('請先登入以使用收藏功能', {
  //       style: {
  //         border: '1.2px solid #90957a',
  //         padding: '12px 40px',
  //         color: '#963827',
  //       },
  //       iconTheme: { primary: '#963827', secondary: '#fff' },
  //     })
  //     router.push('/user/login/user') // 跳轉到登入頁面
  //     return
  //   }

  //   if (!workshop || !workshop_id) {
  //     console.error('Error: workshop or workshop_id is missing')
  //     return
  //   }

  //   try {
  //     if (favoriteWorkshop[workshop_id]) {
  //       await removeFavoriteWorkshop(workshop_id, auth.userData.id) // 移除收藏
  //       setFavoriteWorkshop((prevFavorites) => ({
  //         ...prevFavorites,
  //         [workshop_id]: false,
  //       }))
  //       setfavoritesWorkshopList(
  //         favoritesWorkshopList.filter(
  //           (item) => item.workshop_id !== workshop_id
  //         )
  //       )
  //     } else {
  //       await addFavoriteWorkshop(workshop, auth.userData.id) // 添加到收藏
  //       setFavoriteWorkshop((prevFavorites) => ({
  //         ...prevFavorites,
  //         [workshop_id]: true,
  //       }))
  //       setfavoritesWorkshopList([...favoritesWorkshopList, workshop])
  //       // 成功收藏後顯示提示信息
  //       toast.success('您已收藏此商品', {
  //         style: {
  //           border: '1.2px solid #626553',
  //           padding: '12px 40px',
  //           color: '#626553',
  //         },
  //         iconTheme: { primary: '#626553', secondary: '#fff' },
  //       })
  //       // 成功收藏後，跳轉到收藏頁面
  //       router.push('/user/favorite')
  //     }
  //   } catch (error) {
  //     console.error('Error adding/removing favorite:', error)
  //   }
  // }

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
      // 當前已收藏，執行刪除收藏操作
      if (favoriteWorkshop[workshop_id]) {
        // 移除收藏
        await removeFavoriteWorkshop(workshop_id, auth.userData.id)

        setFavoriteWorkshop((prevFavorites) => {
          const updatedFavorites = { ...prevFavorites }
          delete updatedFavorites[workshop_id] // 根據 workshop_id 移除收藏
          return updatedFavorites
        })

        setfavoritesWorkshopList(
          (prevList) =>
            prevList.filter((item) => item.workshop_id !== workshop_id) // 根據 workshop_id 移除該項
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
        // 未收藏，執行新增收藏操作
        await addFavoriteWorkshop(workshop, auth.userData.id)

        setFavoriteWorkshop((prevFavorites) => ({
          ...prevFavorites,
          [workshop_id]: true, // 新增收藏時設為 true
        }))

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
