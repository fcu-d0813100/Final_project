import React, { useState, useEffect, useContext } from 'react'
import style from './cart-list.module.scss'
import { Minus, Plus, Trash } from '@phosphor-icons/react'
import CheckoutBox from '@/components/cart/common/checkoutbox/index'
import { useCartProduct } from '@/hooks/use-cartP'
import { useCartWorkshop } from '@/hooks/use-cartW'
import Image from 'next/image'
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '@/hooks/use-auth'

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

  //-------------判斷是否有商品，否則隱藏
  const [showProductBox, setShowProductBox] = useState(false)
  useEffect(() => {
    const productCart = JSON.parse(localStorage.getItem('productCart'))
    setShowProductBox(Array.isArray(productCart) && productCart.length > 0)
  }, [])

  //-------------判斷是否有商品，否則隱藏
  const [showWorkshopBox, setShowWorkshopBox] = useState(false)
  useEffect(() => {
    const Workshopcart = JSON.parse(localStorage.getItem('Workshopcart'))
    setShowWorkshopBox(Array.isArray(Workshopcart) && Workshopcart.length > 0)
  }, [])

  //-------------建立訂單

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
              {showProductBox && (
                <div className={`d-xl-block ${style.cosmetic}`}>
                  <div className={` h5 ${style['cosmetic-topic']}`}>
                    彩妝商品
                  </div>
                  {productItems.map((product) => (
                    <div key={product.id} className={style['cosmetic-box']}>
                      <div className={` col-6 ${style['cosmetic-detail']}`}>
                        <div className={style['cosmetic-img']}>
                          <Image
                            src={`/product/mainimage/${product.mainimage}`}
                            alt="cosmetic"
                            width={140}
                            height={140}
                          />
                        </div>
                        <div className={style['cosmetic-text']}>
                          <div className="ps">{product.brand}</div>
                          <div className="h6 mb-3">{product.product_name}</div>
                          <div className={style['sub_text']}>
                            顏色：{product.color_name}
                          </div>
                        </div>
                      </div>

                      {/* 數量加減按鈕 */}
                      <div className="d-flex align-items-center justify-content-end">
                        <button
                          className={style['btn-sm']}
                          onClick={() => {
                            const nextPqty = product.qty - 1
                            if (nextPqty >= 1) delPnotify()
                            if (nextPqty <= 0) {
                              if (confirm('你確定要移除此商品嗎？')) {
                                onRemoveProduct(
                                  product.product_id,
                                  product.color
                                )
                              }
                            } else {
                              onDecreaseProduct(
                                product.product_id,
                                product.color
                              )
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
                        NT$
                        {(product.price * product.qty).toLocaleString()}
                        <div className={style['origin_price']}>
                          NT$
                          {(
                            product.originalprice * product.qty
                          ).toLocaleString()}
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
                    <span>NT${pTotalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
              {/* 彩妝品box-end */}

              {/* 課程box */}
              {showWorkshopBox && (
                <div className={style.course}>
                  <div className={`h5 ${style['course-topic']}`}>課程報名</div>
                  {workshopItems.map((workshop) => (
                    <div key={workshop.id} className={style['course-box']}>
                      <div className={` col-6 ${style['course-detail']}`}>
                        <div className={style['course-img']}>
                          <Image
                            src={`/workshop/workshop_img/${workshop.typeId}-${workshop.id}-c.jpg`}
                            alt="cosmetic"
                            width={300}
                            height={300}
                            className="img-fluid"
                          />
                        </div>
                        <div className={style['course-text']}>
                          <div className={`ps mb-1 ${style['sub_text']}`}>
                            {workshop.teacher}
                          </div>
                          <div className="h6 mb-3">{workshop.name}</div>
                          <div className="ps">
                            {workshop.date}
                            <span className={`ms-2  ${style['sub_text']}`}>
                              {workshop.beginTime}-{workshop.endTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* 數量加減按鈕 */}
                      <div className="d-flex align-items-center justify-content-end">
                        <button
                          className={style['btn-sm']}
                          onClick={() => {
                            const nextWqty = workshop.qty - 1
                            if (nextWqty >= 1) delPnotify()
                            if (nextWqty <= 0) {
                              if (confirm('你確定要移除此商品嗎？')) {
                                onRemoveWorkshop(workshop.id)
                              }
                            } else {
                              onDecreaseWorkshop(workshop.id)
                            }
                          }}
                        >
                          <Minus size={20} />
                        </button>
                        <span className="px-3 h6">{workshop.qty}</span>
                        <button
                          className={style['btn-sm']}
                          onClick={() => {
                            onIncreaseWorkshop(workshop.id)
                            addPnotify()
                          }}
                        >
                          <Plus size={20} />
                        </button>
                      </div>

                      {/* 課程價格 */}
                      <div className={`h6 ${style.price}`}>
                        NT$
                        {(workshop.price * workshop.qty * 0.8).toLocaleString()}
                        <div className={style['origin_price']}>
                          NT$ {(workshop.price * workshop.qty).toLocaleString()}
                        </div>
                      </div>
                      <div className={style.trash}>
                        <button
                          type="button"
                          className={style.trash}
                          onClick={() => onRemoveWorkshop(workshop.id)}
                        >
                          <Trash size={28} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className={style['course_amount']}>
                    商品小計：{' '}
                    <span>NT${(wTotalPrice * 0.8).toLocaleString()}</span>
                  </div>
                </div>
              )}
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
                    onClick={() => router.push('/product/product-list')}
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
