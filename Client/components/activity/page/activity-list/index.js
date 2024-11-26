import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Styles from '@/components/activity/page/activity-list/index.module.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import Brands from '@/components/home/common/brands'
import LoginModal from '@/components/shared/modal-confirm'
import { useAuth } from '@/hooks/use-auth'
import Dropdown from '@/components/activity/common/DropdownList'
import ActMobileCard from '@/components/activity/common/ListMobileCard'
import {
  PiMagnifyingGlass,
  PiHeartStraight,
  PiHeartStraightFill,
} from 'react-icons/pi'
import ListCarousel from '@/components/activity/common/ListCarousel/actCarousel'

export default function Activity() {
  const [filledHearts, setFilledHearts] = useState({})
  const [active, setActive] = useState([])
  const [originalActivities, setOriginalActivities] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false) // 控制 LoginModal 的顯示狀態
  const router = useRouter()
  const { auth } = useAuth()
  const userId = auth.userData.id // 當前登入的 user_id

  // 日期格式化函數
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // 確保月份是兩位數
    const day = String(date.getDate()).padStart(2, '0') // 確保日期是兩位數
    return `${year}/${month}/${day}`
  }
  useEffect(() => {
    console.log('使用者 ID:', userId) // 印出 userId
  }, [userId])
  //控制收藏
  const toggleHeart = async (id, isFavorite) => {
    if (userId === 0) {
      setShowLoginModal(true) // 如果未登入，顯示 LoginModal
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
        body: JSON.stringify({ activityId: id, userId }),
      })

      if (!response.ok) {
        throw new Error('無法更新收藏狀態')
      }

      const result = await response.json()
      console.log(result.message)

      // 更新整個 active 狀態
      setActive((prevActive) =>
        prevActive.map((item) =>
          item.id === id ? { ...item, is_favorite: !isFavorite } : item
        )
      )
    } catch (error) {
      console.error('收藏更新失敗:', error)
    }
  }

  //控制下拉是選單
  const fetchActivitiesByStatus = async (status) => {
    try {
      const url = `http://localhost:3005/api/activity/status/${userId}?status=${status}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('網路回應失敗：' + response.status)
      }
      const data = await response.json()
      setActive(data)
    } catch (err) {
      console.error('資料獲取失敗:', err)
    }
  }
  //控制月份塞選
  const fetchActivitiesByMonth = async (month) => {
    try {
      const url = month
        ? `http://localhost:3005/api/activity/month/${month}/${userId}`
        : `http://localhost:3005/api/activity/${userId}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('網路回應失敗：' + response.status)
      }
      const data = await response.json()
      setActive(data)
      setOriginalActivities(data)
      setSelectedMonth(month)
    } catch (err) {
      console.error('資料庫查詢失敗:', err)
    }
  }
  //控制活動搜尋
  const fetchActivitiesBySearch = async (query) => {
    try {
      const url = `http://localhost:3005/api/activity/search/${userId}?search=${encodeURIComponent(
        query
      )}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('網路回應失敗：' + response.status)
      }
      const data = await response.json()
      setActive(data) // 將搜尋結果設定為活動列表
    } catch (err) {
      console.error('搜尋資料獲取失敗:', err)
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
      {/* 月份按鈕 */}
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
                全部
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
      {/* 搜尋bar跟狀態塞選*/}
      <div
        className={`${Styles['act-search']} container d-flex flex-wrap justify-content-between mt-3`}
      >
        <form
          className={`${Styles['search']} d-flex me-auto my-2 my-lg-0 align-items-center`}
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            fetchActivitiesBySearch(searchQuery) // 使用搜尋字串進行查詢
          }}
        >
          <input
            className="form-control me-2 rounded-pill border-dark"
            type="search"
            placeholder="活動 |"
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

        {/* 992px以上顯示在右邊 */}
        <div className="ms-auto pc-drop text-center d-lg-block d-none">
          <div className="d-flex">
            <Dropdown
              name="狀態"
              items={[
                { option: '報名中', value: 1 },
                { option: '已截止', value: 0 },
              ]}
              onSelect={(status) => fetchActivitiesByStatus(status)}
            />
            <div className="mobile-drop d-block d-lg-none">
              <Dropdown
                name="月份"
                items={[
                  { option: 'ALL', value: null },
                  { option: '1月', value: 1 },
                  { option: '2月', value: 2 },
                  { option: '3月', value: 3 },
                  { option: '4月', value: 4 },
                  { option: '5月', value: 5 },
                  { option: '6月', value: 6 },
                  { option: '7月', value: 7 },
                  { option: '8月', value: 8 },
                  { option: '9月', value: 9 },
                  { option: '10月', value: 10 },
                  { option: '11月', value: 11 },
                  { option: '12月', value: 12 },
                ]}
                onSelect={(month) => fetchActivitiesByMonth(month)}
              />
            </div>
          </div>
        </div>

        {/* 992px以下顯示並置中 */}
        <div className="w-100 text-center mobile-drop d-block d-lg-none mt-3 w-50">
          <div className="d-flex">
            <Dropdown
              name="狀態"
              items={[
                { option: '報名中', value: 1 },
                { option: '已截止', value: 0 },
              ]}
              onSelect={(status) => fetchActivitiesByStatus(status)}
            />
            <div className="mobile-drop d-block d-lg-none">
              <Dropdown
                name="月份"
                items={[
                  { option: 'ALL', value: null },
                  { option: '1月', value: 1 },
                  { option: '2月', value: 2 },
                  { option: '3月', value: 3 },
                  { option: '4月', value: 4 },
                  { option: '5月', value: 5 },
                  { option: '6月', value: 6 },
                  { option: '7月', value: 7 },
                  { option: '8月', value: 8 },
                  { option: '9月', value: 9 },
                  { option: '10月', value: 10 },
                  { option: '11月', value: 11 },
                  { option: '12月', value: 12 },
                ]}
                onSelect={(month) => fetchActivitiesByMonth(month)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={Styles['act-main']}>
        <div className={`${Styles['month-title']} container`}>
          {selectedMonth ? `${selectedMonth} 月的活動` : '所有活動'}
        </div>

        {active.length === 0 ? (
          <div className={`${Styles['searchNotFound']} text-center`}>
            <h5>未找到任何活動</h5>
            <p>請嘗試搜尋其他關鍵字或篩選條件。</p>
          </div>
        ) : (
          <>
            {/* 手機版卡片 (小於 390px 顯示) */}
            <div
              className={`${Styles['act-MoBcard-sec']} container d-flex  flex-column align-items-center`}
            >
              {active.map((item) => (
                <div key={item.id} className={`${Styles['mobCard']} mb-3`}>
                  <ActMobileCard
                    id={item.id}
                    imgCover={`http://localhost:3005/upload/activity/${item.img1}`}
                    CHNname={item.CHN_name}
                    ENGname={item.ENG_name}
                    beginDate={item.start_at}
                    endDate={item.end_at}
                    status={
                      new Date(item.start_at) > new Date() ? '報名中' : '已截止'
                    }
                    isFavorite={item.is_favorite} // 使用 active 狀態
                    onToggleFavorite={toggleHeart} // 傳遞方法
                  />
                </div>
              ))}
            </div>

            {/* 桌面版卡片 (大於等於 390px 顯示) */}
            <div className={`${Styles['act-card-sec']} container`}>
              {active.map((item, index) => {
                const now = new Date()
                const startAt = new Date(item.start_at)
                const status = startAt > now ? '報名中' : '已截止'
                const statusClass =
                  status === '報名中' ? Styles['statusOn'] : Styles['statusOff']

                return (
                  <div
                    key={item.id}
                    className={`${
                      index % 2 === 0 ? Styles['cardLeft'] : Styles['cardRight']
                    } d-flex mb-4`}
                  >
                    {/* 左側文字內容 */}
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
                              <p>目前人數</p>
                            </div>
                            <div className="maxR">
                              <p className={Styles['num']}>{item.maxREG}</p>
                              <p>報名人數</p>
                            </div>
                            <div className="view">
                              <p className={Styles['num']}>{item.views}</p>
                              <p>瀏覽次數</p>
                            </div>
                          </div>
                          <p className={Styles['card-det']}>詳細資訊</p>
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
                          {/* {item.start_at} - {item.end_at} */}
                          {formatDate(item.start_at)} -{' '}
                          {formatDate(item.end_at)}
                        </div>
                        <div className={Styles['card-info']}>
                          <p>{item.brand}</p>
                          <p className={`${Styles['t1']}`}>主辦單位 | host</p>

                          <p className={Styles['title']}>活動地點 | location</p>
                          <p>{item.address}</p>
                        </div>
                        <div className={Styles['card-footer']}>
                          <div className={statusClass}>{status}</div>
                          <div
                            className={Styles['heart-icon']}
                            onClick={() =>
                              toggleHeart(item.id, item.is_favorite)
                            }
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

                    {/* 右側文字內容 */}
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
          </>
        )}
      </div>

      {/* 顯示 LoginModal，當用戶未登入時按下愛心按鈕彈出 */}
      {showLoginModal && (
        <LoginModal
          title="尚未登入會員"
          content={'是否前往登入?'}
          btnConfirm={'前往登入'}
          ConfirmFn={() => {
            router.push('/user/login/user')
          }}
          show={showLoginModal}
          handleClose={() => setShowLoginModal(false)}
        />
      )}

      <Brands />
    </>
  )
}
