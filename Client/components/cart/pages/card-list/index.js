import React, { useState, useEffect, useContext } from 'react'
import style from './cart-list.module.scss'
import { Minus, Plus, Trash } from '@phosphor-icons/react'
import CheckoutBox from '@/components/cart/common/checkoutbox/index'
import { useCartProduct } from '@/hooks/use-cartP'
import { useCartWorkshop } from '@/hooks/use-cartW'
import Image from 'next/image'
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast'

export default function CartList() {
  //----------吐司訊息
  //新增商品
  const addPnotify = () =>
    toast.success('新增1件商品', {
      style: {
        border: '1.2px solid #90957a',
        padding: '12px 40px',
        color: '#626553',
      },
      iconTheme: {
        primary: '#626553',
        secondary: '#fff',
      },
    })
  //刪除商品
  const delPnotify = () =>
    toast.success('刪除1件商品', {
      style: {
        border: '1.2px solid #963827',
        padding: '12px 40px',
        color: '#963827',
      },
      iconTheme: {
        primary: '#963827',
        secondary: '#fff',
      },
    })

  //-----------按鈕路由
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
                        <div className="ps">{product.brand_name}</div>
                        <div className="h6 mb-3">{product.product_name}</div>
                        <div className={style['sub_text']}>
                          顏色：{product.color}
                        </div>
                      </div>
                    </div>

                    {/* 數量加減按鈕 */}
                    <div className="d-flex align-items-center justify-content-end">
                      <button
                        className={style['btn-sm']}
                        onClick={() => {
                          const nextQty = product.qty - 1
                          if (nextQty > 1) delPnotify()
                          if (nextQty <= 0) {
                            if (confirm('你確定要移除此商品嗎？')) {
                              onRemoveProduct(product.product_id, product.color)
                            }
                          } else {
                            onDecreaseProduct(product.product_id, product.color)
                          }
                        }}
                      >
                        <Minus size={20} />
                      </button>
                      <span className="px-3 h6">{product.qty}</span>
                      <button
                        className={style['btn-sm']}
                        onClick={() => {
                          onIncreaseProduct(product.product_id, product.color)
                          addPnotify()
                        }}
                      >
                        <Plus size={20} />
                      </button>
                      <Toaster position="top-center" reverseOrder={true} />
                    </div>

                    {/* 商品價格 */}
                    <div className={`h6 ${style.price}`}>
                      NT${(product.price * product.qty * 0.8).toLocaleString()}
                      <div className={style['origin_price']}>
                        NT${(product.price * product.qty).toLocaleString()}
                      </div>
                    </div>
                    <div className={style.trash}>
                      <button
                        type="button"
                        onClick={() => {
                          onRemoveProduct(product.product_id, product.color)
                        }}
                      >
                        <Trash size={28} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className={style['cosmetic_amount']}>
                  商品小計：
                  <span>NT${(pTotalPrice * 0.8).toLocaleString()}</span>
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
