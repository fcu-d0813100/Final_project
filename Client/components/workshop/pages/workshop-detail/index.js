'use client'
import Brands from '@/components/home/common/brands'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useCartWorkshop } from '@/hooks/use-cartW'
import styles from '@/components/workshop/common/workshop-detail.module.scss'
import Image from 'next/image'
import WorkshopDetailHeader from '@/components/workshop/common/workshop-detail-header'
import TimeSelect from '@/components/workshop/common/time-select'
import WorkshopDetailInfo from '@/components/workshop/common/workshop-detail-info'
import WorkshopAddCartInfo from '@/components/workshop/common/workshop-addcart-info'
import { PiMinus, PiPlus, PiPlusCircle, PiHandbagSimple } from 'react-icons/pi'
import React, { useState, useEffect } from 'react'
import ToastSuccess from '@/components/shared/toast-success'

export default function WorkshopDetail() {
  //----------吐司訊息
  const { addToCartToast } = ToastSuccess({
    message: '成功加入購物車！',
    functionName: 'addToCartToast', // 動態函數名稱
  })

  const { onAddWorkshop } = useCartWorkshop()
  const router = useRouter()
  const [tworkshop, settWorkshop] = useState({})
  const [selectedTime, setSelectedTime] = useState(null)

  const fetchData = async (wid) => {
    try {
      const response = await fetch(`http://localhost:3005/api/workshop/${wid}`)
      if (!response.ok) {
        throw new Error('網路回應不成功：' + response.status)
      }
      const data = await response.json()
      settWorkshop(...data)
      //console.log(...data)
    } catch (err) {
      console.log(err)
    }
  }

  // 用useEffect監聽router.isReady變動
  useEffect(() => {
    if (router.isReady) {
      fetchData(router.query.wid)
    }
  }, [router.isReady])

  // const [classTime, setClassTime] = useState()

  // const handleIncrease = (classTimeId) => {
  //   const nextClassTime = classTime.map((v) =>
  //     v.id === classTimeId ? { ...v, count: v.count + 1 } : v
  //   )
  //   setClassTime(nextClassTime)
  // }

  // const handleDecrease = (classTimeId) => {
  //   const nextClassTime = classTime.map((v) =>
  //     v.id === classTimeId && v.count > 0 ? { ...v, count: v.count - 1 } : v
  //   )
  //   setClassTime(nextClassTime)
  // }

  const handleSelectTime = (time) => {
    setSelectedTime(time)
  }

  const handleAddToCart = (navigateToCart = false) => {
    console.log('加入購物車前的 selectedTime:', selectedTime)
    if (selectedTime) {
      onAddWorkshop({
        id: selectedTime.id,
        name: tworkshop.name,
        date: selectedTime.date,
        beginTime: selectedTime.beginTime,
        endTime: selectedTime.endTime,
        typeId: tworkshop.type_id,
        // classId: selectedTime.id,
        price: tworkshop.price,
        cover: tworkshop.img_cover,
        teacher: tworkshop.teacher_name,
      })

      addToCartToast()

      if (navigateToCart) {
        router.push('/cart') // 只有當參數為 true 時才跳轉
      }
    }
  }

  // 分割資料
  const dates = tworkshop.dates ? tworkshop.dates.split(',') : []
  const startTimes = tworkshop.start_times
    ? tworkshop.start_times.split(',')
    : []
  const endTimes = tworkshop.end_times ? tworkshop.end_times.split(',') : []
  const timeId = tworkshop.time_id ? tworkshop.time_id.split(',') : []
  const registered = tworkshop.workshop_time_registered
    ? tworkshop.workshop_time_registered.split(',')
    : []
  const maxStudents = tworkshop.max_students
    ? tworkshop.max_students.split(',')
    : []
  // 計算時數的函數
  const calculateHours = (beginTime, endTime) => {
    const start = new Date(`1970-01-01T${beginTime}Z`)
    const end = new Date(`1970-01-01T${endTime}Z`)
    const diffMs = end - start
    return diffMs / (1000 * 60 * 60) // 將毫秒轉換為小時
  }

  const datesArray = tworkshop.dates ? tworkshop.dates.split(',') : []

  return (
    <>
      <WorkshopDetailHeader
        name={tworkshop.name}
        description={tworkshop.description}
        beginDate={
          datesArray.length > 0 ? datesArray[0].replace(/-/g, '/') : ''
        }
        endDate={
          datesArray.length > 0
            ? datesArray[datesArray.length - 1].replace(/-/g, '/')
            : ''
        }
        address={tworkshop.address}
        type={tworkshop.workshop_type_type}
        teacher={tworkshop.teacher_name}
        cover={`http://localhost:3005/workshop/${tworkshop.img_cover}`}
      />

      <div className={styles.workshopSpace}>
        <Image
          width={500}
          height={200}
          className={styles.workshopImg}
          src="/workshop/workshop.svg"
          alt=""
        />
      </div>
      <div className={`container ${styles.section02} py-5`}>
        <h4 className="h4 text-center mb-5">開課時程</h4>

        <div className="row row-cols-3 g-4">
          {dates.map((date, index) => {
            // 將 date 轉換為當天午夜的 Date 物件進行比較
            const workshopDate = new Date(date)
            workshopDate.setHours(0, 0, 0, 0) // 將時間設為午夜，僅比較日期部分
            const today = new Date()
            today.setHours(0, 0, 0, 0) // 當天午夜

            // 若日期在今日之前，則不顯示
            if (workshopDate < today) return null

            return (
              <TimeSelect
                key={timeId[index]}
                id={timeId[index]}
                date={date.replace(/-/g, '/')}
                beginTime={startTimes[index].slice(0, 5)} // 對應的開始時間
                endTime={endTimes[index].slice(0, 5)} // 對應的結束時間
                hours={calculateHours(startTimes[index], endTimes[index])} // 計算時數並傳遞
                registered={registered[index]}
                max={maxStudents[index]}
                disabled={
                  Number(registered[index]) >= Number(maxStudents[index])
                }
                onSelect={handleSelectTime}
              />
            )
          })}
        </div>

        <hr className="border-2 my-5" />

        <div className="d-flex justify-content-between align-items-end pb-2">
          <WorkshopAddCartInfo
            wid={tworkshop.id}
            // 要加這個我的收藏才能帶到id
            name={tworkshop.name}
            registrationStart={tworkshop.registration_start}
            registrationEnd={tworkshop.registration_end}
            price={tworkshop.price}
          />

          <div>
            <div className="mb-4 d-flex align-items-center justify-content-end">
              {/* <button
                className={`${styles.btnSm} ph`}
                onClick={() => handleDecrease(classTime[0].id)} // 修改為 onClick 並傳入第一項的 id 作範例
              >
                <PiMinus />
              </button>
              <span className="px-3 h6">
               <b>{classTime[0].count}</b> 範例顯示第一項的 count 值  
              </span>
              <button
                className={`${styles.btnSm} ph`}
                onClick={() => handleIncrease(classTime[0].id)} // 修改為 onClick 並傳入第一項的 id 作範例
              >
                <PiPlus />
              </button> */}
            </div>

            <div>
              <button
                className="btn-primary h6"
                onClick={() => handleAddToCart(false)}
              >
                <PiPlusCircle className="me-2 ph" />
                加入購物車
              </button>
              <button
                className="btn-secondary h6 ms-3"
                onClick={() => handleAddToCart(true)}
              >
                <PiHandbagSimple className="me-2 ph" />
                立即購買
              </button>
            </div>
          </div>
        </div>
      </div>
      <WorkshopDetailInfo
        teacher={tworkshop.teacher_name}
        bn={`http://localhost:3005/workshop/${tworkshop.img_lg}`}
        imgS01={`http://localhost:3005/workshop/${tworkshop.img_sm01}`}
        outline={tworkshop.outline}
        note={tworkshop.notes}
        imgS02={`http://localhost:3005/workshop/${tworkshop.img_sm02}`}
      />
      <Brands />
    </>
  )
}
