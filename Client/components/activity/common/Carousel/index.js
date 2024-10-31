import React, { useState, useEffect } from 'react'
import Styles from '@/components/activity/page/activity-det/index.module.scss'
import Image from 'next/image' // 確保已導入 Image 組件
import { Heart } from 'phosphor-react'

export default function Carousel({ items = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % items.length)
  }

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + items.length) % items.length)
  }

  useEffect(() => {
    // 可以在這裡添加自動播放功能
  }, [])

  return (
    <div>
      <div className={Styles['activity-carousel']}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`${Styles['cardLeft']} ${
              index === currentIndex ? Styles['active'] : ''
            }`}
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`,
            }}
          >
            <div className={Styles['cardL']}>
              <a href="#">
                <div className={Styles['card-img']}>
                  <Image
                    src={item.image}
                    width={860}
                    height={500}
                    alt={item.title}
                  />
                </div>
              </a>
              <div className={Styles['card-content']}>
                <div className={Styles['card-date']}>{item.date}</div>
                <div className={Styles['card-info']}>
                  <p className="title">主辦單位 | host</p>
                  <p>{item.host}</p>
                  <p className="title">活動地點 | location</p>
                  <p>{item.location}</p>
                </div>
                <div className={Styles['card-footer']}>
                  <div className={Styles['badge']}>{item.people} 人</div>
                  <div className={Styles['status']}>報名中</div>
                  <Heart className={Styles['ph-heart']} size={24} color="red" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={`${Styles['btngrp']} d-flex justify-content-between`}>
        <button onClick={prevSlide}>Prev</button>
        <button onClick={nextSlide}>Next</button>
      </div>
    </div>
  )
}
