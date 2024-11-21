import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/router'
import { RxCross2, RxPlus } from 'react-icons/rx'
import { RiCheckboxCircleFill } from 'react-icons/ri'
import Image from 'next/image'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import UserSection from '@/components/user/common/user-section'
import styles from './index.module.scss'
import useAlert from '@/hooks/alert/use-alert'
export default function PostEdit(props) {
  // User Data
  const { auth } = useAuth()
  const userId = auth.userData.id
  const router = useRouter()
  const { postId } = router.query

  // Focus
  const [TitleFocus, setTitleFocus] = useState(false)
  const [ContentFocus, setContentFocus] = useState(false)
  const [tagFocus, setTagFocus] = useState(false)

  // Data
  const [imgs, setImgs] = useState([])
  const [title, setTitle] = useState('')
  const [titleLength, setTitleLength] = useState('')
  const [content, setContent] = useState('')
  const [contentLength, setContentLength] = useState('')

  // Tags
  const [tagInput, setTagInput] = useState('')
  const [suggestedTags, setSuggestedTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  // input alert draggedItemIndex
  const inputRef = useRef(null)
  const showAlert = useAlert()

  const [draggedItemIndex, setDraggedItemIndex] = useState(null)
  // let draggedItemIndex = null
  //render
  useEffect(() => {
    if (postId && userId) {
      fetchData()
    }
  }, [postId, userId, auth])
  //get data
  const fetchData = async () => {
    const response = await fetch(
      `http://localhost:3005/api/post/publish/${userId}/${postId}`,
      {
        credentials: 'include',
      }
    )
    const [data] = await response.json()
    setTitle(data.title)
    setTitleLength(data.title.length)
    setContent(data.content)
    setContentLength(data.title.length)
    setSelectedTags(data.tags ? data.tags.split(',') : [])
    setImgs(data.post_imgs ? data.post_imgs.split(',') : [])
  }

  //img upload v
  const inputHandle = () => {
    inputRef.current.click()
  }
  //img upload show v
  const showHandle = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + imgs.length > 5) {
      showAlert('請勿上傳超過5張圖片')
      return
    }
    // const nextImgs = files.map((file) => URL.createObjectURL(file))
    setImgs((prevImgs) => [...prevImgs, ...files])
  }
  //delete img v
  const deleteImg = (index) => {
    if (imgs.length === 1) {
      showAlert('請至少上傳一張圖片')
      return
    }

    setImgs((prevImgs) =>
      prevImgs.filter((_, i) => {
        if (i === index && typeof prevImgs[i] !== 'string') {
          URL.revokeObjectURL(prevImgs[i]) // 清理 Object URL
        }
        return i !== index
      })
    )
  }

  // image preview debounce
  const imagePreview = useMemo(() => {
    return imgs.map((file) =>
      file instanceof File
        ? URL.createObjectURL(file)
        : `http://localhost:3005/post/${file}`
    )
  }, [imgs])

  // tag delete v
  const deleteTag = (index) => {
    setSelectedTags((prevTags) => prevTags.filter((_, i) => i !== index))
  }
  //img drag & drop
  const dragStartHandle = (index) => {
    setDraggedItemIndex(index)
  }
  const dragEndHandle = () => {
    setDraggedItemIndex(null) //不會判斷是否有放入正確
  }
  const dropHandle = (e, dropIndex) => {
    e.preventDefault()
    if (draggedItemIndex === null || draggedItemIndex === dropIndex) return
    setImgs((prevImgs) => {
      const newImgs = [...prevImgs]
      const draggedItem = newImgs[draggedItemIndex]
      newImgs.splice(draggedItemIndex, 1)
      newImgs.splice(dropIndex, 0, draggedItem)
      return newImgs // 確保更新狀態後返回新順序
    })
    setDraggedItemIndex(null)
  }
  // title & content
  const titleHandle = (e) => {
    setTitle(e.target.value)
    setTitleLength(e.target.value.length)
  }
  const contentHandle = (e) => {
    setContent(e.target.value)
    setContentLength(e.target.value.length)
  }
  // tags add
  const addTagHandle = (e, tag) => {
    e.preventDefault()
    if (tagInput === '') return
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
    setTagInput('')
  }
  // tags search - dynamic
  useEffect(() => {
    if (tagInput) {
      const fetchTags = async () => {
        try {
          const response = await fetch(
            `http://localhost:3005/api/post/tags?tagInput=${tagInput}`,
            {
              credentials: 'include',
            }
          )
          const data = await response.json()
          setSuggestedTags(data)
        } catch (error) {
          console.error('Failed to fetch tags:', error)
        }
      }
      fetchTags()
    } else {
      setSuggestedTags([])
    }
  }, [tagInput])

  // console.log(imgs)
  // Form submit
  const submitHandle = async (e) => {
    e.preventDefault()
    // Verify form
    if (titleLength > 30) {
      showAlert('標題超過30')
      return
    }
    if (contentLength > 1000) {
      showAlert('內文超過1000')
      return
    }
    // Collect form
    const formData = new FormData()
    formData.append('postId', postId)
    formData.append('title', title)
    formData.append('content', content)
    formData.append('userId', userId)
    formData.append('updateImgs', imgs)
    // 保留的舊圖片&上傳的新圖片
    const oldImgs = imgs.filter((img) => typeof img === 'string')
    const newFiles = imgs.filter((img) => img instanceof File)
    oldImgs.forEach((img) => formData.append('imgs', img))
    newFiles.forEach((file) => formData.append('files', file))
    // 標籤
    selectedTags.forEach((tag) => formData.append('tags', tag))

    // Submit form
    try {
      const response = await fetch('http://localhost:3005/api/post/update', {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      })
      if (response.ok) {
        // 成功處理後的操作
        showAlert('更新貼文成功', <RiCheckboxCircleFill color="#90957A" />)
        router.push('/user/post')
      } else {
        alert('提交失敗，請再試一次！')
      }
    } catch (error) {
      console.error('提交錯誤:', error)
      alert('提交錯誤，請再試一次！')
    }
  }

  return (
    <>
      <UserSection titleCN="我的貼文" titleENG="My Post">
        <form
          className={styles['post-form']}
          onSubmit={submitHandle}
          encType="multipart/form-data"
        >
          <div className={styles['post-content']}>
            {/* 圖片編輯 */}
            <div className={styles['post-img']}>
              <div className={`${styles['img-amount']} h5`}>
                <div>圖片編輯</div>
                <div>({imgs.length}/5)</div>
                <input
                  ref={inputRef}
                  type="file"
                  name="files"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={showHandle}
                />
              </div>
              <div className={styles['img-area']}>
                <div
                  className={styles['img-upload-area']}
                  onClick={inputHandle}
                  style={imgs.length === 5 ? { display: 'none' } : {}}
                >
                  <span className="h3">+</span>
                  <span>添加</span>
                </div>
                <div className={styles['img-preview-area']}>
                  <div className={styles['img-container']}>
                    {/* map上傳的圖片 */}
                    {imgs.map((file, index) => {
                      // const src =
                      //   file instanceof File
                      //     ? URL.createObjectURL(file)
                      //     : `http://localhost:3005/post/${file}`
                      return (
                        //eslint-disable-next-line
                        <div className={styles['image-wrapper']}
                          key={index}
                          draggable
                          onDragStart={() => dragStartHandle(index)}
                          onDragEnd={dragEndHandle}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => dropHandle(e, index)}
                        >
                          <Image
                            src={imagePreview[index]}
                            width={98}
                            height={98}
                            alt="image"
                          />
                          {/* //eslint-disable-next-line */}
                          <div
                            className={styles['delete-btn']}
                            onClick={() => deleteImg(index)}
                          >
                            <RxCross2 size={16} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
            {/* 貼文內容 */}
            <div className={styles['post-publish']}>
              <div className={`${styles['publish-title']} h5`}>分享內容</div>
              <div className={styles['publish-info']}>
                <div
                  className={`${styles['info-title']} ${
                    styles[TitleFocus ? 'focused' : '']
                  } ${styles[titleLength > 30 ? 'over-limit' : '']}`}
                  onFocus={() => setTitleFocus(true)}
                  onBlur={() => setTitleFocus(false)}
                >
                  <input
                    type="text"
                    name="title"
                    placeholder="標題"
                    value={title}
                    onChange={titleHandle}
                  />
                  <div className={styles['count-tip']}>
                    {titleLength == 0 ? 0 : titleLength}/30
                  </div>
                </div>
                <div>
                  <div
                    className={`${styles['info-content']} ${
                      styles[ContentFocus ? 'focused' : '']
                    } ${styles[contentLength > 1000 ? 'over-limit' : '']}`}
                    onFocus={() => setContentFocus(true)}
                    onBlur={() => setContentFocus(false)}
                  >
                    <textarea
                      type="text"
                      name="content"
                      placeholder="內文"
                      value={content}
                      onChange={contentHandle}
                      className={styles['post-editor']}
                    ></textarea>
                    <div className={styles['count-tip']}>
                      {contentLength == 0 ? 0 : contentLength}/1000
                    </div>
                  </div>
                </div>
                <div className={styles['info-tag']}>
                  <div
                    className={`${styles['tag-input']} 
                    ${tagFocus ? styles['focused'] : ''}`}
                    onFocus={() => setTagFocus(true)}
                    onBlur={() => setTagFocus(false)}
                  >
                    <input
                      type="text"
                      name="tags"
                      placeholder="#標籤"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                    />
                    <button
                      className={styles['tag-add']}
                      onClick={(e) => addTagHandle(e, tagInput)}
                    >
                      <RxPlus size={24} />
                    </button>
                  </div>

                  {/* show tags selected */}
                  <div className={styles['selected-tags']}>
                    {selectedTags.map((tag, index) => (
                      <button key={index} onClick={(e) => e.preventDefault()}>
                        {tag}
                        <div onClick={() => deleteTag(index)}>
                          <RxCross2 size={16} />
                        </div>
                      </button>
                    ))}
                  </div>
                  {/* show tags suggested */}
                  <div className={styles['suggested-tags']}>
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={(e) => addTagHandle(e, tag.name)}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* btn */}
          <div className={styles['post-btn']}>
            <button className="btn-primary h6" type="submit">
              更新
            </button>
            <Link href="/user/post" className={`btn-secondary ${styles['']}`}>
              取消
            </Link>
          </div>
        </form>
      </UserSection>
    </>
  )
}
