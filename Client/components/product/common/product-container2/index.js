import React, { useState } from 'react'
import Slider from 'react-slick'
import styles from './index.module.scss'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import cardStyles from './CardCarousel.module.scss'
import Image from 'next/image'
import { PiHeartStraight, PiHeartStraightFill } from 'react-icons/pi'

const PrevArrow = ({ onClick }) => (
  <div
    className={`${cardStyles.prevArrow}`}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick()
      }
    }}
    aria-label="Previous Slide"
  >
    &#8249;
  </div>
)

const NextArrow = ({ onClick }) => (
  <div
    className={`${cardStyles.nextArrow}`}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick()
      }
    }}
    aria-label="Next Slide"
  >
    &#8250;
  </div>
)

const CardCarousel2 = ({ products }) => {
  const [favorites, setFavorites] = useState({})

  const handleFavoriteClick = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: {
        liked: !prev[id]?.liked,
        count: prev[id]?.liked
          ? prev[id].count - 1
          : (prev[id]?.count || 0) + 1,
      },
    }))
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 2200,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1440, settings: { slidesToShow: 4, slidesToScroll: 4 } },
      { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 390, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  }

  return (
    <div
      className={`${styles['homepage-products-container2']} ${cardStyles.container}`}
    >
      <div className={styles['row']}>
        <div className={styles['product-title1']}>
          <span className={`${styles['new-arrivalc']} h3`}>最佳人氣</span>
          <span className={`${styles['new-arrival']} h2-L`}>Most Popular</span>
        </div>
        <Slider
          {...settings}
          className={`${styles['product-card-container2']} ${cardStyles['d-flex']}`}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className={`${styles['product-card-w']} ${cardStyles['product-card-w']} text-center`}
            >
              <div className={styles['info']}>
                <div className={`${styles['product-new-w']} h5-L`}>
                  NO.{product.id}
                </div>
              </div>
              <div
                className={` ${styles['add']} d-flex`}
                onClick={() => handleFavoriteClick(product.id)}
              >
                {favorites[product.id]?.liked ? (
                  <PiHeartStraightFill size={22} fill="#963827" />
                ) : (
                  <PiHeartStraight size={22} />
                )}
                <span className="p" style={{ color: '#963827' }}>
                  {favorites[product.id]?.count || 0}
                </span>
              </div>
              <Image
                width={200}
                height={200}
                src={product.imageUrl}
                className={styles['product-cardimg-w']}
                alt={product.name}
              />
              <div className={styles['product-cardbody-w']}>
                <h5 className={`${styles['product-cardtitle-w']} p`}>
                  {product.brand}
                </h5>
                <h5 className={`${styles['product-cardtitle-w']} p`}>
                  {product.name}
                </h5>
                <span className={`${styles['product-price-w']} h5`}>
                  <del style={{ color: '#90957a' }} className="h6-del">
                    NT${product.originalPrice}
                  </del>{' '}
                  NT${product.salePrice}
                </span>
                <div
                  className={`${styles['product-colorsquares-w']} product-colorsquares-w`}
                >
                  <div
                    className={`${styles['product-colorbox-w']} product-colorbox-w`}
                    style={{ backgroundColor: product.color }}
                  ></div>
                </div>
                <button className={`${styles['add-to-cart']} p btn-primary`}>
                  加入購物車
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default CardCarousel2
