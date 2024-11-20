'use client'
import CardCarousel from '@/components/product/common/product-container1'
import Dropdown from '@/components/workshop/common/dropdown'
import { useRouter } from 'next/router'
import styles from '@/components/teacher/common/teacher-detail.module.scss'
import Image from 'next/image'
import { PiMagnifyingGlass, PiCaretDown, PiArrowRight } from 'react-icons/pi'

import WorkshopCardLg from '@/components/shared/workshop-card-lg'
import TeacherDetailBn from '@/components/teacher/common/teacher-detail-bn'
import TeacherDetailText from '@/components/teacher/common/teacher-detail-text'

import React, { useState, useEffect } from 'react'

export default function TeacherDetail(props) {
  const router = useRouter()
  const [teacher, setTeacher] = useState({})
  const [workshop, setWorkshop] = useState([])
  const [newArrivalProducts, setNewArrivalProducts] = useState([])

  const fetchData = async (tid) => {
    try {
      const response = await fetch(`http://localhost:3005/api/teacher/${tid}`)
      if (!response.ok) {
        throw new Error('網路回應不成功：' + response.status)
      }
      const data = await response.json()
      setTeacher(...data)
      //console.log(data)

      // 獲取該老師的工作坊數據
      const workshopsResponse = await fetch(
        `http://localhost:3005/api/teacher/${tid}`
      )
      if (!workshopsResponse.ok) {
        throw new Error('網路回應不成功：' + workshopsResponse.status)
      }
      const workshopsData = await workshopsResponse.json()
      setWorkshop(workshopsData) // 設置工作坊數據
      console.log(workshopsData)
    } catch (err) {
      console.log(err)
    }
  }

  // 用useEffect監聽router.isReady變動
  useEffect(() => {
    if (router.isReady) {
      fetchData(router.query.tid)
    }
  }, [router.isReady])

  // 新品上市
  useEffect(() => {
    // Fetch 新品上市商品資料
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch(
          `http://localhost:3005/api/product/product-list?isNewArrivals=true&timestamp=${Date.now()}`
        )
        if (!response.ok) throw new Error('Failed to fetch new arrivals')
        const data = await response.json()
        setNewArrivalProducts(data)
      } catch (error) {
        console.error('Error fetching new arrivals:', error)
      }
    }
    fetchNewArrivals()
  }, [])

  const nationMap = {
    臺灣: 'Taiwan',
    美國: 'America',
    日本: 'Japan',
    英國: 'Britain',
    新加坡: 'Singapore',
    法國: 'France',
    韓國: 'Korea',
    西班牙: 'Spain',
  }

  const enNation = nationMap[teacher.nation] || '' // 預設為空字串

  const getStatus = (registrationStart, registrationEnd) => {
    const currentDate = new Date()
    const startDate = new Date(registrationStart)
    const endDate = new Date(registrationEnd)

    if (currentDate < startDate) {
      return '即將開課' // 時間在 startDate 之前
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return '報名中' // 時間在 startDate 和 endDate 之間
    } else if (currentDate > endDate) {
      return '已截止' // 時間在 endDate 之後
    }
  }

  return (
    <>
      <TeacherDetailBn
        imgBanner={`/teacher/teachers_img/T_${teacher.id}_BN.jpg`}
        name={teacher.name}
        nation={`${teacher.nation} | ${enNation}`}
        years={teacher.years}
        typeId={teacher.workshop_type_type}
        signImg={`/teacher/teachers_img/T_${teacher.id}_S.png`}
      />

      <TeacherDetailText
        slogan={teacher.slogan}
        about={teacher.about}
        experience={teacher.experience}
      />

      <div className={styles.section03}>
        <div className="container">
          <div className={styles.tWorkshopTitle}>
            <h1 className="h1-L">Workshop</h1>
            <h4 className="h4">{teacher.name}</h4>
          </div>

          <div className={styles.selectBar}>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className={styles.searchInput}
                placeholder="搜尋"
              />
              <a
                className="d-flex align-items-center text-decoration-none ph text-dark ms-3"
                href="#"
              >
                <PiMagnifyingGlass />
              </a>
            </div>

            <div className={`${styles.dropdownStyles} d-flex`}>
              <Dropdown
                name="狀態"
                items={[
                  { option: '狀態', value: '' },
                  { option: '即將開課', value: '' },
                  { option: '報名中', value: '' },
                  { option: '已截止', value: '' },
                ]}
              />

              <Dropdown
                name="排序"
                items={[
                  { option: '排序', value: '' },
                  { option: '價錢 高 -- 低', value: '' },
                  { option: '價錢 低 -- 高', value: '' },
                  { option: '最新上架', value: '' },
                ]}
              />
            </div>
          </div>

          <div
            className={`${styles.tOwnWorkshops} row row-cols-sm-1 row-cols-md-2 row-cols-xl-3 my-5`}
          >
            {workshop.map((item) => {
              // 將 dates 字串轉換成陣列
              const datesArray = item.dates ? item.dates.split(',') : []

              // 取得第一個和最後一個日期，並格式化為 YYYY/MM/DD
              const formatDate = (dateString) => {
                const [year, month, day] = dateString.split('-')
                return `${year}/${month}/${day}`
              }

              // 取得第一個和最後一個日期
              const beginDate =
                datesArray.length > 0 ? formatDate(datesArray[0]) : ''
              const endDate =
                datesArray.length > 0
                  ? formatDate(datesArray[datesArray.length - 1])
                  : ''

              // 獲取報名狀態
              const status = getStatus(
                item.workshop_registration_start,
                item.workshop_registration_end
              )

              // 檢查課程時間結束日期是否已過
              const isEndDatePassed =
                new Date(endDate.replace(/\//g, '-')) < new Date() // 檢查 endDate 是否已過

              // 如果課程時間的 endDate 已過，則不顯示該工作坊
              if (isEndDatePassed) {
                return null // 不顯示該工作坊
              }

              return (
                <WorkshopCardLg
                  key={item.workshop_id}
                  wid={item.workshop_id}
                  imgCover={`http://localhost:3005/workshop/${item.workshop_img_cover}`}
                  name={item.workshop_name}
                  teacher={item.name}
                  beginDate={beginDate}
                  endDate={endDate}
                  price={item.workshop_price}
                  status={status}
                />
              )
            })}
          </div>
        </div>
      </div>
      <CardCarousel products={newArrivalProducts} />
    </>
  )
}
