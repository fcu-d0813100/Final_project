import React from 'react'
import styles from './index.module.scss'
import Link from 'next/link'
export default function ClassAct(props) {
  return (
    <>
      <div
        className={`${styles.promobg} d-flex justify-content-center align-items-center`}
      >
        <svg
          className={`${styles['line-style']}`}
          xmlns="http://www.w3.org/2000/svg"
          width="9"
          height="575"
          viewBox="0 0 9 575"
          fill="none"
        >
          <path
            d="M0.524898 570.095C0.50239 572.304 2.27491 574.113 4.48394 574.135C6.69296 574.158 8.50197 572.385 8.52448 570.176C8.54699 567.967 6.77447 566.158 4.56545 566.136C2.35642 566.113 0.547407 567.886 0.524898 570.095ZM2.72559 0.0964731L3.77469 570.137L5.27469 570.134L4.22558 0.0937125L2.72559 0.0964731Z"
            fill="white"
          />
        </svg>
        <div className={`container ${styles['container-padding']}`}>
          <div
            className={`row d-flex justify-content-between align-items-center p-0 `}
          >
            <div
              className={`${styles['act-section']} col-xl-5 col-md-6 col-12 ${styles['class-area']}`}
            >
              <div className="row">
                <div className="col-12">
                  <h3
                    className={`${styles.h3} text-white ${styles['promo-title']} `}
                  >
                    <span className={`${styles.date} pe-2`}>12/02 - 12/19</span>
                    新班開課嘍！
                  </h3>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <p
                    className={`p ${styles.info} text-white ${styles['info-padding']} `}
                  >
                    Gina老師即將推出全新課程，主題為「攝影化妝」，這次的課程專為喜愛攝影的人士設計，不論你是初學者或是攝影愛好者，都能從中學到專業的攝影彩妝技巧。Gina
                    老師以其多年的專業經驗，結合實際案例，帶領你一步步掌握彩妝攝影的精髓，讓你的作品更加出彩，絕對不容錯過！
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <Link href="/workshop/detail/24">
                    <button className={`btn-success ${styles.h6} w-100`}>
                      立即報名
                    </button>
                  </Link>
                </div>
                <div className="col-6">
                  <Link href="/workshop">
                    <button className={`btn-outline ${styles.h6} w-100`}>
                      更多課程
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div
              className={`${styles['act-section']} col-xl-5 col-md-6 col-12`}
            >
              <div className="row">
                <div className="col-12">
                  <h3
                    className={`${styles.h3} text-white ${styles['info-padding']}  ${styles['promo-title']} `}
                  >
                    <span className={`${styles.date}`}>12/31 NARS</span>
                    彩妝快閃店開幕！
                  </h3>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <p
                    className={`${styles.p}  ${styles.info} ${styles['info-padding']} text-white`}
                  >
                    林口快閃店盛大開幕！這次的活動不僅帶來超值優惠特賣，讓你輕鬆入手心儀商品，還有機會與多位明星面對面互動，了解他們的美妝秘訣與使用心得。活動期間，提供免費的妝容諮詢與試妝服務，絕對是彩妝愛好者不容錯過的年度盛事！趕快來參加，讓自己煥然一新！
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <Link href="/activity">
                    <button className={`${styles.h6} btn-danger w-100`}>
                      活動資訊
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
