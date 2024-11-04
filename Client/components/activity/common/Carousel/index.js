import React, { useState, useEffect } from 'react'
import Styles from '@/components/activity/page/activity-det/index.module.scss'
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'

export default function Carousel({ cardsData = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const updateCarousel = (index) => {
    setCurrentIndex(index)
  }

  const nextCard = () => {
    setCurrentIndex((currentIndex + 1) % cardsData.length)
  }

  const prevCard = () => {
    setCurrentIndex((currentIndex - 1 + cardsData.length) % cardsData.length)
  }

  useEffect(() => {
    updateCarousel(currentIndex)
  }, [currentIndex])

  return (
    <div className={`${Styles['activity-carousel-text']} container`}>
      <h2 className={Styles['section-title']}>相關活動</h2>
      <div className={Styles['activity-name']}>
        <h3 id="activityTitle">{cardsData[currentIndex].title}</h3>
        <p id="activitySubtitle">{cardsData[currentIndex].subtitle}</p>
      </div>

      <div className={`${Styles['btngrp']} d-flex justify-content-between `}>
        <button id="prev" onClick={prevCard} className={Styles['navButton']}>
          <BsChevronLeft />
        </button>
        <button id="next" onClick={nextCard} className={Styles['navButton']}>
          <BsChevronRight />
        </button>
      </div>

      <div className={Styles['activity-carousel']}>
        {cardsData.map((card, index) => (
          <div
            key={index}
            className={`${Styles['cardLeft']} ${
              index === currentIndex
                ? Styles['active']
                : index === (currentIndex + 1) % cardsData.length
                ? Styles['right']
                : index ===
                  (currentIndex - 1 + cardsData.length) % cardsData.length
                ? Styles['left']
                : ''
            }`}
            style={{
              transform:
                index === currentIndex
                  ? index === 0
                    ? 'translateX(40%)'
                    : index === 1
                    ? 'translateX(0)'
                    : 'translateX(-40%)'
                  : index === (currentIndex + 1) % cardsData.length
                  ? 'translateX(300%)'
                  : 'translateX(-350%)',
            }}
          >
            <div className={Styles['cardL']}>
              <a href="#">
                <div className={Styles['card-img']}>
                  <img src={card.imgSrc} alt="Image" />
                </div>
              </a>
              <div className={Styles['card-content']}>
                <div className={Styles['card-date']}>{card.date}</div>
                <div className={Styles['card-info']}>
                  <p className={Styles['title']}>主辦單位 | host</p>
                  <p>{card.host}</p>
                  <p className={Styles['title']}>活動地點 | location</p>
                  <p>{card.location}</p>
                </div>
                <div className={Styles['card-footer']}>
                  <div className={Styles['badge']}>{card.attendees}</div>
                  <div className={Styles['status']}>{card.status}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
