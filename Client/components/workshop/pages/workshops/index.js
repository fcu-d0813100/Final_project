'use client'
import axios from 'axios'
import Footer from '@/components/home/common/footer'
import TopBar from '@/components/home/common/header'
import styles from '@/components/workshop/common/workshops.module.scss'
import WorkshopsBN from '@/components/workshop/common/workshop-bn'
import WorkshopSelectbar from '@/components/workshop/common/workshop-selectbar'
import WorkshopCardLg from '@/components/shared/workshop-card-lg'
import React, { useState, useEffect } from 'react'

export default function WorkshopAll(props) {
  const [Workshop, setWorkshop] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/workshop')
        if (!response.ok) {
          throw new Error('網路回應不成功：' + response.status)
        }
        const data = await response.json()
        setWorkshop(...data)
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  // useEffect(() => {
  //   async function getWorkshop() {
  //     try {
  //       let response = await axios.get(`http://localhost:3005/api/workshop`, {
  //         withCredentials: true,
  //       })
  //       const data = await response.json()
  //       setWorkshop(data)
  //     } catch (error) {
  //       console.error('Error fetching data:', error)
  //     }
  //   }
  //   getWorkshop()
  // }, [])
  const getStatus = (registrationStart, registrationEnd) => {
    const currentDate = new Date()
    const startDate = new Date(registrationStart)
    const endDate = new Date(registrationEnd)

    if (currentDate < startDate) {
      return '報名中'
    } else if (currentDate > endDate) {
      return '已截止'
    } else {
      return '報名中' // 這裡可根據需要進行調整
    }
  }

  return (
    <>
      <TopBar />
      <WorkshopsBN />

      <WorkshopSelectbar />

      <div className={`${styles.section03} container`}>
        <div className={`${styles.tOwnWorkshops} row row-cols-3 my-5`}>
          {Workshop.map((item) => {
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
              item.registration_start,
              item.registration_end
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
                key={item.id}
                imgCover={`/workshop/workshop_img/${item.type_id}-${item.id}-c.jpg`}
                name={item.name}
                teacher={item.teacher_name}
                beginDate={beginDate}
                endDate={endDate}
                price={item.price}
                status={status}
              />
            )
          })}
        </div>
      </div>
      <Footer />
    </>
  )
}
