import React, { useState, useEffect, useContext } from 'react'
import style from './cart-list.module.scss'
import { Minus, Plus, Trash } from '@phosphor-icons/react'
import CheckoutBox from '@/components/cart/common/checkoutbox/index'
import { useCartProduct } from '@/hooks/use-cartP'
import { useCartWorkshop } from '@/hooks/use-cartW'
import Image from 'next/image'
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast'
import ToastSuccess from '@/components/shared/toast-success/index'
import { useAuth } from '@/hooks/use-auth'
import Confrim from '@/components/shared/modal-delete/index'

export default function CartList() {
  //----------吐司訊息
  const { add } = ToastSuccess({
    message: '新增商品',
    functionName: 'add',
  })

  const { del } = ToastSuccess({
    message: '刪除商品',
    functionName: 'del',
  })

  //---------刪除商品的彈窗訊息
  // 商品部分
  const [showProductModal, setShowProductModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  const handleDeleteConfirmP = () => {
    if (productToDelete) {
      onRemoveProduct(productToDelete.product_id, productToDelete.color)
    }
    setProductToDelete(null)
    setShowProductModal(false)
  }

  // 課程部分
  const [showWorkshopModal, setShowWorkshopModal] = useState(false)
  const [workshopToDelete, setWorkshopToDelete] = useState(null)

  const handleDeleteConfirmW = () => {
    if (workshopToDelete) {
      onRemoveWorkshop(workshopToDelete.id)
    }
    setWorkshopToDelete(null)
    setShowWorkshopModal(false)
  }
  //-----------按鈕路由
  const router = useRouter()

  // 從use-cartP鉤子取得商品內容
  const {
    productItems = [],
    pTotalPrice = 0,
    pOriginalTotalPrice = 0,
    onIncreaseProduct = () => {},
    onDecreaseProduct = () => {},
    onRemoveProduct = () => {},
    coupons,
    selectedCoupon,
  } = useCartProduct()

  // 從use-cartW鉤子取得課程內容
  const {
    workshopItems = [],
    wTotalPrice = 0,
    onIncreaseWorkshop = () => {},
    onDecreaseWorkshop = () => {},
    onRemoveWorkshop = () => {},
    onClearWorkshop = () => {},
  } = useCartWorkshop()
  //課程打95折價格
  const discountedWTotalPrice = Math.floor(wTotalPrice * 0.95)

  //-------------判斷是否有商品，否則隱藏
  const [showProductBox, setShowProductBox] = useState(false)
  const [showWorkshopBox, setShowWorkshopBox] = useState(false)
  useEffect(() => {
    const productCart = JSON.parse(localStorage.getItem('productCart'))
    setShowProductBox(Array.isArray(productCart) && productCart.length > 0)
    const Workshopcart = JSON.parse(localStorage.getItem('Workshopcart'))
    setShowWorkshopBox(Array.isArray(Workshopcart) && Workshopcart.length > 0)
  }, [])

  // console.log(coupons)
  let discountValue

  if (selectedCoupon) {
    if (selectedCoupon.discount_value <= 1) {
      discountValue = selectedCoupon.discount_value // 折扣比例
    } else if (selectedCoupon.discount_value > 1) {
      discountValue = selectedCoupon.discount_value // 折扣金額
    }
  }

  // console.log(discountValue)

  return (
    <>
      {/* 彈窗訊息 */}
      {showProductModal && (
        <Confrim
          title="移除商品"
          content={`您即將移除此商品，操作無法復原。\n確定要執行此操作嗎？`}
          btnConfirm="確定刪除"
          btnCancel="取消"
          ConfirmFn={handleDeleteConfirmP}
          show={showProductModal}
          handleClose={() => setShowProductModal(false)}
        />
      )}
      {showWorkshopModal && (
        <Confrim
          title="移除課程"
          content="您即將移除此課程，操作無法復原。確定要執行此操作嗎？"
          btnConfirm="確定刪除"
          btnCancel="取消"
          ConfirmFn={handleDeleteConfirmW}
          show={showWorkshopModal}
          handleClose={() => setShowWorkshopModal(false)}
        />
      )}

      <div className="container">
        <div className="row">
          {/* 步驟 */}
          <div className={style.step}>
            <Image
              src="/cart/step1.svg"
              alt="Step1"
              width={1400}
              height={500}
              className="img-fluid d-none d-md-block"
            />
            <Image
              src="/cart/RWDstep.1.svg"
              alt="Step1"
              width={200}
              height={400}
              className="img-fluid d-md-none -block"
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
                    <div
                      key={product.color_id}
                      className={style['cosmetic-box']}
                    >
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
                          {/* 如果有折扣，顯示提示文字 */}
                          {selectedCoupon &&
                            selectedCoupon.discount_value <= 1 && (
                              <div className="ps text-danger">
                                再享受 {selectedCoupon.discount_value * 100}%
                                折扣
                              </div>
                            )}
                          <div className={style.brand}>{product.brand}</div>
                          <div className={`h6 mb-1 ${style['product-name']}`}>
                            {product.product_name}
                          </div>
                          <div className={style['sub_text']}>
                            顏色：{product.color_name}
                          </div>
                        </div>
                      </div>
                      <div className={style.rwdphone}>
                        {/* 數量加減按鈕 */}
                        <div className="d-flex align-items-center justify-content-end">
                          <button
                            className={style['btn-sm']}
                            onClick={() => {
                              const nextPqty = product.qty - 1
                              if (nextPqty >= 1) del()
                              if (nextPqty <= 0) {
                                setProductToDelete(product)
                                setShowProductModal(true)
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
                          <span className={style.btntext}>{product.qty}</span>
                          <button
                            className={style['btn-sm']}
                            onClick={() => {
                              onIncreaseProduct(
                                product.product_id,
                                product.color
                              )
                              add()
                            }}
                          >
                            <Plus size={20} />
                          </button>
                          <Toaster position="top-center" reverseOrder={true} />
                        </div>

                        {/* 商品價格 */}
                        <div className={`h6 ${style.price}`}>
                          NT$
                          {selectedCoupon
                            ? selectedCoupon.discount_value <= 1
                              ? Math.floor(
                                  product.price * product.qty * discountValue
                                ).toLocaleString()
                              : Math.floor(
                                  product.price * product.qty
                                ).toLocaleString()
                            : Math.floor(
                                product.price * product.qty
                              ).toLocaleString()}
                          <div className={style['origin_price']}>
                            NT$
                            {(
                              product.originalprice * product.qty
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      {/* 垃圾桶按鈕 */}
                      <div className={style.trash}>
                        <button
                          type="button"
                          onClick={() => {
                            setProductToDelete(product)
                            setShowProductModal(true)
                          }}
                        >
                          <Trash size={20} className="d-md-none" />
                          <Trash size={28} className="d-none d-md-block" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className={style['cosmetic_amount']}>
                    {selectedCoupon && selectedCoupon.discount_value <= 1 && (
                      <div className="ps text-danger">
                        再享受 {selectedCoupon.discount_value * 100}% 折扣
                      </div>
                    )}
                    {selectedCoupon && selectedCoupon.discount_value > 1 && (
                      <div className="ps text-danger">
                        再享受 -NT${selectedCoupon.discount_value}元折扣
                      </div>
                    )}
                    {/* 如果有優惠券，顯示折扣提示文字 */}
                    <span className={style['title']}> 商品小計：</span>
                    <span className={style['origin-price']}>
                      NT${pOriginalTotalPrice.toLocaleString()}
                    </span>
                    {/* 判斷是否有優惠券，顯示折扣後的價格 */}
                    <span className={style['discount-price']}>
                      NT$
                      {selectedCoupon
                        ? selectedCoupon.discount_value <= 1
                          ? Math.floor(
                              pTotalPrice * discountValue
                            ).toLocaleString()
                          : (pTotalPrice - discountValue).toLocaleString()
                        : pTotalPrice.toLocaleString()}
                    </span>
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
                            src={`http://localhost:3005/workshop/${workshop.cover}`}
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
                          <div className={`h6 mb-1 ${style['product-name']}`}>
                            {workshop.name}
                          </div>
                          <div className={`${style['sub_text']}`}>
                            {workshop.date}
                            <span className={`ms-2  ${style['sub_text']}`}>
                              {workshop.beginTime}-{workshop.endTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={style.rwdphone}>
                        {/* 數量加減按鈕 */}
                        <div className="d-flex align-items-center justify-content-end">
                          <button
                            className={style['btn-sm']}
                            onClick={() => {
                              const nextWqty = workshop.qty - 1
                              if (nextWqty >= 1) del()
                              if (nextWqty <= 0) {
                                setWorkshopToDelete(workshop)
                                setShowWorkshopModal(true) // 顯示課程刪除彈窗
                              } else {
                                onDecreaseWorkshop(workshop.id)
                              }
                            }}
                          >
                            <Minus size={20} />
                          </button>
                          <span className={style.btntext}>{workshop.qty}</span>
                          <button
                            className={style['btn-sm']}
                            onClick={() => {
                              onIncreaseWorkshop(workshop.id)
                              add()
                            }}
                          >
                            <Plus size={20} />
                          </button>
                        </div>

                        {/* 課程價格 */}
                        <div className={`h6 ${style.price}`}>
                          NT$
                          {Math.floor(
                            workshop.price * workshop.qty * 0.95
                          ).toLocaleString()}
                          <div className={style['origin_price']}>
                            NT$
                            {(workshop.price * workshop.qty).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className={style.trash}>
                        <button
                          type="button"
                          className={style.trash}
                          onClick={() => {
                            setWorkshopToDelete(workshop)
                            setShowWorkshopModal(true)
                          }}
                        >
                          <Trash size={20} className="d-md-none" />
                          <Trash size={28} className="d-none d-md-block" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className={style['course_amount']}>
                    商品小計：
                    <span>NT${wTotalPrice.toLocaleString()}</span>
                    <span>NT${discountedWTotalPrice.toLocaleString()}</span>
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
                  className={` justify-content-between d-xl-flex ${style['checkout_btn']}`}
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
