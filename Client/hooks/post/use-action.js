import React, { useState, useEffect, createContext, useContext } from 'react'
import { useAuth } from '../use-auth'
import { usePost } from './use-post'
import ModalConfirm from '@/components/shared/modal-confirm'

//render
export const useAction = (
  postId,
  options = { fetchLike: false, fetchSave: false, fetchCommentLike: false }
) => {
  const { auth } = useAuth()
  const userId = auth.userData.id
  const { forceUpdate } = usePost()
  //   console.log(forceUpdate)
  const [liked, setLiked] = useState(false) // post like
  const [saved, setSaved] = useState(false) // post save

  // GET POST LIKE
  useEffect(() => {
    if (options.fetchLike && postId && userId) {
      fetchLike(postId)
    }
  }, [postId, userId, options.fetchLike])

  const fetchLike = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/post/isLiked/${postId}/${userId}`
      )
      const data = await response.json()
      setLiked(data.isLiked)
      // console.log(liked)
    } catch (error) {
      console.log(error)
    }
  }
  // POST LIKE TOGGLE
  const likeToggle = async () => {
    try {
      if (liked) {
        await fetch(
          `http://localhost:3005/api/post/dislike/${postId}/${userId}`,
          {
            method: 'DELETE',
          }
        )
      } else {
        await fetch(`http://localhost:3005/api/post/like/${postId}/${userId}`, {
          method: 'POST',
        })
      }
      setLiked(!liked)
      forceUpdate()
    } catch (error) {
      console.log('Error', error)
    }
  }

  // GET POST SAVE
  useEffect(() => {
    if (options.fetchSave && postId && userId) {
      fetchSave(postId)
    }
  }, [postId, userId, options.fetchSave])

  const fetchSave = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/post/isSaved/${postId}/${userId}`
      )
      const data = await response.json()
      setSaved(data.isSaved)
    } catch (error) {
      console.log(error)
    }
  }
  // POST SAVE TOGGLE
  const saveToggle = async () => {
    try {
      if (saved) {
        await fetch(
          `http://localhost:3005/api/post/unsave/${postId}/${userId}`,
          {
            method: 'DELETE',
          }
        )
      } else {
        await fetch(`http://localhost:3005/api/post/save/${postId}/${userId}`, {
          method: 'POST',
        })
      }
      setSaved(!saved)
      forceUpdate()
    } catch (error) {
      console.log('Error', error)
    }
  }

  return { liked, likeToggle, fetchLike, saved, saveToggle, fetchSave }
}
