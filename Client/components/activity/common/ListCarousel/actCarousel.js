import React, { useState, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import styles from './actCarousel.module.scss'
import Image from 'next/image'

const ProductCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef(null)
  const [activity, setActive] = useState([])
  const [images, setImages] = useState([])
  const targetId = '1'
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/activity')
        if (!response.ok) {
          throw new Error('網路回應不成功：' + response.status)
        }
        const data = await response.json()
        setActive(data)
        console.log(data)

        // 定義所需的 activity_id 陣列
        const targetIds = [3, 5, 6] // 替換成你想要的 ID

        // 根據指定的 ID 過濾數據
        const filteredData = data.filter((item) => targetIds.includes(item.id))

        // 提取圖片並更新 images 狀態
        const newImages = filteredData.flatMap((item) => [
          {
            CHN_name: item.CHN_name,
            ENG_name: item.ENG_name,
            src: '/activity/' + item.img1,
            alt: `${item.CHN_name} Image 1`,
          },
        ])

        setImages(newImages)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  // const images = [
  //   { src: '/activity/YSL4_1.png', alt: 'Image 1' },
  //   { src: '/activity/YSL2_1.png', alt: 'Image 2' },
  //   { src: '/activity/YSL3_1.png', alt: 'Image 4' },
  // ]
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
