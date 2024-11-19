import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Styles from '@/components/activity/page/activity-det/index.module.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import FormToggle from '../../common/FormToggle'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import DetCarousel from '@/components/activity/common/DetCarousel'
import axios from 'axios'
import { useAuth } from '@/hooks/use-auth'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export default function ActivityDet() {
  const [activityData, setActivityData] = useState(null)
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 })
  const [cardsData, setCardsData] = useState([])
  const router = useRouter()
  const { id } = router.query

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  })
  const padZero = (num) => {
    return num > 0 && num < 10 ? `0${num}` : num
  }
  useEffect(() => {
    if (!id) return

    const fetchActivityData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/api/activity/id?id=${id}`
        )
        setActivityData(response.data)
      } catch (error) {
        console.error('無法獲取活動數據:', error)
      }
    }

    fetchActivityData()
  }, [id])

  useEffect(() => {
    const fetchTop3Activities = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3005/api/activity/top3'
        )
        const top3Activities = response.data.map((activity) => ({
          id: activity.id,
          title: activity.CHN_name,
          subtitle: activity.ENG_name,
          imgSrc: 'http://localhost:3005/upload/activity/' + activity.img1,
          date: `${activity.start_at} ~ ${activity.end_at}`,
          host: activity.brand,
          location: activity.address,
          attendees: `${activity.currentREG} 人`,
          status: activity.status === '0' ? '報名中' : '已截止',
        }))
        setCardsData(top3Activities)
      } catch (error) {
        console.error('無法獲取前三高活動數據:', error)
      }
    }

    fetchTop3Activities()
  }, [])

  useEffect(() => {
    if (activityData && activityData.address) {
      const geocodeAddress = async () => {
        const address = encodeURIComponent(activityData.address)
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_MAPS_API_KEY}`
        try {
          const response = await axios.get(geocodeUrl)
          const { lat, lng } = response.data.results[0].geometry.location
          setCoordinates({ lat, lng })
        } catch (error) {
          console.error('無法獲取座標:', error)
        }
      }

      geocodeAddress()
    }
  }, [activityData])

  if (!activityData) return <p>加載中...</p>
  if (!isLoaded) return <p>地圖加載中...</p>

  return (
    <>
      <div>
        <div className={Styles['act-img-container']}>
          <Image
            src={'http://localhost:3005/upload/activity/' + activityData.img1}
            width={1920}
            height={700}
            alt={activityData.CHN_name || '活動圖片'}
          />
        </div>
        <div className={`${Styles['sec1']} container `}>
          <p className={`${Styles['h1']} ${Styles['CHN_name']}`}>
            {activityData.CHN_name}
          </p>
          <p className={`${Styles['p']} ${Styles['ENG_name']}`}>
            {activityData.ENG_name}
          </p>
          <p className={Styles['textContent']}>{activityData.description}</p>
        </div>
        <div className={Styles['sec2']}>
          <Image
            src={'http://localhost:3005/upload/activity/' + activityData.img2}
            width={860}
            height={500}
            alt="活動圖片"
          />
          <Image
            src={'http://localhost:3005/upload/activity/' + activityData.img3}
            width={800}
            height={500}
            alt="活動圖片"
          />
        </div>
        <div className={`${Styles['sec3']} container d-flex flex-wrap`}>
          <div className={`${Styles['googleMap']} col-md-6`}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={coordinates}
              zoom={15}
            >
              <Marker position={coordinates} />
            </GoogleMap>
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
                <a
                  href={activityData.brand_mail}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {activityData.brand_mail || '暫無資訊'}
                </a>
              </p>
              <p>地點：{activityData.address || '暫無資訊'}</p>
            </div>
          </div>
        </div>
        <div className={Styles['sec4']} container>
          <div className={Styles['item']}>
            <p className={Styles['number']}>
              {padZero(activityData.currentREG)}
            </p>
            <p className={Styles['text']}>報名人數</p>
          </div>
          <div className={Styles['item']}>
            <p className={Styles['number']}>{padZero(activityData.maxREG)}</p>
            <p className={Styles['text']}>名額</p>
          </div>
          <div className={Styles['item']}>
            <p className={Styles['number']}>{padZero(activityData.views)}</p>
            <p className={Styles['text']}>瀏覽次數</p>
          </div>
        </div>
        <div className={Styles['sec5']}>
          <FormToggle
            ENG_name={activityData.ENG_name}
            CHN_name={activityData.CHN_name}
            start_at={activityData.start_at}
            end_at={activityData.end_at}
          />
          <DetCarousel cardsData={cardsData} />
        </div>
      </div>
    </>
  )
}
