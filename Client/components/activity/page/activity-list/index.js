import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Styles from '@/components/activity/page/activity-list/index.module.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import Brands from '@/components/home/common/brands'
import ListMobileCard from '@/components/activity/common/ListMobileCard/activity-mobile'
import {
  PiMagnifyingGlass,
  PiHeartStraight,
  PiHeartStraightFill,
} from 'react-icons/pi'
import Dropdown from '@/components/shared/dropdownList/sample'
import ListCarousel from '@/components/activity/common/ListCarousel/actCarousel'

export default function Activity(props) {
  const [filledHearts, setFilledHearts] = useState({}) // 狀態物件以記錄每張卡片的愛心狀態
  const [active, setActive] = useState([])

  const toggleHeart = (id) => {
    setFilledHearts((prevFilledHearts) => ({
      ...prevFilledHearts,
      [id]: !prevFilledHearts[id], // 切換特定卡片的愛心狀態
    }))
  }

  useEffect(() => {
    typeof document !== undefined
      ? require('bootstrap/dist/js/bootstrap.bundle.min.js')
      : null
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/activity')
        if (!response.ok) {
          throw new Error('網路回應不成功：' + response.status)
        }
        const data = await response.json()
        setActive(data)
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      {/* 輪播圖片 */}
      <div className={Styles['act-img-container']}>
        <ListCarousel />
      </div>

      <div className={`${Styles['act-sec1']} container d-none d-lg-block`}>
        <div className={`${Styles['act-month-button']} d-none d-lg-block`}>
          <ul className="d-flex justify-content-around">
            <li>
              <a href="#">ALL</a>
            </li>
            {[...Array(12)].map((_, i) => (
              <li key={i}>
                <a href="#">{i + 1} 月</a>
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
        >
          <input
            className="form-control me-2 rounded-pill border-dark"
            type="search"
            placeholder="活動 |"
            aria-label="Search"
            style={{ height: '30px' }}
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
        <div className={`${Styles['month-title']} container`}>所有活動</div>

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
                      src={`/activity/${item.activity_img1}`}
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
                    <div className={Styles['status']}>{item.status}</div>
                    <div
                      className={Styles['heart-icon']}
                      onClick={() => toggleHeart(item.activity_id)}
                      role="button"
                    >
                      {filledHearts[item.activity_id] ? (
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
                  <div className={Styles['rightTextCHN']}>{item.CHN_name}</div>
                  <div className={Styles['rightTextENG']}>{item.ENG_name}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <Brands />
    </>
  )
}
