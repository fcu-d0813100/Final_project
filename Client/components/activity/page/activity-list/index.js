import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Styles from '@/components/activity/page/activity-list/index.module.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import Brands from '@/components/home/common/brands'
import LoginModal from '@/components/shared/modal-confirm'
import { useAuth } from '@/hooks/use-auth'
import {
  PiMagnifyingGlass,
  PiHeartStraight,
  PiHeartStraightFill,
} from 'react-icons/pi'
import Dropdown from '@/components/shared/dropdownList/sample'
import ListCarousel from '@/components/activity/common/ListCarousel/actCarousel'

export default function Activity() {
  const [filledHearts, setFilledHearts] = useState({})
  const [active, setActive] = useState([])
  const [originalActivities, setOriginalActivities] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false) // 控制 LoginModal 的显示状态
  const router = useRouter()
  const { auth } = useAuth()
  const userId = auth.userData.id // 当前登录的 user_id

  useEffect(() => {
    console.log('User ID:', userId) // 打印 userId
  }, [userId])

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
        throw new Error('无法更新收藏状态')
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
      console.error('收藏更新失败:', error)
    }
  }

  const fetchActivitiesByMonth = async (month) => {
    try {
      const url = month
        ? `http://localhost:3005/api/activity/month/${month}`
        : `http://localhost:3005/api/activity/${userId}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('网络响应失败：' + response.status)
      }
      const data = await response.json()
      setActive(data)
      setOriginalActivities(data)
      setSelectedMonth(month)
    } catch (err) {
      console.error('数据库查询失败:', err)
    }
  }

  useEffect(() => {
    fetchActivitiesByMonth(selectedMonth)
  }, [selectedMonth, userId])

  return (
    <>
      <div className={Styles['act-img-container']}>
        <ListCarousel />
      </div>

      <div className={`${Styles['act-sec1']} container d-none d-lg-block`}>
        <div className={`${Styles['act-month-button']} d-none d-lg-block`}>
          <ul className="d-flex justify-content-around">
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  fetchActivitiesByMonth(null)
                }}
              >
                ALL
              </a>
            </li>
            {[...Array(12)].map((_, i) => (
              <li key={i}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    fetchActivitiesByMonth(i + 1)
                  }}
                >
                  {i + 1} 月
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`${Styles['act-search']} container d-flex flex-wrap justify-content-between`}
      >
        <form
          className={`${Styles['search']} d-flex me-auto my-2 my-lg-0 align-items-center`}
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            fetchActivitiesByMonth(null)
          }}
        >
          <input
            className="form-control me-2 rounded-pill border-dark"
            type="search"
            placeholder="活动 |"
            aria-label="Search"
            style={{ height: '30px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="btn d-flex align-items-center justify-content-center"
            type="submit"
            style={{ height: '30px', padding: '0 10px' }}
          >
            <PiMagnifyingGlass style={{ width: '20px', height: '20px' }} />
          </button>
        </form>
        <div className="ms-auto pc-drop text-center d-lg-block d-none">
          <Dropdown />
        </div>
      </div>

      <div className={Styles['act-main']}>
        <div className={`${Styles['month-title']} container`}>
          {selectedMonth ? `${selectedMonth} 月的活动` : '所有活动'}
        </div>

        {active.length === 0 ? (
          <div className={`${Styles['searchNotFound']} text-center`}>
            <h5>未找到任何活动</h5>
            <p>请尝试搜索其他关键字或筛选条件。</p>
          </div>
        ) : (
          <div className={`${Styles['act-card-sec']} container`}>
            {active.map((item, index) => {
              const now = new Date()
              const startAt = new Date(item.start_at)
              const status = startAt > now ? '报名中' : '已截止'
              const statusClass =
                status === '报名中' ? Styles['statusOn'] : Styles['statusOff']

              return (
                <div
                  key={item.id}
                  className={`${
                    index % 2 === 0 ? Styles['cardLeft'] : Styles['cardRight']
                  } d-flex`}
                >
                  {index % 2 !== 0 && (
                    <>
                      <div className={Styles['leftTextCHN']}>
                        {item.CHN_name}
                      </div>
                      <div className={Styles['leftTextENG']}>
                        {item.ENG_name}
                      </div>
                    </>
                  )}

                  <div
                    className={`${
                      index % 2 === 0 ? Styles['cardL'] : Styles['cardR']
                    }`}
                  >
                    <Link href={`/activity/activity-det?id=${item.id}`}>
                      <div className={Styles['card-img']}>
                        <div className={`${Styles['card-text']} d-flex`}>
                          <div className="currentR">
                            <p className={Styles['num']}>{item.currentREG}</p>
                            <p>目前人数</p>
                          </div>
                          <div className="maxR">
                            <p className={Styles['num']}>{item.maxREG}</p>
                            <p>报名人数</p>
                          </div>
                          <div className="view">
                            <p className={Styles['num']}>{item.views}</p>
                            <p>浏览次数</p>
                          </div>
                        </div>
                        <p className={Styles['card-det']}>详细信息</p>
                        <Image
                          src={`http://localhost:3005/upload/activity/${item.img1}`}
                          width={1200}
                          height={800}
                          alt={item.CHN_name}
                        />
                      </div>
                    </Link>

                    <div className={Styles['card-content']}>
                      <div className={Styles['card-date']}>
                        {item.start_at}~{item.end_at}
                      </div>
                      <div className={Styles['card-info']}>
                        <p className={Styles['title']}>主办单位 | host</p>
                        <p>{item.brand}</p>
                        <p className={Styles['title']}>活动地点 | location</p>
                        <p>{item.address}</p>
                      </div>
                      <div className={Styles['card-footer']}>
                        <div className={statusClass}>{status}</div>
                        <div
                          className={Styles['heart-icon']}
                          onClick={() => toggleHeart(item.id, item.is_favorite)}
                          role="button"
                          tabIndex="0"
                        >
                          {item.is_favorite ? (
                            <PiHeartStraightFill
                              size={22}
                              className={Styles['ph-heart']}
                            />
                          ) : (
                            <PiHeartStraight
                              size={22}
                              className={Styles['ph-heart']}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {index % 2 === 0 && (
                    <>
                      <div className={Styles['rightTextCHN']}>
                        {item.CHN_name}
                      </div>
                      <div className={Styles['rightTextENG']}>
                        {item.ENG_name}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 显示 LoginModal，当用户未登录时按下爱心按钮弹出 */}
      {showLoginModal && (
        <LoginModal
          title="尚未登入會員"
          content={'是否前往登入?'}
          btnConfirm={'前往登入'}
          ConfirmFn={() => {
            router.push('/user/login/user')
          }}
          show={showLoginModal}
          onHide={() => setShowLoginModal(false)}
        />
      )}

      <Brands />
    </>
  )
}
