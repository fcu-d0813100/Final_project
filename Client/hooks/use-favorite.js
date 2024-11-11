// hooks/useFavorite.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/use-auth'

export function useFavorite() {
  const { auth, addFavorite, removeFavorite } = useAuth() // 取得登入狀態和收藏操作方法
  const [favoriteProducts, setFavoriteProducts] = useState({})
  const router = useRouter()

  // 處理收藏按鈕點擊事件
  const handleFavoriteClick = (product) => {
    if (!auth.isAuth) {
      // 如果未登入，跳轉到登入頁面
      toast.error('請先登入以使用收藏功能', {
        style: { border: '1.2px solid #90957a', padding: '12px 40px', color: '#963827' },
        iconTheme: { primary: '#963827', secondary: '#fff' },
      })
      router.push('/user/login/user') // 跳轉到登入頁面
      return
    }

    const { color_id } = product
    // 如果已登入，加入或移除收藏
    if (favoriteProducts[color_id]) {
      removeFavorite(color_id) // 移除收藏
      setFavoriteProducts((prevFavorites) => ({
        ...prevFavorites,
        [color_id]: false,
      }))
    } else {
      addFavorite(product) // 添加到收藏
      setFavoriteProducts((prevFavorites) => ({
        ...prevFavorites,
        [color_id]: true,
      }))
    }
  }

  return { favoriteProducts, handleFavoriteClick }
}


