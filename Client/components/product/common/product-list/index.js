// components/ProductPage.js
import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
// import Swiper from 'swiper/bundle'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/bundle'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FaChevronDown } from 'react-icons/fa'
import ProductCarousel from './ProductCarousel' // 引入新的轮播图组件
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import Image from 'next/image'

const ProductPage = () => {
  const products = [
    {
      id: 1,
      brand: 'YSL',
      name: '時尚印記唇釉',
      originalPrice: 2080,
      salePrice: 1580,
      imageUrl: '/product/NARS_ES01_M_ADULTS.webp',
      color: '#e3a790',
    },
    {
      id: 2,
      brand: 'NARS',
      name: '唇膏',
      originalPrice: 1900,
      salePrice: 1400,
      imageUrl: '/product/NARS_LS01_M_133.webp',
      color: '#732111',
    },
    {
      id: 3,
      brand: 'LANCOME',
      name: '絕對完美柔霧唇膏',
      originalPrice: 2500,
      salePrice: 2200,
      imageUrl: '/product/LANCOME_LS01_M_196.webp',
      color: '#8f352d',
    },
  ]

  // 狀態管理價格和品牌下拉菜單是否顯示
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false)
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState('價格')
  const [selectedBrand, setSelectedBrand] = useState('品牌')

  const handlePriceClick = (value) => {
    setSelectedPrice(value)
    setIsPriceDropdownOpen(false) // 選中後關閉菜單
  }

  const handleBrandClick = (value) => {
    setSelectedBrand(value)
    setIsBrandDropdownOpen(false) // 選中後關閉菜單
  }

  // 狀態管理收藏的商品
  const [favoriteProducts, setFavoriteProducts] = useState({})

  const handleFavoriteClick = (id) => {
    setFavoriteProducts((prevFavorites) => ({
      ...prevFavorites,
      [id]: !prevFavorites[id],
    }))
  }

  return (
    <div className={styles['container']}>
      {/* 頁面標題 */}
      <header>
        <div className={styles['hamburger-menu']}>
          <i className="fa-solid fa-bars"></i>
        </div>
      </header>

      {/* 輪播圖 */}
      <ProductCarousel />

      <div
        className={`${styles['product-container-w']} ${styles['container-sm']} container`}
      >
        <div className={`${styles['row']} ${styles['product-row-w']}`}>
          {/* 側邊欄區域 */}
          <aside className={`${styles['product-sidebar-w']} col-lg-2`}>
            <div className={styles['product-sidebarcontent-w']}>
              <ul>
                <li>
                  <a href="#">
                    <h4 style={{ color: '#90957a' }}>彩妝商城</h4>
                  </a>
                </li>
                <li>
                  <a href="#" className="p">
                    新品上市
                  </a>
                </li>
                <li>
                  <a href="#" className="p">
                    人氣商品
                  </a>
                </li>
                <li>
                  <a href="#" className="p">
                    優惠商品
                  </a>
                </li>
                <li>
                  <a href="#" className="p">
                    所有商品
                  </a>
                </li>
                <li>
                  <a href="#" className="p">
                    臉部
                  </a>
                </li>
                <li>
                  <a href="#" className="p">
                    雙頰
                  </a>
                </li>
                <li>
                  <a href="#" className="p">
                    唇部
                  </a>
                </li>
                <li>
                  <a href="#" className="p">
                    眼部
                  </a>
                </li>
                <li>
                  <a href="#" className="p">
                    眉部
                  </a>
                </li>
              </ul>
              {/* 價格選單 */}
              <div className={`${styles['product-selectwrapper-w']} ms-3`}>
                <div
                  className={styles['product-select-w']}
                  id="product-selectprice-w"
                >
                  <div className={styles['product-selecttrigger-w']}>
                    <span className="p">價格</span>
                    <FaChevronDown size={12} />
                  </div>
                  <div className={`${styles['product-selectoptions-w']} p`}>
                    <div
                      className={styles['product-selectoption-w']}
                      data-value="low"
                    >
                      NT$0 - NT$1000
                    </div>
                    <div
                      className={styles['product-selectoption-w']}
                      data-value="mid"
                    >
                      NT$1000 - NT$2000
                    </div>
                    <div
                      className={styles['product-selectoption-w']}
                      data-value="high"
                    >
                      NT$2000+
                    </div>
                  </div>
                </div>
              </div>

              {/* 品牌選單 */}
              <div className={`${styles['product-selectwrapper-w']} ms-3`}>
                <div
                  className={styles['product-select-w']}
                  id="product-selectbrand-w"
                >
                  <div className={styles['product-selecttrigger-w']}>
                    <span className="p">品牌</span>
                    <FaChevronDown size={12} />
                  </div>
                  <div className={`${styles['product-selectoptions-w']} p`}>
                    <div
                      className={styles['product-selectoption-w']}
                      data-value="ysl"
                    >
                      YSL
                    </div>
                    <div
                      className={styles['product-selectoption-w']}
                      data-value="nars"
                    >
                      NARS
                    </div>
                    <div
                      className={styles['product-selectoption-w']}
                      data-value="bobbi"
                    >
                      Bobbi Brown
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* 商品列表區域 */}
          <section className={`${styles['product-list-w']} ms-3 col-lg-10`}>
            {/* 商品列表頂部 */}
            <div
              className={`${styles['row']} justify-content-between align-items-center mb-5`}
            >
              {/* Breadcrumb */}
              <div className="col-lg-3 mb-3 mb-lg-0">
                <div className={`${styles['product-breadcrumb-w']} p`}>
                  首頁 / 彩妝商城 / 所有商品
                </div>
              </div>

              {/* 搜尋框 */}
              <div className="col-md-6 col-lg-4 mb-md-0">
                <div
                  className={`${styles['product-search-w']} d-flex align-items-center justify-content-center`}
                >
                  <input
                    type="text"
                    className="form-control p"
                    placeholder="找商品"
                  />
                  <i className="fa-solid fa-magnifying-glass ms-2"></i>
                </div>
              </div>

              <div className="d-flex col-md-6 col-lg-5 justify-content-md-end pb-3">
                <div className={`${styles['product-selectwrapper-w']} ms-3`}>
                  <div
                    className={styles['product-select-w']}
                    id="product-selectpage-w"
                  >
                    <div className={styles['product-selecttrigger-w']}>
                      <span className="p">商品排序</span>
                      <FaChevronDown size={15} />
                    </div>
                    <div
                      className={`${styles['product-selectoptions-w']} ms-3`}
                    >
                      <div
                        className={styles['product-selectoption-w']}
                        data-value="10"
                      >
                        價格: 由低到高
                      </div>
                      <div
                        className={styles['product-selectoption-w']}
                        data-value="20"
                      >
                        價格: 由高到低
                      </div>
                    </div>
                  </div>
                </div>

                {/* 商品排序 */}
                <div className={`${styles['product-selectwrapper-w']} ms-3`}>
                  <div
                    className={styles['product-select-w']}
                    id="product-selectpage-w"
                  >
                    <div className={styles['product-selecttrigger-w']}>
                      <span className="p">每頁顯示20個</span>
                      <FaChevronDown size={15} />
                    </div>
                    <div
                      className={`${styles['product-selectoptions-w']} ms-3`}
                    >
                      <div
                        className={styles['product-selectoption-w']}
                        data-value="10"
                      >
                        每頁顯示20個
                      </div>
                      <div
                        className={styles['product-selectoption-w']}
                        data-value="20"
                      >
                        每頁顯示40個
                      </div>
                      <div
                        className={styles['product-selectoption-w']}
                        data-value="30"
                      >
                        每頁顯示60個
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 商品列表商品區 */}
            <div
              className={`${styles['row']} ${styles['product-card-container']}`}
              id="product-card-container"
            >
              {Array.from({ length: 20 }).map((_, index) => {
                const product = products[index % products.length]
                return (
                  <div
                    key={index}
                    className={`${styles['product-card-w']} col-6 col-md-4 col-lg-3 text-center mb-5`}
                  >
                    <div className={styles['info']}>
                      <div
                        className={`${styles['product-new-w']} d-inline-block p5`}
                      >
                        NEW
                      </div>
                      <div
                        className={`${styles['product-sale-w']} d-inline-block p5`}
                      >
                        SALE
                      </div>
                    </div>
                    {/* 愛心收藏按鈕 */}
                    <button
                      onClick={() => handleFavoriteClick(product.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                      }}
                    >
                      {favoriteProducts[product.id] ? (
                        <FaHeart color="#973929" size={24} />
                      ) : (
                        <FaRegHeart size={24} />
                      )}
                    </button>
                    <Image
                      width={200}
                      height={200}
                      src={product.imageUrl}
                      className={styles['product-cardimg-w']}
                      alt={product.name}
                    />
                    <div className={styles['product-cardbody-w']}>
                      <h5 className={`${styles['product-cardtitle-w']} p`}>
                        {product.brand}
                      </h5>
                      <h5 className={`${styles['product-cardtitle-w']} p`}>
                        {product.name}
                      </h5>
                      <span
                        className={`${styles['product-price-w']} h6`}
                        style={{ color: '#973929' }}
                      >
                        <del style={{ color: '#90957a' }} className="h6-del">
                          NT${product.originalPrice}
                        </del>{' '}
                        NT${product.salePrice}
                      </span>
                      <div className={styles['product-colorsquares-w']}>
                        <div
                          className={styles['product-colorbox-w']}
                          style={{ backgroundColor: product.color }}
                        ></div>
                      </div>
                      <button
                        className={`${styles['add-to-cart']} p btn-primary`}
                      >
                        加入購物車
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
