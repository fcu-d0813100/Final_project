import React, { useState } from 'react'
import Slider from 'react-slick'
import styles from './index.module.scss'
import cardStyles from './CardCarousel.module.scss'
import { PiHeartStraight, PiHeartStraightFill } from 'react-icons/pi'
import Image from 'next/image'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useFavorite } from '@/hooks/use-favorite'
import toast from 'react-hot-toast'
import { useCartProduct } from '@/hooks/use-cartP'
import { useRouter } from 'next/router'

// 自定義上一頁箭頭
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

// 自定義下一頁箭頭
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

const CardCarousel = ({ products }) => {
  console.log(products)
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
      style: {
        border: '1.2px solid #626553',
        padding: '12px 40px',
        color: '#626553',
      },
      iconTheme: { primary: '#626553', secondary: '#fff' },
    })
  }

  const handleCardClick = (color_id) => {
    router.push(`/product/product-list/${color_id}`)
  }

  return (
    <div
      className={`${styles['homepage-products-container1']} ${cardStyles.container}`}
    >
      <div className={styles['row']}>
        <div className={styles['product-title1']}>
          <span className={`${styles['new-arrivalc']} h3`}>新品上市</span>
          <span className={`${styles['new-arrival']} h2-L`}>New Arrival</span>
        </div>
        {products.length > 0 && ( // 確保有內容再渲染，否則會渲染空內容
          <Slider
            {...settings}
            className={`${styles['product-card-container1']} ${cardStyles['d-flex']}`}
          >
            {products.map((product) => (
              <div
                key={product.color_id}
                onClick={() => handleCardClick(product.color_id)}
                className={`${styles['product-card-w']} col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 text-center`}
              >
                <div className={styles['info']}>
                  <div
                    className={`${styles['product-new-w']} d-inline-block ps`}
                  >
                    NEW
                  </div>
                  <div
                    className={`${styles['product-sale-w']} d-inline-block ps`}
                  >
                    SALE
                  </div>
                  <div className={styles['product-discount-w']}>
                    95<span>折</span>
                  </div>
                </div>

                {/* 愛心收藏按鈕 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('Product details:', product)
                    handleFavoriteClick(product)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                  }}
                >
                  {favoriteProducts[product.color_id] ? (
                    <PiHeartStraightFill color="#973929" size={24} />
                  ) : (
                    <PiHeartStraight size={24} />
                  )}
                </button>

                <Image
                  width={200}
                  height={200}
                  src={`/product/mainimage/${product.mainimage}`}
                  className={styles['product-cardimg-w']}
                  alt={product.product_name}
                />
                <div className={styles['product-cardbody-w']}>
                  <h5
                    className={`${styles['product-cardtitle-w product-cardtitle-mobile']} p`}
                  >
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
                  <br />
                  <div
                    className={`${styles['product-colorsquares-w']} product-colorsquares-w`}
                  >
                    <div
                      className={`${styles['product-colorbox-w']} product-colorbox-w`}
                      style={{ backgroundColor: product.color }}
                    ></div>
                  </div>
                  <button
                    className={`${styles['add-to-cart']} p btn-primary`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart(product)
                    }}
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

export default CardCarousel
