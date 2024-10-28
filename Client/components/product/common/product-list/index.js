// components/ProductPage.js
import React, { useEffect } from 'react';
import styles from './index.module.scss';
import Swiper from 'swiper/bundle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/bundle';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const ProductPage = () => {
    useEffect(() => {
        new Swiper('.product-myswiper-w', {
          spaceBetween: 20,
          centeredSlides: true,
        //   autoplay: {
        //     delay: 2500,
        //     disableOnInteraction: false,
        //   },
          pagination: {
            el: '.product-swiperpagination-w',
            clickable: true,
          },
          navigation: {
            nextEl: '.product-swiperbuttonnext-w',
            prevEl: '.product-swiperbuttonprev-w',
          },
        });
      }, []);
    
      const products = [
        {
          name: 'YSL <br> 時尚印記唇釉',
          originalPrice: 2080,
          salePrice: 1580,
          imageUrl: '/product/NARS_ES01_M_ADULTS.webp',
          color: '#e3a790',
        },
        {
          name: 'NARS <br> 唇膏',
          originalPrice: 1900,
          salePrice: 1400,
          imageUrl: '/product/NARS_LS01_M_133 (1).webp',
          color: '#732111',
        },
        {
          name: 'LANCOME <br> 絕對完美柔霧唇膏',
          originalPrice: 2500,
          salePrice: 2200,
          imageUrl: '/product/LANCOME_LS01_M_196.webp',
          color: '#8f352d',
        },
      ];
    
      return (
        <div className="container">
          {/* 頁面標題 */}
          <header>
            <div className="hamburger-menu">
              <i className="fa-solid fa-bars"></i>
            </div>
          </header>
    
          {/* 輪播圖 */}
          <div className="swiper-container product-myswiper-w">
            <div className={`$(styles['swiper-wrapper']) swiper-wrapper`}>
              {products.map((product, index) => (
                <div className={`$(styles['swiper-slide']) swiper-slide`} key={index}>
                  <img src={"/product/S__18604034.jpg"} alt={product.name} />
                </div>
              ))}
            </div>
            <div className="swiper-button-next product-swiperbuttonnext-w"></div>
            <div className="swiper-button-prev product-swiperbuttonprev-w"></div>
            <div className="swiper-pagination product-swiperpagination-w"></div>
          </div>

      <div className={`${styles['product-container-w']} ${styles['container-sm']} container`}>
        <div className={`${styles['row']} ${styles['product-row-w']}`}>
          {/* 側邊欄區域 */}
          <aside className={`$(styles['product-sidebar-w']) col-lg-2`}>
            <div className={styles['product-sidebarcontent-w']}>
              <ul>
                <li>
                  <a href="#"><h4 style={{ color: '#90957a' }}>彩妝商城</h4></a>
                </li>
                <li><a href="#" className="p">新品上市</a></li>
                <li><a href="#" className="p">人氣商品</a></li>
                <li><a href="#" className="p">優惠商品</a></li>
                <li><a href="#" className="p">所有商品</a></li>
                <li><a href="#" className="p">臉部</a></li>
                <li><a href="#" className="p">雙頰</a></li>
                <li><a href="#" className="p">唇部</a></li>
                <li><a href="#" className="p">眼部</a></li>
                <li><a href="#" className="p">眉部</a></li>
              </ul>

              {/* 價格選單 */}
              <div className={`${styles['product-selectwrapper-w']} ms-3`}>
                <div className={styles['product-select-w']} id="product-selectprice-w">
                  <div className="product-selecttrigger-w">
                    <span className="p">價格</span>
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>
                  <div className={`${styles['product-selectoptions-w']} p`}>
                    <div className="product-selectoption-w" data-value="low">
                      NT$0 - NT$1000
                    </div>
                    <div className="product-selectoption-w" data-value="mid">
                      NT$1000 - NT$2000
                    </div>
                    <div className="product-selectoption-w" data-value="high">
                      NT$2000+
                    </div>
                  </div>
                </div>
              </div>

              {/* 品牌選單 */}
              <div className="ms-3 product-selectwrapper-w">
                <div className={styles['product-select-w']} id="product-selectbrand-w">
                  <div className="product-selecttrigger-w">
                    <span className="p">品牌</span>
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>
                  <div className="product-selectoptions-w p">
                    <div className="product-selectoption-w" data-value="ysl">YSL</div>
                    <div className="product-selectoption-w" data-value="nars">NARS</div>
                    <div className="product-selectoption-w" data-value="bobbi">
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
            <div className={`${styles['row']} justify-content-between align-items-center mb-5`}>
              {/* Breadcrumb */}
              <div className="col-lg-3 mb-3 mb-lg-0">
                <div className={`${styles['product-breadcrumb-w']} p`}>首頁 / 彩妝商城 / 所有商品</div>
              </div>

              {/* 搜尋框 */}
              <div className="col-md-6 col-lg-4 mb-md-0">
                <div className={`${styles['product-search-w']} d-flex align-items-center justify-content-center`}>
                  <input type="text" className="form-control p" placeholder="找商品" />
                  <i className="fa-solid fa-magnifying-glass ms-2"></i>
                </div>
              </div>

              <div className="d-flex col-md-6 col-lg-5 justify-content-md-end pb-3">
                {/* 商品排序 */}
                <div className={`${styles['product-selectwrapper-w']} ms-3`}>
                <div className={styles['product-select-w']} id="product-selectpage-w">
                    <div className={styles['product-selecttrigger-w']}>
                      <span className="p">每頁顯示20個</span>
                      <i><FontAwesomeIcon icon={faChevronDown} /></i>
                    </div>
                    <div className={`${styles['product-selectoptions-w']} ms-3`}>
                      <div className={styles['product-selectoption-w']} data-value="10">
                        每頁顯示20個
                      </div>
                      <div className={styles['product-selectoption-w']} data-value="20">
                        每頁顯示40個
                      </div>
                      <div className={styles['product-selectoption-w']} data-value="30">
                        每頁顯示60個
                      </div>
                    </div>
                  </div>
                </div>

                {/* 每頁顯示數量 */}
                <div className={`${styles['product-selectwrapper-w']} ms-3`}>
                  <div className={styles['product-select-w']} id="product-selectpage-w">
                    <div className={styles['product-selecttrigger-w']}>
                      <span className="p">每頁顯示20個</span>
                      <i><FontAwesomeIcon icon={faChevronDown} /></i>
                    </div>
                    <div className={`${styles['product-selectoptions-w']} ms-3`}>
                      <div className={styles['product-selectoption-w']} data-value="10">
                        每頁顯示20個
                      </div>
                      <div className={styles['product-selectoption-w']} data-value="20">
                        每頁顯示40個
                      </div>
                      <div className={styles['product-selectoption-w']} data-value="30">
                        每頁顯示60個
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 商品列表商品區 */}
            <div className={`${styles['row']} ${styles['product-card-container']}`} id="product-card-container">
              {products.map((product, index) => (
                <div className={`${styles['product-card-w']} col-md-4 col-6 col-lg-3 text-center`} key={index}>
                  <div className={styles['info']}>
                    <div className={`${styles['product-new-w']} d-inline-block p5`}>NEW</div>
                    <div className={`${styles['product-sale-w']} d-inline-block p5`}>SALE</div>
                  </div>
                  <i className="fa-regular fa-heart"></i>
                  <img
                    src={product.imageUrl}
                    className={styles['product-cardimg-w']}
                    alt={product.name}
                  />
                  <div className={styles['product-cardbody-w']}>
                    <h5 className={`${styles['product-cardtitle-w']} p`}>{product.name}</h5>
                    <span className={`${styles['product-price-w']} h6`} style={{ color: product.color }}>
                      <del style={{ color: '#90957a' }} className="h6-del">NT${product.originalPrice}</del> NT${product.salePrice}
                    </span>
                    <br />
                    <div className={styles['product-colorsquares-w']}>
                      <div
                        className={styles['product-colorbox-w']}
                        style={{ backgroundColor: product.color }}
                      ></div>
                    </div>
                    <button className={`${styles['add-to-cart']} p btn-primary`}>加入購物車</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
