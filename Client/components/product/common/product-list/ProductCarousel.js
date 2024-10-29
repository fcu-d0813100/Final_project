import React, { useState, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import styles from './ProductCarousel.module.scss'
import Image from 'next/image'

const ProductCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef(null)

  const images = [
    { src: '/product/S__18604034.jpg', alt: 'Image 1' },
    { src: '/product/Nars 商品 banner.png', alt: 'Image 2' },
    // { src: '/product/ysl.png', alt: 'Image 3' },
    { src: '/product/seasonsale.png', alt: 'Image 4' },
    // { src: '/product/周年慶.png', alt: 'Image 5' },
  ]

  const goToSlide = (index) => {
    if (swiperRef.current) swiperRef.current.slideTo(index)
    setActiveIndex(index)
  }

  // 自動播放功能
  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current) {
        const nextIndex = (activeIndex + 1) % images.length
        swiperRef.current.slideTo(nextIndex)
        setActiveIndex(nextIndex)
      }
    }, 3000) // 每 3 秒切換一次

    return () => clearInterval(interval)
  }, [activeIndex])

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
