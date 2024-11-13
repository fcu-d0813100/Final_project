import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Tab, Nav } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './index.module.scss'
import UserSection from '@/components/user/common/user-section'
import { useAuth } from '@/hooks/use-auth'

export default function Index(props) {
  const { auth } = useAuth()
  const userId = auth.userData.id
  const [active, setActive] = useState([]) // 存储用户收藏的活动
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchFavorites()
    }
  }, [userId])

  // 获取用户收藏的活动
  const fetchFavorites = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/activity/favorite/${userId}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch favorite activities')
      }
      const data = await response.json()
      // 确保每个活动一开始就被标记为已收藏
      const favoritesWithFavoriteFlag = data.map((activity) => ({
        ...activity,
        is_favorite: true,
      }))
      setActive(favoritesWithFavoriteFlag)
    } catch (error) {
      console.error('Error fetching favorite activities:', error)
    }
  }

  const toggleHeart = async (id, isFavorite) => {
    if (userId === 0) {
      setShowLoginModal(true) // 如果未登录，显示 LoginModal
      return
    }

    try {
      const url = isFavorite
        ? `http://localhost:3005/api/activity/unfavorite`
        : `http://localhost:3005/api/activity/favorite`

      const response = await fetch(url, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activityId: id, userId: userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to update favorite status')
      }

      const result = await response.json()
      console.log(result.message)

      // 更新活动状态
      setActive((prevActive) =>
        prevActive.map((item) =>
          item.id === id ? { ...item, is_favorite: !isFavorite } : item
        )
      )
    } catch (error) {
      console.error('Failed to update favorite status:', error)
    }
  }

  return (
    <>
      <UserSection titleCN="活動紀錄" titleENG="Activity favorite">
        <Tab.Container defaultActiveKey="/pdlike">
          <div className={styles['post-navbar']}>
            <Nav variant="underline" className={`${styles['nav-item']} h6`}>
              <Nav.Item className={`${styles['nav-link']} `}>
                <Nav.Link
                  className={`${styles['link-style']} `}
                  eventKey="/pdlike"
                >
                  活動收藏
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className={`${styles['nav-link']} `}>
                <Nav.Link
                  className={`${styles['link-style']} `}
                  eventKey="/classlike"
                >
                  報名活動
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <Tab.Content>
            <Tab.Pane eventKey="/pdlike">
              {active.length > 0 ? (
                <div className={`row ${styles.line}`}>
                  {active.map((activity) => (
                    <div key={activity.id} className="col-4 mb-4">
                      <div className="card">
                        <img
                          src={`http://localhost:3005/upload/activity/${activity.img1}`}
                          alt={activity.CHN_name}
                          className="card-img-top"
                        />
                        <div className="card-body">
                          <h5 className="card-title">{activity.CHN_name}</h5>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() =>
                              toggleHeart(activity.id, activity.is_favorite)
                            }
                          >
                            {activity.is_favorite ? '❤️ 已收藏' : '🤍 收藏'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`row ${styles.line}`}>
                  <div
                    className={`col-12 ${styles['favorite-area']} d-flex justify-content-center align-items-center`}
                  >
                    <h5 className="h5">目前沒有收藏活動</h5>
                  </div>
                  <div className="col-12 d-flex justify-content-center align-items-center mt-5">
                    <h5 className="p">點擊愛心按鈕，將喜歡的活動加入收藏</h5>
                  </div>
                  <div className="col-12 d-flex justify-content-center align-items-center mt-5">
                    <Link href="/activity" passHref>
                      <button className="btn-primary h6">前往收藏</button>
                    </Link>
                  </div>
                </div>
              )}
            </Tab.Pane>
            <Tab.Pane eventKey="/classlike">
              <div className={`row ${styles.line}`}>
                <div
                  className={`col-12 ${styles['favorite-area']} d-flex justify-content-center align-items-center`}
                >
                  <h5 className="h5">目前沒有報名活動</h5>
                </div>
                <div className="col-12 d-flex justify-content-center align-items-center mt-5">
                  <h5 className="p">請先至活動頁面完成報名</h5>
                </div>
                <div className="col-12 d-flex justify-content-center align-items-center mt-5">
                  <Link href="/activity" passHref>
                    <button className="btn-primary h6">前往報名</button>
                  </Link>
                </div>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}
      </UserSection>
    </>
  )
}
