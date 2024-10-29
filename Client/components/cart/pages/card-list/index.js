import React from 'react'
import style from './cart-list.module.scss'
import { Minus, Plus, Trash } from '@phosphor-icons/react'
import CheckoutBox from '@/components/cart/common/checkoutbox/index'
import Image from 'next/image'

export default function CartList() {
  const products = []
  return (
    <>
      <div className="container">
        <div className="row">
          {/* 步驟 */}
          <div className={style.step}>
            <Image
              src="/cart/step1.svg"
              alt="Step1"
              width={1400}
              height={300}
              className="img-fluid d-none d-lg-block"
            />
          </div>

          <div className={style.outer}>
            <div className={style.list}>
              {/* 彩妝品box */}
              <div className={`d-xl-block ${style.cosmetic}`}>
                <div className={` h5 ${style['cosmetic-topic']}`}>彩妝商品</div>
                <div className={style['cosmetic-box']}>
                  <div className={` col-6 ${style['cosmetic-detail']}`}>
                    <div className={style['cosmetic-img']}>
                      <Image
                        src="/cart/LANCOME_LG01_M_888.webp"
                        alt="cosmetic"
                        width={300}
                        height={300}
                        className="img-fluid"
                      />
                    </div>
                    <div className={style['cosmetic-text']}>
                      <div className="ps">LANCOME</div>
                      <div className="h6 mb-3">玲瓏巧思五色眼影盤</div>
                      <div className={style['sub_text']}>顏色：來杯摩卡01</div>
                    </div>
                  </div>
                  {/* 數量加減按鈕 */}
                  <div className="d-flex align-items-center justify-content-end">
                    <button className={style['btn-sm']}>
                      <Minus size={20} />
                    </button>
                    <span className="px-3 h6">1</span>
                    <button className={style['btn-sm']}>
                      <Plus size={20} />
                    </button>
                  </div>
                  {/* 商品價格 */}
                  <div className={`h6 ${style.price}`}>
                    NT900
                    <div className={style['origin_price']}>NT$1,200</div>
                  </div>
                  <div className={style.trash}>
                    <button type="button">
                      <Trash size={28} />
                    </button>
                  </div>
                </div>
                <div className={style['cosmetic_amount']}>
                  商品小計： <span>NT$1,200</span>
                </div>
              </div>
              {/* 彩妝品box-end */}

              {/* 課程box */}
              <div className={style.course}>
                <div className={`h5 ${style['course-topic']}`}>課程報名</div>
                <div className={style['course-box']}>
                  <div className={` col-6 ${style['course-detail']}`}>
                    <div className={style['course-img']}>
                      <Image
                        src="/cart/course01.png"
                        alt="cosmetic"
                        width={300}
                        height={300}
                        className="img-fluid"
                      />
                    </div>
                    <div className={style['course-text']}>
                      <div className={`ps mb-1 ${style['sub_text']}`}>
                        Terry Barber 老師
                      </div>
                      <div className="h6 mb-3">F19 時尚攝影彩妝班</div>
                      <div className="ps">
                        2024/10/3 (四)
                        <span className={`ms-2  ${style['sub_text']}`}>
                          9:00 - 12:00 | 3hr
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* 數量加減按鈕 */}
                  <div className="d-flex align-items-center justify-content-end">
                    <button className={style['btn-sm']}>
                      <Minus size={20} />
                    </button>
                    <span className="px-3 h6">1</span>
                    <button className={style['btn-sm']}>
                      <Plus size={20} />
                    </button>
                  </div>

                  {/* 課程價格 */}
                  <div className={`h6 ${style.price}`}>
                    NT900
                    <div className={style['origin_price']}>NT$1,200</div>
                  </div>
                  <div className={style.trash}>
                    <button type="button" className={style.trash}>
                      <Trash size={28} />
                    </button>
                  </div>
                </div>
                <div className={style['course_amount']}>
                  商品小計： <span>NT$1,200</span>
                </div>
              </div>
            </div>
            {/* 課程box-end */}

            {/* 總計box */}
            <div className={style.checkout}>
              <div className={style.sticky}>
                <CheckoutBox />
                <div
                  className={` justify-content-between d-xl-flex d-none ${style['checkout_btn']}`}
                >
                  <button className="btn-primary">繼續購物</button>
                  <button className="ms-2 btn-secondary">前往結賬</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
