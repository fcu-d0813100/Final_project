import React, { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { RxCross2, RxPlus } from 'react-icons/rx'
import { RiCheckboxCircleFill } from 'react-icons/ri'
import Link from 'next/link'
import UserSection from '@/components/user/common/user-section'
import styles from './index.module.scss'
import { useAuth } from '@/hooks/use-auth'
import useAlert from '@/hooks/alert/use-alert'
import useToast from '@/hooks/toast/use-toast'
// import toast, { Toaster } from 'react-hot-toast' // 引入 toast

export default function PostCreate(props) {
  const showToast = useToast()
  // User Data
  const { auth } = useAuth()
  const userId = auth.userData.id

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

  // router input alert draggedItemIndex
  const router = useRouter()
  const inputRef = useRef(null)
  const showAlert = useAlert()
  let draggedItemIndex = null

  // img upload
  const inputHandle = () => {
    inputRef.current.click()
  }
  // img upload show
  const showHandle = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + imgs.length > 5) {
      showAlert('請勿上傳超過5張圖片')
      return
    }
    // const nextImgs = files.map((file) => URL.createObjectURL(file))
    setImgs((prevImgs) => [...prevImgs, ...files])
  }
  // img delete
  const deleteImg = (index) => {
    if (imgs.length === 1) {
      showAlert('請至少上傳一張圖片')
      return
    }
    URL.revokeObjectURL(imgs[index])
    setImgs((prevImgs) => prevImgs.filter((_, i) => i !== index))
  }
  // tag delete
  const deleteTag = (index) => {
    setSelectedTags((prevTags) => prevTags.filter((_, i) => i !== index))
  }
  // img drag & drop
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
    const draggedItem = newImgs[draggedItemIndex] //賦值 拖曳圖片在新陣列中的位置
    newImgs.splice(draggedItemIndex, 1)
    newImgs.splice(dropIndex, 0, draggedItem)
    setImgs(newImgs)
    draggedItemIndex = null
  }
  // image preview debounce
  const imagePreview = useMemo(() => {
    return imgs.map((img) => URL.createObjectURL(img))
  }, [imgs])

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
    formData.append('title', title)
    formData.append('content', content)
    formData.append('userId', userId)
    imgs.forEach((file) => formData.append('files', file))

    for (let i = 0; i < selectedTags.length; i++) {
      formData.append('tags', selectedTags[i])
    }

    // Submit form
    try {
      const response = await fetch('http://localhost:3005/api/post/create', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
      if (response.ok) {
        // 成功處理後的操作
        // toast.success('發布貼文成功')
        // showToast('發布貼文成功', 'success')
        showAlert('發布貼文成功', <RiCheckboxCircleFill color="#90957A" />)
        router.push('/user/post') // 跳轉到 /success 頁面
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
                    {imgs.map((file, index) => (
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
                    ))}
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
                  }  ${styles[titleLength > 30 ? 'over-limit' : '']}`}
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
              發布
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
