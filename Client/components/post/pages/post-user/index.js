import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Tab, Nav } from 'react-bootstrap'
import { PiNotePencilBold } from 'react-icons/pi'
import Link from 'next/link'
import Masonry from 'react-masonry-css'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './index.module.scss'
import { useAuth } from '@/hooks/use-auth'
import UserSection from '@/components/user/common/user-section'
import PublishCard from '@/components/post/common/publish-card'
import WallCard from '@/components/post/common/wall-card'
export default function Index(props) {
  const [publishCard, setPublishCard] = useState([])
  const [wallCard, setWallCard] = useState([])
  const [showModal] = useState(false)

  const { auth } = useAuth()
  const userId = auth.userData.id

  useEffect(() => {
    async function getPublishCard() {
      if (userId) {
        try {
          let response = await axios.get(
            `http://localhost:3005/api/post/post_publish/${userId}`,
            {
              withCredentials: true,
            }
          )
          setPublishCard(response.data)
        } catch (error) {
          console.error('Error fetching publish card data:', error)
        }
      }
    }
    console.log(userId)
    getPublishCard()
  }, [userId])
  useEffect(() => {
    async function getWallCard() {
      if (userId) {
        try {
          let response = await axios.get(
            `http://localhost:3005/api/post/post_save/${userId}`,
            {
              withCredentials: true,
            }
          )
          setWallCard(response.data)
        } catch (error) {
          console.error('Error fetching save card data:', error)
        }
      }
    }
    console.log(userId)
    getWallCard()
  }, [userId])
  const breakpoint = {
    default: 4,
    1600: 3,
    1200: 3,
    700: 2,
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
                <PiNotePencilBold size={30} />
                <span>建立</span>
              </Link>
            </div>
            <Tab.Content>
              <Tab.Pane eventKey="/publish">
                <div className={styles['publish-all']}>
                  {/* 記得換網址 */}
                  {/* http://localhost:3005/upload/${post.post_img} */}
                  {publishCard.map((post) => {
                    const imgSrc = post.post_img.startsWith('post')
                      ? `http://localhost:3005/upload/${post.post_img}` // 後端圖片路徑
                      : `/post/${post.post_img}` // 前端靜態圖片路徑

                    return (
                      <PublishCard
                        key={post.id}
                        postId={post.id}
                        imageSrc={imgSrc}
                        title={post.title}
                        content={post.content}
                        createTime={post.created_at}
                        likeCount={post.like_count}
                        commentCount={post.comment_count}
                      />
                    )
                  })}

                  <div className={styles['pagination']}></div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="/save">
                <div className={styles['save-all']}>
                  <Masonry
                    breakpointCols={breakpoint}
                    className={styles['my-masonry-grid']}
                    columnClassName={styles['my-masonry-grid_column']}
                  >
                    {wallCard.map((post) => (
                      <WallCard
                        key={post.id}
                        imageSrc={`/post/${post.post_img}`}
                        title={post.title}
                        username={post.nickname}
                        avatarSrc={`/user/img/${post.user_img}`}
                        likeCount={post.like_count}
                      />
                    ))}
                  </Masonry>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </UserSection>
    </>
  )
}
