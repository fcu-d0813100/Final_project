import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Tab, Nav } from 'react-bootstrap'
import { PiNotePencilBold } from 'react-icons/pi'
import Link from 'next/link'
import Masonry from 'react-masonry-css'
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './index.module.scss'
import { useAuth } from '@/hooks/use-auth'
import UserSection from '@/components/user/common/user-section'
import PublishCard from '@/components/post/common/publish-card'
import WallCard from '@/components/post/common/wall-card'
import DeleteModal from '@/components/shared/modal-delete'
import Pagination from '@/components/post/common/pagination'

export default function PostUser(props) {
  const [publishCard, setPublishCard] = useState([])
  const [wallCard, setWallCard] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const { auth } = useAuth()
  const userId = auth.userData.id

  const getPublishCard = async () => {
    try {
      const res = await fetch(
        `http://localhost:3005/api/post/post_publish/${userId}`
      )
      const data = await res.json()
      setPublishCard(data)
    } catch (error) {
      console.error('無法取得發布貼文列表')
    }
  }
  const getWallCard = async () => {
    try {
      const res = await fetch(
        `http://localhost:3005/api/post/post_save/${userId}`
      )
      const data = await res.json()
      setWallCard(data)
    } catch (error) {
      console.error('無法取得收藏貼文列表')
    }
  }
  const deletePost = async () => {
    try {
      await fetch(`http://localhost:3005/api/post/delete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          postId: deleteId,
          userId,
        }),
      })
      //即時更新狀態
      setPublishCard(publishCard.filter((item) => item.id !== deleteId))
      setShowModal(false)
    } catch (err) {
      alert('刪除失敗，請稍後再試！')
    }
  }
  useEffect(() => {
    getPublishCard()
  }, [userId])

  useEffect(() => {
    getWallCard()
  }, [userId])
  // console.log(publishCard)
  const breakpoint = {
    default: 4,
    1640: 3,
    1200: 2,
  }
  const itemsPerPage = 5 // 每頁顯示的項目數量

  const renderPublishCard = (post) => {
    const imgSrc = `http://localhost:3005/post/${post.post_img}`

    return (
      <PublishCard
        key={post.id}
        postId={post.id}
        userId={userId}
        imageSrc={imgSrc}
        title={post.title}
        content={post.content}
        createTime={post.created_at}
        likeCount={post.like_count}
        commentCount={post.comment_count}
        onDelete={() => {
          setShowModal(true)
          setDeleteId(post.id)
        }}
      />
    )
  }

  return (
    <>
      <UserSection titleCN="我的貼文" titleENG="My Post">
        <div className={styles['post-content']}>
          <Tab.Container defaultActiveKey="/publish">
            <div className={styles['post-navbar']}>
              <Nav
                variant="underline"
                className={`${styles['post-nav']} ${styles['h6']}`}
              >
                <Nav.Item className={`${styles['nav-link']} `}>
                  <Nav.Link eventKey="/publish">已發布</Nav.Link>
                </Nav.Item>
                <Nav.Item className={`${styles['nav-link']} `}>
                  <Nav.Link eventKey="/save">已收藏</Nav.Link>
                </Nav.Item>
              </Nav>

              <Link
                href="/user/post/create"
                passHref
                className={styles['post-add']}
              >
                <PiNotePencilBold size={22} />
                <span>建立</span>
              </Link>
            </div>
            <Tab.Content>
              <Tab.Pane eventKey="/publish">
                <div className={styles['publish-all']}>
                  {publishCard.length === 0 ? (
                    <div className={styles['no-data']}>
                      <p>沒有發布的貼文</p>
                    </div>
                  ) : (
                    <Pagination
                      data={publishCard}
                      itemsPerPage={itemsPerPage}
                      renderCard={renderPublishCard}
                    />
                  )}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="/save">
                <div className={styles['save-all']}>
                  <Masonry
                    breakpointCols={breakpoint}
                    className={styles['my-masonry-grid']}
                    columnClassName={styles['my-masonry-grid_column']}
                  >
                    {wallCard.length === 0 ? (
                      <div className={styles['no-data']}>
                        <p>沒有收藏的貼文</p>
                      </div>
                    ) : (
                      wallCard.map((post) => {
                        const imgSrc = `http://localhost:3005/post/${post.post_img}`

                        return (
                          <WallCard
                            key={post.id}
                            href={`/post/${post.id}`}
                            imageSrc={imgSrc}
                            title={post.title}
                          />
                        )
                      })
                    )}
                  </Masonry>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </UserSection>

      {showModal && (
        <DeleteModal
          title="刪除貼文"
          content={`刪除後將無法恢復，\n確定要刪除這篇貼文嗎 ?`}
          btnConfirm="確定刪除"
          btnCancel="取消"
          ConfirmFn={() => deletePost(deleteId)}
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
