import React, { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

//1. 建立Context
const PostContext = createContext(null)
PostContext.displayName = 'PostContext'

// 2. 建立 Provider
export function PostProvider({ children }) {
  const [post, setPost] = useState(null)
  const router = useRouter()
  const { postId } = router.query

  useEffect(() => {
    async function getPostCard() {
      if (postId) {
        const response = await axios.get(
          `http://localhost:3005/api/post/post_wall/${postId}`,
          { withCredentials: true }
        )
        setPost(response.data.post)
      }
    }
    getPostCard()
  }, [postId])

  return (
    <PostContext.Provider value={{ post }}>{children}</PostContext.Provider>
  )
}
//3.建立一個包裝的hook
export const usePost = () => useContext(PostContext)
