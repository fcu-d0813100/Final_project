'use client'
import MyWorkshopBox from '@/components/teacher/common/t-dashboard-myWorkshopBox'
import { useAuth } from '@/hooks/use-auth'
import Image from 'next/image'
import Dropdown from '@/components/workshop/common/dropdown'
import { PiMagnifyingGlass, PiFolderSimpleDashed } from 'react-icons/pi'
import styles from '@/components/teacher/common/myworkshop.module.scss'
import Sidebar from '@/components/teacher/common/t-dashboard-side-bar'
import TDashboardBN from '@/components/teacher/common/t-dashboard-bn'
import DashboardTitle from '@/components/shared/dashboard-title-y'
import React, { useState, useEffect } from 'react'
import { Link } from 'phosphor-react'

export default function MyWorkshop(props) {
  const { auth, login, logout } = useAuth()
  const { userData } = auth // 撈取 teacherData 資料
  const [workshop, setWorkshop] = useState(null)
  const [filterStatus, setFilterStatus] = useState('unpublished')

  useEffect(() => {
    // 當頁面一加載，滾動到指定位置
    window.scrollTo(0, 580)
  }, [])

  useEffect(() => {
    fetchData()
  }, [filterStatus]) // 將 filterStatus 作為依賴項

  const fetchData = async () => {
    try {
      const response = await fetch(
        'http://localhost:3005/api/workshop/myWorkshop',
        {
          credentials: 'include', //一定要加，才會帶cookie
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (!response.ok) {
        throw new Error('網路回應不成功：' + response.status)
      }
      const data = await response.json()
      setWorkshop(...data) // 確保獲取到的資料即時更新
      //console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  // 根據 filterStatus 來篩選資料
  const filteredWorkshop = workshop
    ? workshop.filter((item) => {
        if (filterStatus === 'unpublished')
          return item.isUpload === 0 && item.valid === 1
        if (filterStatus === 'trash') return item.valid === 0
        return item.isUpload == 1 && item.valid == 1 // 已發佈的條件
      })
    : []

  return (
    <>
      <TDashboardBN />

      <div>
        <Sidebar />

        <div className={styles.main}>
          <DashboardTitle chTitle="我的課程" enTitle="workshop" />

          <div>
            <div className={styles.selectbar}>
              <div className={styles.searchArea}>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="搜尋"
                  />
                  <a
                    className="d-flex align-items-center text-decoration-none ms-3 text-dark ph"
                    href="#"
                  >
                    <PiMagnifyingGlass />
                  </a>
                </div>

                <div className="d-flex ">
                  <Dropdown
                    name="狀態"
                    items={[
                      { option: '報名中', link: '' },
                      { option: '已截止', link: '' },
                    ]}
                  />

                  <Dropdown
                    name="類型"
                    items={[
                      { option: '基礎化妝', link: '' },
                      { option: '新娘化妝', link: '' },
                      { option: '時尚與攝影化妝', link: '' },
                      { option: '韓系美妝', link: '' },
                      { option: '特效化妝', link: '' },
                      { option: '美妝產品知識', link: '' },
                    ]}
                  />

                  <Dropdown
                    name="排序"
                    items={[
                      { option: '價錢 高 -- 低', link: '' },
                      { option: '價錢 低 -- 高', link: '' },
                      { option: '最新上架', link: '' },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.filterBtn} p ms-2 mb-3`}>
            <button
              className={filterStatus === 'unpublished' ? styles.active : ''}
              onClick={() => setFilterStatus('unpublished')}
            >
              未發布
            </button>
            <button
              className={filterStatus === 'published' ? styles.active : ''}
              onClick={() => setFilterStatus('published')}
            >
              已發布
            </button>
            <button
              className={filterStatus === 'trash' ? styles.active : ''}
              onClick={() => setFilterStatus('trash')}
            >
              垃圾桶
            </button>
          </div>

          {filteredWorkshop && filteredWorkshop.length > 0 ? (
            filteredWorkshop.map((item) => {
              // 將 dates 字串轉換成陣列
              const datesArray = item.dates ? item.dates.split(',') : []

              // 日期格式化函式，將 YYYY-MM-DD 格式轉換為 YYYY/MM/DD
              const formatDate = (dateString) => {
                const [year, month, day] = dateString.split('-')
                return `${year}/${month}/${day}`
              }

              // 取得第一個和最後一個日期，並格式化為 YYYY/MM/DD
              const beginDate =
                datesArray.length > 0 ? formatDate(datesArray[0]) : ''
              const endDate =
                datesArray.length > 0
                  ? formatDate(datesArray[datesArray.length - 1])
                  : ''

              return (
                <MyWorkshopBox
                  key={item.id}
                  id={item.id}
                  img={`http://localhost:3005/workshop/${item.img_cover}`}
                  name={item.name}
                  start_date={beginDate}
                  end_date={endDate}
                  price={item.price}
                  isUpload={item.isUpload}
                  registration_start={item.registration_start}
                  registration_end={item.registration_end}
                  filterStatus={filterStatus}
                  setWorkshop={setWorkshop}
                  
                />
              )
            })
          ) : (
            <p className={styles.noneWorkshopText}>
              <PiFolderSimpleDashed className={styles.noneWorkshopIcon} />
              <br />
              目前沒有此類型課程資料
            </p>
          )}
        </div>
      </div>
    </>
  )
}
