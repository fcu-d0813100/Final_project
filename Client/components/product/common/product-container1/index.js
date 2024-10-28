// components/CardCarousel.js
import React from 'react';
import Slider from 'react-slick';
import styles from './index.module.scss'; // 引入你的 SCSS 模組
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import cardStyles from './CardCarousel.module.scss'; // 引入 CSS 模組


// 自定義上一頁箭頭
const PrevArrow = ({ onClick }) => (
  <div className={`${cardStyles.prevArrow}`} onClick={onClick}>
    &#8249;
  </div>
);

// 自定義下一頁箭頭
const NextArrow = ({ onClick }) => (
  <div className={`${cardStyles.nextArrow}`} onClick={onClick}>
    &#8250;
  </div>
);

const CardCarousel = ({ products }) => {
  const settings = {
    infinite: true, // 無限滾動
    speed: 500, // 切換速度（毫秒）
    slidesToShow: 4, // 每次顯示4個卡片
    slidesToScroll: 4, // 每次滾動4個卡片
    autoplay: true, // 啟用自動播放
    autoplaySpeed: 2200, // 自動播放速度（毫秒）
    pauseOnHover: true, // 滑鼠懸停時暫停自動播放
    nextArrow: <NextArrow />, // 自定義下一頁箭頭
    prevArrow: <PrevArrow />, // 自定義上一頁箭頭
    responsive: [
      {
        breakpoint: 1440, // 小於 1440px 時顯示 4 個卡片
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 1200, // 小於 1200px 時顯示 3 個卡片
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 992, // 小於 992px 時顯示 2 個卡片
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768, // 小於 768px 時顯示 1 個卡片
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 576, // 小於 576px 時顯示 1 個卡片
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 390, // 小於 390px 時顯示 1 個卡片
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    
    <div className={`${styles['homepage-products-container1']} ${cardStyles.container} `}>
      <div className={styles['row']}>
        <div className={styles['product-title1']}>
          <span className={`${styles['new-arrivalc']} h3`}>新品上市</span>
          <span className={`${styles['new-arrival']} h2-L`}>New Arrival</span>
        </div>
        {/* 使用 Slider 元件來包裹你的產品列表 */}
        <Slider {...settings} className={`${styles['product-card-container1']} ${cardStyles['d-flex']}`}>
          {products.map((product, index) => (
            <div key={index} className={`${styles['product-card-w']} col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 text-center`}>
              <div className={styles['info']}>
                <div className={`${styles['product-new-w']} d-inline-block ps`}>NEW</div>
                <div className={`${styles['product-sale-w']} d-inline-block ps`}>SALE</div>
                <div className={styles['product-discount-w']}>89<span>折</span></div>
              </div>
              <i className="fa-regular fa-heart">
                <FontAwesomeIcon icon={faRegularHeart} />
              </i>
              <img
                src={product.imageUrl}
                className={styles['product-cardimg-w']}
                alt={product.name}
              />
              <div className={styles['product-cardbody-w']}>
                <h5 className={`${styles['product-cardtitle-w product-cardtitle-mobile']} p`}>{product.brand}</h5>
                <h5 className={`${styles['product-cardtitle-w']} p`}>{product.name}</h5>
                <span className={`${styles['product-price-w']} h5`}>
                  <del style={{ color: '#90957a' }} className="h6-del">
                    NT${product.originalPrice}
                  </del> NT${product.salePrice}
                </span>
                <br />
                <div className={`${styles['product-colorsquares-w']} product-colorsquares-w`}>
                  <div
                    className={`${styles['product-colorbox-w']} product-colorbox-w`}
                    style={{ backgroundColor: product.color }}
                  ></div>
                </div>
                <button className={`${styles['add-to-cart']} p btn-primary`}>加入購物車</button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CardCarousel;
