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
  const [tworkshop, settWorkshop] = useState(null)

  const { workshopId } = router.query

  useEffect(() => {
    async function getworkshop() {
      if (workshopId) {
        const response = await axios.get(
          `http://localhost:3005/api/workshop/${wid}`,
          { withCredentials: true }
        )
        settWorkshop(response.data)
      }
    }
    getworkshop()
  }, [workshopId])

  // const fetchData = async (wid) => {
  //   try {
  //     const response = await fetch(`http://localhost:3005/api/workshop/${wid}`)
  //     if (!response.ok) {
  //       throw new Error('網路回應不成功：' + response.status)
  //     }
  //     const data = await response.json()
  //     settWorkshop(data)
  //     console.log(data)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  // 用useEffect監聽router.isReady變動
  useEffect(() => {
    if (router.isReady) {
      getworkshop(router.query.wid)
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

  return (
    <>
      <TopBar />
      <WorkshopDetailHeader
        name={item.name}
        description="時尚攝影彩妝班專注於培養學員掌握專業時尚彩妝與修容技巧，融合創意與流行元素，打造獨特的時尚造型。適合想進入時尚產業的學員，從基礎到高階全面提升。"
        beginDate="2024/09/30"
        endDate="2024/10/20"
        address="台北市大同區重慶北路三段43號2樓"
        type="時尚攝影類"
        teacher="Terry Barber"
        cover={`/workshop/workshop_img/${item.workshop_type_id}-${item.id}-c.jpg`}
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
          {/* <TimeSelect
              key={classTime.id}
              date={classTime.date}
              beginTime={classTime.beginTime}
              endTime={classTime.endTime}
              hours={classTime.hours}
              min={classTime.min}
              max={classTime.max}
              disabled={classTime.disabled}
              //isActive={selectedId === classTime.id} // 傳遞是否為選中的狀態
              //onSelect={() => handleSelectTime(classTime.id)} // 傳遞選擇函數
            /> */}
        </div>

        <hr className="border-2 my-5" />

        <div className="d-flex justify-content-between align-items-end pb-2">
          <WorkshopAddCartInfo
            name="F19時尚攝影彩妝班"
            registrationStart="2024/08/30"
            registrationEnd="2024/09/20"
            price="3200"
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
                {/* <b>{classTime[1].count}</b> 範例顯示第一項的 count 值 */}
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
        bn="/workshop/workshop_img/1-1-f.jpg"
        imgS01="/workshop/workshop_img/1-1-s-1.jpg"
        outline=" • 彩妝基礎：膚質分析、基礎底妝 
                  • 造型技巧：時尚彩妝趨勢、創意妝容設計。 
                  • 時尚色彩學：色彩趨勢、色彩搭配。 
                  • 實務操作：現場拍攝實習與專業彩妝應用。
                  • 作品集製作：打造個人風格，準備進入時尚產業。"
        note=" 
              ※ 若因個人因素無法前往，可轉讓資格給朋友，需於開課前七天通知，如未通知且當日未到者，不予補課及退費。   
              ※ 為確保上課品質，4人開班，若不足4人時另協調時段開班，於開課前五天通知學員。
              ※ 本課程提供上妝刷具，學員上課時需「自備」習慣保養品、彩妝品、其他上妝工具。"
        imgS02="/workshop/workshop_img/1-1-s-2.jpg"
      />

      <Footer />
    </>
  )
}
