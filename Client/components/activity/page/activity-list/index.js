import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Styles from '@/components/activity/page/activity-list/index.module.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import Brands from '@/components/home/common/brands'
import ListMobileCard from '@/components/activity/common/ListMobileCard/activity-mobile'
import ListMonthBtn from '../../common/ListMonthBtn'
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
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const toggleHeart = (id) => {
    setFilledHearts((prevFilledHearts) => ({
      ...prevFilledHearts,
      [id]: !prevFilledHearts[id],
    }))
  }

  useEffect(() => {
    typeof document !== undefined
      ? require('bootstrap/dist/js/bootstrap.bundle.min.js')
      : null
  }, [])

  const fetchActivitiesByMonth = async (month) => {
    try {
      const url = month
        ? `http://localhost:3005/api/activity/${month}`
        : `http://localhost:3005/api/activity`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('網路回應不成功：' + response.status)
      }
      const data = await response.json()
      setActive(data)
      setSelectedMonth(month)
    } catch (err) {
      console.error('資料庫查詢失敗:', err)
    }
  }

  const handleSearchSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(
        `http://localhost:3005/api/activity/search?search=${encodeURIComponent(
          searchQuery
        )}`
      )
      if (!response.ok) {
        throw new Error('網路回應不成功：' + response.status)
      }
      const data = await response.json()
      setActive([...data])
      setSearchQuery('') // 清空搜尋框
    } catch (err) {
      console.error('資料庫查詢失敗:', err)
      setActive([]) // 查詢失敗時將 active 設為空陣列
    }
  }

  useEffect(() => {
    const month = router.query.month ? parseInt(router.query.month) : null
    fetchActivitiesByMonth(month)
  }, [router.query.month])

  return (
    <>
      <div className={Styles['act-img-container']}>
        <ListCarousel />
      </div>

      <div className={`${Styles['act-sec1']} container d-none d-lg-block`}>
        <div className={`${Styles['act-month-button']} d-none d-lg-block`}>
          <ul className="d-flex justify-content-around">
            <li>
              <a href="#" onClick={() => fetchActivitiesByMonth(null)}>
                ALL
              </a>
            </li>
            {[...Array(12)].map((_, i) => (
              <li key={i}>
                <a href="#" onClick={() => fetchActivitiesByMonth(i + 1)}>
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
          onSubmit={handleSearchSubmit}
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
        <div className="ms-auto pc-drop text-center d-lg-block d-none">
          <Dropdown />
        </div>
      </div>

      <div className="d-flex d-lg-none justify-content-center">
        <Dropdown />
      </div>

      <div className={Styles['act-main']}>
        <div className={`${Styles['month-title']} container`}>
          {selectedMonth ? `${selectedMonth} 月的活動` : '所有活動'}
        </div>

        {/* 檢查活動數據是否為空，顯示提示信息 */}

        {active.length === 0 ? (
          <div className={`${Styles['searchNotFound']} text-center`}>
            <h5>未找到任何活動</h5>
            <p>請嘗試搜尋其他關鍵字或篩選條件。</p>
          </div>
        ) : (
          <div className={`${Styles['act-card-sec']} container`}>
            {active.map((item, index) => (
              <div
                key={item.id}
                className={`${
                  index % 2 === 0 ? Styles['cardLeft'] : Styles['cardRight']
                } d-flex`}
              >
                {index % 2 !== 0 && (
                  <>
                    <div className={Styles['leftTextCHN']}>{item.CHN_name}</div>
                    <div className={Styles['leftTextENG']}>{item.ENG_name}</div>
                  </>
                )}

                <div
                  className={`${
                    index % 2 === 0 ? Styles['cardL'] : Styles['cardR']
                  }`}
                >
                  <Link href="/activity/activity-det">
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
                        src={`/activity/${item.img1}`}
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
                      <p className={Styles['title']}>主辦單位 | host</p>
                      <p>{item.brand}</p>
                      <p className={Styles['title']}>活動地點 | location</p>
                      <p>{item.address}</p>
                    </div>
                    <div className={Styles['card-footer']}>
                      <div className={Styles['status']}>報名中</div>

                      <div
                        className={Styles['heart-icon']}
                        onClick={() => toggleHeart(item.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            toggleHeart(item.id)
                          }
                        }}
                        role="button"
                        tabIndex="0"
                      >
                        {filledHearts[item.id] ? (
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
            ))}
          </div>
        )}
      </div>
      <Brands />
    </>
  )
}
