import React, { useState, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import styles from './actCarousel.module.scss'
import Image from 'next/image'

const ProductCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef(null)

  const images = [
    { src: '/activity/YSL4_1.png', alt: 'Image 1' },
    { src: '/activity/YSL2_1.png', alt: 'Image 2' },
    { src: '/activity/YSL3_1.png', alt: 'Image 4' },
  ]

  const goToSlide = (index) => {
    if (swiperRef.current) swiperRef.current.slideTo(index)
    setActiveIndex(index)
  }

  // 自動播放功能
  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current) {
        swiperRef.current.slideNext()
      }
    }, 3000) // 每 3 秒切換一次

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles['carousel-container']}>
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        slidesPerView={1}
        loop={true}
        className={styles['swiper-container']}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className={styles['swiper-slide']}>
            <Image
              width={1920}
              height={700}
              src={image.src}
              alt={image.alt}
              className={styles['carousel-image']}
              priority={index === 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 自定義的分頁圓點 */}
      <div className={styles['pagination-dots']}>
        {images.map((_, index) => (
          <button
            key={index}
            className={index === activeIndex ? styles['active-dot'] : ''}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  )
}

export default ProductCarousel
