import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.scss'; // 確保引入正確的樣式
import Link from 'next/link';
import Carousels from '@/components/discount/common/carousels'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import ProductCarousel from '@/components/discount/common/product-carousels';

export default function Discount() {
  const images = [
    { src: '/discount/phone-size/beautique.svg', alt: 'Beautique 優惠', link: '/product/product-list' },
    { src: '/discount/phone-size/nars1.svg', alt: 'NARS 優惠 1', link: '/discount/nars' },
    { src: '/discount/phone-size/nars.svg', alt: 'NARS 優惠', link: '/discount/nars2' },
    { src: '/discount/phone-size/ysl.svg', alt: 'YSL 優惠', link: '/discount/ysl' },
    { src: '/discount/phone-size/bb.svg', alt: 'BB 優惠', link: '/discount/bb' },
  ];
  const settings = {
    dots: true, // 顯示指示器
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false, // 啟用自動播放
    autoplaySpeed: 3000,
    arrows: false, // 隱藏箭頭
  };

  return (
    <>
      <Carousels />
      <div className={styles.main}>
        <div className={`container-sm ${styles.discountPage}`}>
          <div className={styles.nav}>
            <Link href="/" className="text-decoration-none">
              首頁
            </Link> / 優惠活動
          </div>
          <section className={styles["discount-group"]}>
            <Link className={styles.discount} href="/discount/nars">
              <img className={styles.img} src='/discount/nars-discount.svg' alt="NARS 優惠" />
            </Link>
            <Link className={styles.discount} href="/discount/nars2">
              <img className={styles.img} src='/discount/nars-discount2.svg' alt="NARS 優惠" />
            </Link>
            <Link className={styles.discount} href="/discount/ysl">
              <img className={styles.img} src='/discount/ysl-discount.svg' alt="YSL 優惠" />
            </Link>
            <Link className={styles.discount} href="/discount/bb">
              <img className={styles.img} src='/discount/bb-discount.svg' alt="BB 優惠" />
            </Link>
          </section>

          <div className={`${styles.carouselContainer}`}>
            <Slider {...settings}>
              {images.map((image, idx) => (
                <div key={idx} className={styles.carouselItem}>
                  <Link href={image.link}>
                    <Image
                      src={image.src}
                      width={390}
                      height={442}
                      style={{ width: '100%', height: 'auto' }}
                      alt={image.alt}
                      className="d-block"
                    />
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className={`d-flex  justify-content-end ${styles.point}`}>
          <Link href={'/discount/game'}>
            <div className={`${styles.game}`}>
            </div>
          </Link>
        </div>
      </div>
      <ProductCarousel />
    </>
  );
}
