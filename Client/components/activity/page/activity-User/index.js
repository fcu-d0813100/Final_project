import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Tab, Nav } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './index.module.scss'
import Image from 'next/image'
import UserSection from '@/components/user/common/user-section'
import { useAuth } from '@/hooks/use-auth'
import {
  PiMagnifyingGlass,
  PiHeartStraight,
  PiHeartStraightFill,
  PiArrowRight,
} from 'react-icons/pi'

export default function Index(props) {
  const { auth } = useAuth()
  const userId = auth.userData.id
  const [active, setActive] = useState([]) // 存储用户收藏的活动
  const [reg, setReg] = useState([]) // 存储用户报名的活动

  useEffect(() => {
    if (userId) {
      fetchFavorites()
      fetchUserRegistrations() // 獲取報名活動
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
  const fetchUserRegistrations = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/activity/reg/${userId}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch registered activities')
      }
      const data = await response.json()
      console.log('Registered activities:', data) // 調試：打印撈取的資料
      setReg(data) // 更新 reg 狀態
    } catch (error) {
      console.error('Error fetching registered activities:', error)
    }
  }

  const toggleHeart = async (id, isFavorite) => {
    try {
      const url = isFavorite
        ? 'http://localhost:3005/api/activity/unfavorite'
        : 'http://localhost:3005/api/activity/favorite'

      const response = await fetch(url, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId: id, userId }),
      })

      if (!response.ok) {
        throw new Error('收藏操作失敗')
      }

      // 更新 `active` 狀態中的 `is_favorite` 屬性
      setActive((prevActive) =>
        prevActive.map((item) =>
          item.id === id ? { ...item, is_favorite: !isFavorite } : item
        )
      )
    } catch (error) {
      console.error('更新收藏狀態失敗:', error)
    }
  }

  return (
    <>
      <UserSection titleCN="活動紀錄" titleENG="Activity favorite">
        <Tab.Container defaultActiveKey="/pdlike">
          <div className={styles['post-navbar']}>
            <Nav variant="underline" className={`${styles['nav-item']} h6 `}>
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
                <div className={`row ${styles.line} `}>
                  {active.map((item) => (
                    <div key={item.id} className={`${styles.fav} col-4 mt-5`}>
                      <div className={`${styles.workshop} p-0`}>
                        <div className={styles.workshopImg}>
                          <Image
                            height={615}
                            width={480}
                            className={styles.coverImg}
                            src={`http://localhost:3005/upload/activity/${item.img1}`}
                            alt={`${item.CHN_name} 的圖片`}
                          />
                        </div>
                        <div className={styles.wInformation}>
                          <div className={styles.innerText}>
                            <div>
                              <h4
                                className={`h5 ${styles.wTitle} d-flex align-items-center justify-content-between`}
                              >
                                {item.CHN_name}
                                <div
                                  className={`${styles['heart-icon']} me-3`}
                                  onClick={() =>
                                    toggleHeart(item.id, item.is_favorite)
                                  }
                                  aria-label={
                                    item.is_favorite ? '取消收藏' : '添加收藏'
                                  }
                                >
                                  {item.is_favorite ? (
                                    <PiHeartStraightFill
                                      size={22}
                                      className={styles['ph-heart']}
                                    />
                                  ) : (
                                    <PiHeartStraight
                                      size={22}
                                      className={styles['ph-heart']}
                                    />
                                  )}
                                </div>
                              </h4>
                            </div>
                            <div className={styles.wDetail}>
                              <p className="p mb-2">{item.ENG_name}</p>
                              <h6 className="p mb-3">
                                活動時間
                                <br />
                                {item.start_at} - {item.end_at}
                              </h6>
                              <div className={styles.wStatus}>
                                <p
                                  className={`ps ${
                                    item.status === '已截止'
                                      ? styles.over
                                      : styles.nowOpen
                                  }`}
                                >
                                  {item.status}
                                </p>
                                <Link
                                  href={`/activity/activity-det?id=${item.id}`}
                                >
                                  <div className={styles.more}>
                                    <h6 className="h6">MORE</h6>
                                    <PiArrowRight
                                      className={`${styles.phArrow} ms-2`}
                                    />
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </div>
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
            {/* 報名的活動 */}
            <Tab.Pane eventKey="/classlike">
              {reg.length > 0 ? (
                <div className={`row ${styles.line}`}>
                  {reg.map((activity) => (
                    <div key={activity.id} className="col-4 mt-5">
                      <div className={`${styles.workshop} p-0`}>
                        <div className={styles.workshopImg}>
                          <Image
                            height={615}
                            width={480}
                            className={styles.coverImg}
                            src={`http://localhost:3005/upload/activity/${activity.img1}`}
                            alt={`${activity.CHN_name} 的圖片`}
                          />
                        </div>
                        <div className={styles.wInformation}>
                          <div className={styles.innerText}>
                            <h4 className={`h5 ${styles.wTitle}`}>
                              {activity.CHN_name}
                            </h4>
                            <p className="p mb-2">{activity.ENG_name}</p>
                            <h6 className="p mb-3">
                              報名人數：{activity.applicant_amount}
                            </h6>
                            <h6 className="p mb-3">
                              報名人姓名：
                              {activity.applicant_name || '暫無資料'}
                            </h6>
                            <h6 className="p mb-3">
                              報名電話：{activity.applicant_phone || '暫無資料'}
                            </h6>
                            <h6 className="p mb-3">
                              報名日期：{activity.applicant_date || '暫無資料'}
                            </h6>
                            <Link
                              href={`/activity/activity-det?id=${activity.id}`}
                            >
                              <div
                                className={`${styles.more} d-flex justify-content-end me-4`}
                                style={{ color: '#963827' }}
                              >
                                <h6 className="h6">MORE</h6>
                                <PiArrowRight
                                  className={`${styles.phArrow} ms-2`}
                                  style={{ color: '#963827' }} // 將圖標也設為紅色
                                />
                              </div>
                            </Link>
                          </div>
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
                    <h5 className="h5">目前沒有報名活動</h5>
                  </div>

                  <div className="col-12 d-flex justify-content-center align-items-center mt-5">
                    <Link href="/activity" passHref>
                      <button className="btn-primary h6">前往收藏</button>
                    </Link>
                  </div>
                </div>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </UserSection>
    </>
  )
}
