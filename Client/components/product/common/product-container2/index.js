import React, { useState } from 'react'
import Slider from 'react-slick'
import styles from './index.module.scss'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import cardStyles from './CardCarousel.module.scss'
import Image from 'next/image'
import { PiHeartStraight, PiHeartStraightFill } from 'react-icons/pi'
import { useFavorite } from '@/hooks/use-favorite'
import { useCartProduct } from '@/hooks/use-cartP' 
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

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
  const { favoriteProducts, handleFavoriteClick } = useFavorite()
  const { onAddProductMany } = useCartProduct()
  const router = useRouter()

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 2500,
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

  const handleAddToCart = (product) => {
    onAddProductMany(product)
    toast.success('已加入購物車', {
      style: { border: '1.2px solid #626553', padding: '12px 40px', color: '#626553' },
      iconTheme: { primary: '#626553', secondary: '#fff' },
    })
  }

  const handleCardClick = (color_id) => {
    router.push(`/product/product-list/${color_id}`);
  };

  return (
    <div className={`${styles['homepage-products-container2']} ${cardStyles.container}`}>
      <div className={styles['row']}>
        <div className={styles['product-title1']}>
          <span className={`${styles['new-arrivalc']} h3`}>最佳人氣</span>
          <span className={`${styles['new-arrival']} h2-L`}>Most Popular</span>
        </div>
        {products.length > 0 && (
          <Slider
            {...settings}
            className={`${styles['product-card-container2']} ${cardStyles['d-flex']}`}
          >
            {products.map((product, index) => (
              <div
                key={product.color_id}
                onClick={() => handleCardClick(product.color_id)}
                className={`${styles['product-card-w']} ${cardStyles['product-card-w']} text-center`}
              >
                <div className={styles['info']}>
                  <div className={`${styles['product-new-w']} h5-L`}>
                  NO.{index + 1}
                  </div>
                </div>
                <div
                  className={`${styles['add']} d-flex`}
                  onClick={() => handleFavoriteClick(product.color_id)}
                >
                  {favoriteProducts[product.color_id] ? (
                    <PiHeartStraightFill size={22} fill="#963827" />
                  ) : (
                    <PiHeartStraight size={22} />
                  )}
                  <span className="p" style={{ color: '#963827' }}>
                    {product.likes_count || 0}
                  </span>
                </div>
                <Image
                  width={200}
                  height={200}
                  src={`/product/mainimage/${product.mainimage}`}
                  className={styles['product-cardimg-w']}
                  alt={product.product_name}
                />
                <div className={styles['product-cardbody-w']}>
                  <h5 className={`${styles['product-cardtitle-w']} p`}>
                    {product.brand}
                  </h5>
                  <h5 className={`${styles['product-cardtitle-w']} p`}>
                    {product.product_name}
                  </h5>
                  <span className={`${styles['product-price-w']} h5`}>
                    <del style={{ color: '#90957a' }} className="h6-del">
                      NT${product.originalprice}
                    </del>{' '}
                    NT${product.price}
                  </span>
                  <div className={`${styles['product-colorsquares-w']}`}>
                    <div
                      className={`${styles['product-colorbox-w']}`}
                      style={{ backgroundColor: product.color }}
                    ></div>
                  </div>
                  <button
                    className={`${styles['add-to-cart']} p btn-primary`}
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                  >
                    加入購物車
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  )
}

export default CardCarousel2
