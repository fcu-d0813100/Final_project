import React, { useState, useEffect } from 'react'
import PostDetail from '@/components/post/pages/post-detail'
import { PostProvider } from '@/hooks/post/use-post'
export default function Explore(props) {
  return (
    <>
      <PostProvider>
        <PostDetail />
      </PostProvider>
    </>
  )
}
