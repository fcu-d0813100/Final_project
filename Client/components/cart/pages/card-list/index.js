import React, { useState, useEffect, useContext } from 'react'
import style from './cart-list.module.scss'
import { Minus, Plus, Trash } from '@phosphor-icons/react'
import CheckoutBox from '@/components/cart/common/checkoutbox/index'
import { useCartProduct } from '@/components/hooks/use-cartP'
import { useCartWorkshop } from '@/components/hooks/use-cartW'
import Image from 'next/image'
import { useRouter } from 'next/router'

const products = [
  {
    id: 1,
    brand: 'LANCOME',
    name: '玲瓏巧思五色眼影盤',
    color: '來杯摩卡01',
    image: '/cart/LANCOME_LG01_M_888.webp',
    price: 900,
    originalPrice: 1200,
    quantity: 1,
  },
  {
    id: 2,
    brand: 'DIOR',
    name: '魅惑變色潤唇膏',
    color: '玫瑰粉紅',
    image: '/cart/DIOR_LIP_PINK.webp',
    price: 1100,
    originalPrice: 1350,
    quantity: 2,
  },
]

export default function CartList() {
  //按鈕路由
  const router = useRouter()

  // 從use-cartP鉤子取得商品內容
  const {
    productItems = [],
    pTotalPrice = 0,
    pTotalQty = 0,
    onIncreaseProduct = () => {},
    onDecreaseProduct = () => {},
    onRemoveProduct = () => {},
  } = useCartProduct()

  // 從use-cartW鉤子取得課程內容
  const {
    workshopItems = [],
    wTotalPrice = 0,
    wTotalQty = 0,
    onIncreaseWorkshop = () => {},
    onDecreaseWorkshop = () => {},
    onRemoveWorkshop = () => {},
  } = useCartWorkshop()

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
              {/* 帶入資料 */}
              <div className={`d-xl-block ${style.cosmetic}`}>
                <div className={` h5 ${style['cosmetic-topic']}`}>彩妝商品</div>
                {productItems.map((product) => (
                  <div key={product.id} className={style['cosmetic-box']}>
                    <div className={` col-6 ${style['cosmetic-detail']}`}>
                      <div className={style['cosmetic-img']}>
                        <Image
                          src={product.image}
                          alt="cosmetic"
                          width={300}
                          height={300}
                          className="img-fluid"
                        />
                      </div>
                      <div className={style['cosmetic-text']}>
                        <div className="ps">{product.brand}</div>
                        <div className="h6 mb-3">{product.name}</div>
                        <div className={style['sub_text']}>
                          顏色：{product.color}
                        </div>
                      </div>
                    </div>

                    {/* 數量加減按鈕 */}
                    <div className="d-flex align-items-center justify-content-end">
                      <button
                        className={style['btn-sm']}
                        onClick={() => pQtyChange(product.id, -1)}
                      >
                        <Minus size={20} />
                      </button>
                      <span className="px-3 h6">{product.quantity}</span>
                      <button
                        className={style['btn-sm']}
                        onClick={() => pQtyChange(product.id, 1)}
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    {/* 商品價格 */}
                    <div className={`h6 ${style.price}`}>
                      NT${(product.price * product.quantity).toLocaleString()}
                      <div className={style['origin_price']}>
                        NT$
                        {(
                          product.originalPrice * product.quantity
                        ).toLocaleString()}
                      </div>
                    </div>
                    <div className={style.trash}>
                      <button type="button">
                        <Trash size={28} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className={style['cosmetic_amount']}>
                  商品小計：
                  <span>NT${}</span>
                </div>
              </div>
              {/* 彩妝品box-end */}

              {/* 課程box */}
              <div className={style.course}>
                <div className={`h5 ${style['course-topic']}`}>課程報名</div>
                {/* {workshops.map((workshop) => ( */}
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
                      <div className={`ps mb-1 ${style['sub_text']}`}>老師</div>
                      <div className="h6 mb-3"> 課程名</div>
                      <div className="ps">
                        天
                        <span className={`ms-2  ${style['sub_text']}`}>
                          時間
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* 數量加減按鈕 */}
                  <div className="d-flex align-items-center justify-content-end">
                    <button
                      className={style['btn-sm']}
                      onClick={() => wAmountChange(workshop.id, -1)}
                    >
                      <Minus size={20} />
                    </button>
                    <span className="px-3 h6"> 數量</span>
                    <button
                      className={style['btn-sm']}
                      onClick={() => wAmountChange(workshop.id, 1)}
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {/* 課程價格 */}
                  <div className={`h6 ${style.price}`}>
                    NT$金額
                    <div className={style['origin_price']}>NT$ 金額</div>
                  </div>
                  <div className={style.trash}>
                    <button type="button" className={style.trash}>
                      <Trash size={28} />
                    </button>
                  </div>
                </div>
                {/* ))} */}
                <div className={style['course_amount']}>
                  商品小計： <span>NT</span>
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
                  <button
                    className="btn-primary"
                    onClick={() => router.push('/')}
                  >
                    繼續購物
                  </button>
                  <button
                    className="ms-2 btn-secondary"
                    onClick={() => router.push('/cart/checkout')}
                  >
                    前往結賬
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
