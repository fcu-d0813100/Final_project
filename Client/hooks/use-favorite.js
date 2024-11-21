// hooks/useFavorite.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/use-auth'

export function useFavorite() {
  const { auth, addFavorite, removeFavorite } = useAuth() // 取得登入狀態和收藏操作方法
  const [favoriteProducts, setFavoriteProducts] = useState({})
  const [favoritesList, setFavoritesList] = useState([]) // 儲存收藏商品列表
  const router = useRouter()

  useEffect(() => {
    if (auth.isAuth) {
      fetchFavorites() // 登入後加載收藏列表
    }
  }, [auth.isAuth])

  const fetchFavorites = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/product/favorite/search/${auth.userData.id}`
      )
      const data = await response.json()
      setFavoritesList(data)
      setFavoriteProducts(
        data.reduce((acc, product) => {
          acc[product.color_id] = true
          return acc
        }, {})
      )
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  // 處理收藏按鈕點擊事件
  const handleFavoriteClick = async (product) => {
    console.log('Product details:', product) // 打印 product 的內容

    if (!auth.isAuth) {
      // 如果未登入，跳轉到登入頁面
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
      router.push('/user/login/user') // 跳轉到登入頁面
      return
    }

    const { color_id } = product
    if (!color_id) {
      console.error('Error: color_id is undefined')
      return
    }

    try {
      if (favoriteProducts[color_id]) {
        await removeFavorite(color_id, auth.userData.id) // 移除收藏
        setFavoriteProducts((prevFavorites) => ({
          ...prevFavorites,
          [color_id]: false,
        }))
        setFavoritesList(
          favoritesList.filter((item) => item.color_id !== color_id)
        )
      } else {
        await addFavorite(product, auth.userData.id) // 添加到收藏
        setFavoriteProducts((prevFavorites) => ({
          ...prevFavorites,
          [color_id]: true,
        }))
        setFavoritesList([...favoritesList, product])
        // 成功收藏後顯示提示信息
        toast.success('您已收藏此商品', {
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
        // 成功收藏後，跳轉到收藏頁面
        // router.push('/user/favorite')
      }
    } catch (error) {
      console.error('Error adding/removing favorite:', error)
    }
  }

  return { favoriteProducts, handleFavoriteClick, favoritesList }
}
