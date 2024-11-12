// hooks/usePostForm.js
import { useState, useEffect, useRef } from 'react'
import useAlert from '@/hooks/alert/use-alert'
import axios from 'axios'

const usePostForm = (initialData = {}, userId) => {
  const showAlert = useAlert()
  const [title, setTitle] = useState(initialData.title || '')
  const [content, setContent] = useState(initialData.content || '')
  const [selectedTags, setSelectedTags] = useState(initialData.tags || [])
  const [imgs, setImgs] = useState(initialData.imgs || [])
  const [tagInput, setTagInput] = useState('')
  const [suggestedTags, setSuggestedTags] = useState([])

  const titleLength = title.length
  const contentLength = content.length
  const inputRef = useRef(null)
  let draggedItemIndex = null

  // img upload click
  const inputHandle = () => inputRef.current.click()

  // img upload show
  const showHandle = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + imgs.length > 5) {
      showAlert('請勿上傳超過5張圖片')
      return
    }
    setImgs((prevImgs) => [...prevImgs, ...files])
  }
  // img delete
  const deleteImg = (index) => {
    if (imgs.length === 1) {
      showAlert('請至少上傳一張圖片')
      return
    }
    setImgs((prevImgs) => prevImgs.filter((_, i) => i !== index))
  }
  // tag delete
  const deleteTag = (index) => {
    setSelectedTags((prevTags) => prevTags.filter((_, i) => i !== index))
  }

  // img Drag and drop
  const dragStartHandle = (index) => {
    draggedItemIndex = index
  }

  const dragEndHandle = () => {
    draggedItemIndex = null //不會判斷是否有放入正確
  }

  const dropHandle = (e, dropIndex) => {
    e.preventDefault()
    if (draggedItemIndex === null || draggedItemIndex === dropIndex) return
    const newImgs = [...imgs]
    const draggedItem = newImgs[draggedItemIndex]
    newImgs.splice(draggedItemIndex, 1)
    newImgs.splice(dropIndex, 0, draggedItem)
    setImgs(newImgs)
    draggedItemIndex = null
  }

  //tag add input
  const addTagHandle = (e, tag) => {
    e.preventDefault()
    if (tagInput === '') return
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
    setTagInput('')
  }

  useEffect(() => {
    if (tagInput) {
      const fetchTags = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3005/api/post/tags?tagInput=${tagInput}`
          )
          setSuggestedTags(response.data)
        } catch (error) {
          console.error('Failed to fetch tags:', error)
        }
      }
      fetchTags()
    } else {
      setSuggestedTags([])
    }
  }, [tagInput])

  return {
    title,
    setTitle,
    content,
    setContent,
    selectedTags,
    setSelectedTags,
    imgs,
    inputRef,
    titleLength,
    contentLength,
    tagInput,
    setTagInput,
    suggestedTags,
    showHandle,
    deleteImg,
    deleteTag,
    dragStartHandle,
    dragEndHandle,
    dropHandle,
    addTagHandle,
    inputHandle,
  }
}

export default usePostForm
