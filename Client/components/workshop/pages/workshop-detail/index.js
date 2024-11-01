'use client'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useCartWorkshop } from '@/hooks/use-cartW'
import Footer from '@/components/home/common/footer'
import TopBar from '@/components/home/common/header'
import styles from '@/components/workshop/common/workshop-detail.module.scss'
import Image from 'next/image'
import WorkshopDetailHeader from '@/components/workshop/common/workshop-detail-header'
import TimeSelect from '@/components/workshop/common/time-select'
import WorkshopDetailInfo from '@/components/workshop/common/workshop-detail-info'
import WorkshopAddCartInfo from '@/components/workshop/common/workshop-addcart-info'
import { PiMinus, PiPlus, PiPlusCircle, PiHandbagSimple } from 'react-icons/pi'
import React, { useState, useEffect } from 'react'

export default function WorkshopDetail(props) {
  const router = useRouter()
  const [tworkshop, settWorkshop] = useState({})

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

  const [classTime, setClassTime] = useState()

  const handleIncrease = (classTimeId) => {
    const nextClassTime = classTime.map((v) =>
      v.id === classTimeId ? { ...v, count: v.count + 1 } : v
    )
    setClassTime(nextClassTime)
  }

  const handleDecrease = (classTimeId) => {
    const nextClassTime = classTime.map((v) =>
      v.id === classTimeId && v.count > 0 ? { ...v, count: v.count - 1 } : v
    )
    setClassTime(nextClassTime)
  }

    // 分割資料
  const dates = tworkshop.dates ? tworkshop.dates.split(',') : [];
  const startTimes = tworkshop.start_times ? tworkshop.start_times.split(',') : [];
  const endTimes = tworkshop.end_times ? tworkshop.end_times.split(',') : [];
  const timeId = tworkshop.time_id ? tworkshop.time_id.split(',') : []

  return (
    <>
      <TopBar />

      <WorkshopDetailHeader
        name={tworkshop.name}
        description={tworkshop.description}
        beginDate="2024/09/30"
        endDate="2024/10/20"
        address={tworkshop.address}
        type={tworkshop.workshop_type_type}
        teacher={tworkshop.teacher_name}
        cover={`/workshop/workshop_img/${tworkshop.workshop_type_id}-${tworkshop.id}-c.jpg`}
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
          {dates.map((date, index) => (
            <TimeSelect
              key={timeId[index]}
              date={date}
              beginTime={startTimes[index]} // 對應的開始時間
              endTime={endTimes[index]} // 對應的結束時間
            />
          ))}
        </div>

        {/* <TimeSelect
              key={item.workshop_time_id}
              date={item.date}
              beginTime={item.beginTime}
              endTime={item.endTime}
              hours={item.hours}
              min={item.min}
              max={item.max}
              disabled={item.disabled}></TimeSelect> */}

        <hr className="border-2 my-5" />

        <div className="d-flex justify-content-between align-items-end pb-2">
          <WorkshopAddCartInfo
            name={tworkshop.name}
            registrationStart={tworkshop.registration_start}
            registrationEnd={tworkshop.registration_end}
            price={tworkshop.price}
          />

          <div>
            <div className="mb-4 d-flex align-items-center justify-content-end">
              <button
                className={`${styles.btnSm} ph`}
                onClick={() => handleDecrease(classTime[0].id)} // 修改為 onClick 並傳入第一項的 id 作範例
              >
                <PiMinus />
              </button>
              <span className="px-3 h6">
                {/* <b>{classTime[0].count}</b> 範例顯示第一項的 count 值  */}
              </span>
              <button
                className={`${styles.btnSm} ph`}
                onClick={() => handleIncrease(classTime[0].id)} // 修改為 onClick 並傳入第一項的 id 作範例
              >
                <PiPlus />
              </button>
            </div>
            <div>
              <button className="btn-primary h6">
                <PiPlusCircle className="me-2 ph" />
                加入購物車
              </button>
              <button className="btn-secondary h6 ms-3">
                <PiHandbagSimple className="me-2 ph" />
                立即購買
              </button>
            </div>
          </div>
        </div>
      </div>
      <WorkshopDetailInfo
        bn={`/workshop/workshop_img/${tworkshop.workshop_type_id}-${tworkshop.id}-f.jpg`}
        imgS01={`/workshop/workshop_img/${tworkshop.workshop_type_id}-${tworkshop.id}-s-1.jpg`}
        outline={tworkshop.outline}
        note={tworkshop.notes}
        imgS02={`/workshop/workshop_img/${tworkshop.workshop_type_id}-${tworkshop.id}-s-2.jpg`}
      />
      <Footer />
    </>
  )
}
