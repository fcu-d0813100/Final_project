import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Styles from '@/components/activity/page/activity-det/index.module.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import FormToggle from '../../common/FormToggle'
import axios from 'axios'

export default function ActivityDet() {
  const [activityData, setActivityData] = useState(null)
  const router = useRouter()
  const { id } = router.query // 從路由中取得 id 參數

  // 從 API 獲取活動詳細信息
  useEffect(() => {
    if (!id) return // 確保 id 存在後再執行

    const fetchActivityData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/api/activity/id?id=${id}`
        )
        setActivityData(response.data) // 設置活動詳細數據
      } catch (error) {
        console.error('無法獲取活動數據:', error)
      }
    }

    fetchActivityData()
  }, [id]) // id 變更時重新取得資料

  if (!activityData) return <p>加載中...</p>

  return (
    <>
      <div>
        <div className={Styles['act-img-container']}>
          <Image
            src={'/activity/' + activityData.img1}
            width={1920}
            height={700}
            alt={activityData.CHN_name || '活動圖片'}
          />
        </div>
        <div className={`${Styles['sec1']} container `}>
          <p className={`${Styles['h1']} ${Styles['CHN_name']}`}>
            {activityData.CHN_name}
          </p>
          <p className={Styles['p']}>{activityData.ENG_name}</p>
          <p className={Styles['textContent']}>{activityData.description}</p>
        </div>
        <div className={Styles['sec2']}>
          <Image
            src={'/activity/' + activityData.img2}
            width={860}
            height={500}
            alt="活動圖片"
          />
          <Image
            src={'/activity/' + activityData.img3}
            width={800}
            height={500}
            alt="活動圖片"
          />
        </div>
        <div className={`${Styles['sec3']} container d-flex flex-wrap`}>
          <div className={`${Styles['googleMap']} col-md-6`}>
            <Image
              src={'/activity/googleMap.png'}
              width={800}
              height={500}
              alt="google"
            />
          </div>
          <div className={`${Styles['info']} col-md-6`}>
            <div className={`${Styles['info-title']} d-flex`}>
              <p className={Styles['h4']}>活動資訊</p>
              <p
                className={Styles['h4-L']}
                style={{ color: 'rgba(144, 149, 122, 0.3)' }}
              >
                Information
              </p>
            </div>
            <div className={Styles['info-content']}>
              <p>電話：0978445961</p>
              <p>信箱：{activityData.ours_mail || '暫無資訊'}</p>
              <p>
                日期：{activityData.start_at} - {activityData.end_at}
              </p>
              <p>
                官網：
                <a href={activityData.brand_mail} target="_blank">
                  {activityData.brand_mail || '暫無資訊'}
                </a>
              </p>
              <p>地點：{activityData.address || '暫無資訊'}</p>
            </div>
          </div>
        </div>
        <div className={Styles['sec4']} container>
          <div className={Styles['item']}>
            <p className={Styles['number']}>{activityData.currentREG}</p>
            <p className={Styles['text']}>報名人數</p>
          </div>
          <div className={Styles['item']}>
            <p className={Styles['number']}>{activityData.maxREG}</p>
            <p className={Styles['text']}>名額</p>
          </div>
          <div className={Styles['item']}>
            <p className={Styles['number']}>{activityData.views}</p>
            <p className={Styles['text']}>瀏覽次數</p>
          </div>
        </div>
        <div className={Styles['sec5']}>
          <FormToggle />
        </div>
      </div>
    </>
  )
}
