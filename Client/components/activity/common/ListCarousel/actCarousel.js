import React, { useState, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import styles from './actCarousel.module.scss'
import Image from 'next/image'
import Link from 'next/link'

const ProductCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef(null)
  const [images, setImages] = useState([])

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

  // Fetch top 3 activities data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/activity/top3')
        if (!response.ok) {
          throw new Error('網路回應不成功：' + response.status)
        }
        const data = await response.json()

        // 使用獲取的數據動態生成 images 陣列
        const newImages = data.map((item) => ({
          id: item.id,
          CHN_name: item.CHN_name,
          ENG_name: item.ENG_name,
          src: 'http://localhost:3005/upload/activity/' + item.img1,
          alt: `${item.CHN_name} Image 1`,
        }))

        setImages(newImages)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
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
            <Link href={`/activity/activity-det?id=${image.id}`}>
              <div className={styles['car-img']}>
                <Image
                  width={1920}
                  height={700}
                  src={image.src}
                  alt={image.alt}
                  className={styles['carousel-image']}
                  priority={index === 0}
                />
                {/* 遮罩層 */}
                <div className={styles['overlay']}>
                  <h2 className={styles['overlay-text']}>{image.CHN_name}</h2>
                  <div className={styles['separator']}></div>
                  <h2 className={styles['overlay-text']}>{image.ENG_name}</h2>
                </div>
              </div>
            </Link>
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
