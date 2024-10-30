import React, { useEffect } from 'react';
import Header from '@/components/home/common/header';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.scss'; // 確保引入正確的樣式
import Link from 'next/link';
import Footer from '@/components/home/common/footer'

export default function Discount() {

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <>
      <Header />
      <div className={`container-sm ${styles.discountPage}`}>
        <div className={styles.nav}>
          <a className="text-decoration-none" href="#">首頁</a> / 優惠活動
        </div>

        <section className={styles["discount-group"]}>
          <Link className={styles.discount} href="/discount/nars2">
            <img className={styles.img} src='/discount/nars-discount2.svg' alt="NARS 優惠" />
          </Link>
          <Link className={styles.discount} href="/discount/nars">
            <img className={styles.img} src='/discount/nars-discount.svg' alt="NARS 優惠" />
          </Link>
          <Link className={styles.discount} href="/discount/ysl">
            <img className={styles.img} src='/discount/ysl-discount.svg' alt="YSL 優惠" />
          </Link>
          <Link className={styles.discount} href="/discount/bb">
            <img className={styles.img} src='/discount/bb-discount.svg' alt="BB 優惠" />
          </Link>
        </section>

        <div id="carouselExampleIndicators" className={`${styles.phoneSize} carousel slide`} data-bs-ride="carousel">
          <div className={`carousel-indicators `}>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className={`active indicator ${styles.btn}`} aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" className={`indicator ${styles.btn}`} aria-label="Slide 2" />
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" className={`indicator ${styles.btn}`} aria-label="Slide 3" />
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" className={`indicator ${styles.btn}`} aria-label="Slide 4" />
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" className={`indicator ${styles.btn}`} aria-label="Slide 5" />
          </div>
          <div className='carousel-inner'>
            <div className="carousel-item active">
              <Link className={styles.discount} href="/discount/nars2">
                <Image src="/discount/phone-size/beautique.svg"
                  width={390}
                  height={442}
                  style={{ width: '100%', height: 'auto' }}
                  className="d-block "
                  alt="Beautique 優惠" />
              </Link>
            </div>

            <div className="carousel-item">
              <Link className={styles.discount} href="/discount/nars2">
                <Image src="/discount/phone-size/nars.svg"
                  width={390}
                  height={442}
                  style={{ width: '100%', height: 'auto' }}
                  className="d-block "
                  alt="NARS 優惠" />
              </Link>
            </div>
            <div className="carousel-item">
              <Link className={styles.discount} href="/discount/nars">
                <Image src="/discount/phone-size/nars1.svg"
                  width={390} height={442}
                  style={{ width: '100%', height: 'auto' }}
                  className="d-block "
                  alt="NARS 優惠 1" />
              </Link>
            </div>
            <div className="carousel-item">
              <Link className={styles.discount} href="/discount/ysl">
                <Image src="/discount/phone-size/ysl.svg"
                  width={390}
                  height={442}
                  style={{ width: '100%', height: 'auto' }}
                  className="d-block"
                  alt="YSL 優惠" />
              </Link>
            </div>
            <div className="carousel-item">
              <Link className={styles.discount} href="/discount/bb">
                <Image src="/discount/phone-size/bb.svg"
                  width={390}
                  height={442}
                  style={{ width: '100%', height: 'auto' }}
                  className="d-block"
                  alt="BB 優惠" />
              </Link>
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
