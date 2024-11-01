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
    async function getWorkshop() {
      try {
        let response = await axios.get(`http://localhost:3005/api/workshop`, {
          withCredentials: true,
        })
        const data = await response.json()
        setWorkshop(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    getWorkshop()
  }, [])

  return (
    <>
      <TopBar />
      <WorkshopsBN />

      <WorkshopSelectbar />

      <div className={`${styles.section03} container`}>
        <div className={`${styles.tOwnWorkshops} row row-cols-3 my-5`}>
          {/* <WorkshopCardLg
            key={1}
            imgCover="/workshop/workshop_img/1-1-c.jpg"
            name="F19時尚攝影妝容班"
            teacher="Terry Barber 老師"
            beginDate="2024/09/30"
            endDate="2024/10/30"
            price="3200"
            status="已截止"
          />

          <WorkshopCardLg
            key={2}
            imgCover="/workshop/workshop_img/1-2-c.jpg"
            name="F20時尚攝影妝容班"
            teacher="Terry Barber 老師"
            beginDate="2024/09/30"
            endDate="2024/10/30"
            price="3200"
            status="報名中"
          /> */}

          {/* <WorkshopCardLg
            key={workshop.id}
            imgCover="/workshop/workshop_img/1-2-c.jpg"
            name={workshop.name}
            teacher="Terry Barber 老師"
            beginDate="2024/09/30"
            endDate="2024/10/30"
            price={workshop.price}
            status="報名中"
          /> */}

          {Workshop.map((item) => (
            <WorkshopCardLg
              key={item.id}
              imgCover="/workshop/workshop_img/1-2-c.jpg"
              name={item.name}
              teacher="Terry Barber 老師"
              beginDate="2024/09/30"
              endDate="2024/10/30"
              price={item.price}
              status="報名中"
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}
