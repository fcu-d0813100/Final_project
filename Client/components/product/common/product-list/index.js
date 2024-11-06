// components/ProductPage.js
import toast, { Toaster } from 'react-hot-toast'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from './index.module.scss'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/bundle'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FaChevronDown, FaHeart, FaRegHeart } from 'react-icons/fa'
import ProductCarousel from './ProductCarousel' // 引入新的轮播图组件
import Image from 'next/image'
import { useCartProduct } from '@/hooks/use-cartP'

const ProductPage = ({ products, onAll, onCategoryClick, onSubCategoryClick }) => {
  const router = useRouter();
  console.log("Received products:", products);

  // 狀態管理價格和品牌下拉菜單是否顯示
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false)
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState('價格')
  const [selectedBrand, setSelectedBrand] = useState('品牌')
  const [selectedTime, setSelectedTime] = useState(null)

  const handleCardClick = (color_id) => {
    // 根據 color_id 跳轉到商品細節頁
    router.push(`/product/product-list/${color_id}`);
  };

  // 定義 isDropdownOpen 狀態，用來追蹤每個分類的下拉框狀態
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    face: false,
    cheek: false,
    lip: false,
    eye: false,
  });

  // 分類下拉框
  const toggleDropdown = (category) => {
    setIsDropdownOpen(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }

  const handlePriceClick = (value) => {
    setSelectedPrice(value)
    setIsPriceDropdownOpen(false) // 選中後關閉菜單
  }

  const handleBrandClick = (value) => {
    setSelectedBrand(value)
    setIsBrandDropdownOpen(false) // 選中後關閉菜單
  }

  const [filteredProducts, setFilteredProducts] = useState(products); // 篩選後的商品
  const [isFiltered, setIsFiltered] = useState(false); // 判斷是否正在篩選中
  // 狀態管理收藏的商品
  const [favoriteProducts, setFavoriteProducts] = useState({})

  const handleFavoriteClick = (id) => {
    setFavoriteProducts((prevFavorites) => ({
      ...prevFavorites,
      [id]: !prevFavorites[id],
    }))
  }

  // 顯示所有商品
  const handleShowAllProducts = () => {
    setFilteredProducts(products); // 重置為顯示所有商品
    setIsFiltered(false); // 標記為未篩選狀態
  };

  // 加入購物車
  const handleAddToCart = (product,navigateToCart = false) => {
    const { onAddProduct } = useCartProduct()

    // if (selectedTime) {
      onAddProduct({
        id: product.id,
        product_name: product.product_name,
        originalprice: product.originalprice,
        price: product.price,
        usages: product.usages,
        brand: product.brand,
        main_category: product.main_category,
        sub_category: product.sub_category,
        color_id: product.color_id,
        color_name: product.color_name,
        color: product.color,
        mainimage: product.mainimage,
        stock: product.stock,
        qty: 1,
        // date: selectedTime.date,
      })

      onAddProduct(cartProduct); // 添加商品到購物車
      toast.success(`${product.product_name} 已加入購物車!`); // 顯示成功訊息
      if (navigateToCart) {
        router.push('/cart'); // 當 navigateToCart 為 true 時跳轉到購物車頁面
      }
    // }
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

      <div className={`${styles['product-container-w']} ${styles['container-sm']} container`}>
        <div className={`${styles['row']} ${styles['product-row-w']}`}>
          {/* 側邊欄區域 */}
          <aside className={`${styles['product-sidebar-w']} col-lg-2`}>
            <div className={styles['product-sidebarcontent-w']}>
              <ul>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); onAll(); }}>
                    <h4 style={{ color: '#90957a' }}>彩妝商城</h4>
                  </a>
                </li>
                <li><a href="#" className="p">新品上市</a></li>
                <li><a href="#" className="p">人氣商品</a></li>
                <li><a href="#" className="p">優惠商品</a></li>
                <li><a href="#" className="p">所有商品</a></li>
                {/* 臉部分類 */}
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('face'); }} className="p">臉部彩妝 <FaChevronDown size={13}/></a>
                  {isDropdownOpen.face && (
                    <ul>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onCategoryClick(1, null); }} className="p">所有臉部</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(1, 1); }} className="p">粉底液</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(1, 2); }} className="p">遮瑕</a></li>
                    </ul>
                  )}
                </li>

                {/* 雙頰分類 */}
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('cheek'); }} className="p">雙頰彩妝 <FaChevronDown size={13}/></a>
                  {isDropdownOpen.cheek && (
                    <ul>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onCategoryClick(2, null); }} className="p">所有雙頰</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(2, 3); }} className="p">腮紅</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(2, 4); }} className="p">修容</a></li>
                    </ul>
                  )}
                </li>

                {/* 唇部分類 */}
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('lip'); }} className="p">唇部彩妝 <FaChevronDown size={13}/></a>
                  {isDropdownOpen.lip && (
                    <ul>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onCategoryClick(4, null); }} className="p">所有唇部</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(4, 9); }} className="p">唇膏</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(4, 10); }} className="p">唇彩</a></li>
                    </ul>
                  )}
                </li>

                {/* 眼部分類 */}
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('eye'); }} className="p">眼部彩妝 <FaChevronDown size={13}/></a>
                  {isDropdownOpen.eye && (
                    <ul>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onCategoryClick(3, null); }} className="p">所有眼部</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(3, 5); }} className="p">眼影</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(3, 6); }} className="p">眼線筆</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(3, 7); }} className="p">眉筆</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(3, 8); }} className="p">睫毛膏</a></li>
                    </ul>
                  )}
                </li>
              </ul>
              {/* 價格選單 */}
              <div className={`${styles['product-selectwrapper-w']} ms-3`}>
                <div className={styles['product-select-w']} id="product-selectprice-w">
                  <div className={styles['product-selecttrigger-w']}>
                    <span className="p">價格</span>
                    <FaChevronDown size={12} />
                  </div>
                  <div className={`${styles['product-selectoptions-w']} p`}>
                    <div className={styles['product-selectoption-w']} data-value="low">NT$0 - NT$1000</div>
                    <div className={styles['product-selectoption-w']} data-value="mid">NT$1000 - NT$2000</div>
                    <div className={styles['product-selectoption-w']} data-value="high">NT$2000+</div>
                  </div>
                </div>
              </div>

              {/* 品牌選單 */}
              <div className={`${styles['product-selectwrapper-w']} ms-3`}>
                <div className={styles['product-select-w']} id="product-selectbrand-w">
                  <div className={styles['product-selecttrigger-w']}>
                    <span className="p">品牌</span>
                    <FaChevronDown size={12} />
                  </div>
                  <div className={`${styles['product-selectoptions-w']} p`}>
                    <div className={styles['product-selectoption-w']} data-value="ysl">YSL</div>
                    <div className={styles['product-selectoption-w']} data-value="nars">NARS</div>
                    <div className={styles['product-selectoption-w']} data-value="bobbi">Bobbi Brown</div>
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
                <div className={`${styles['product-breadcrumb-w']} p`}>
                  首頁 / 彩妝商城 / 所有商品
                </div>
              </div>

              {/* 搜尋框 */}
              <div className="col-md-6 col-lg-4 mb-md-0">
                <div className={`${styles['product-search-w']} d-flex align-items-center justify-content-center`}>
                  <input type="text" className="form-control p" placeholder="找商品" />
                  <i className="fa-solid fa-magnifying-glass ms-2"></i>
                </div>
              </div>

              <div className="d-flex col-md-6 col-lg-5 justify-content-md-end pb-3">
                <div className={`${styles['product-selectwrapper-w']} ms-3`}>
                  <div className={styles['product-select-w']} id="product-selectpage-w">
                    <div className={styles['product-selecttrigger-w']}>
                      <span className="p">商品排序</span>
                      <FaChevronDown size={15} />
                    </div>
                    <div className={`${styles['product-selectoptions-w']} ms-3`}>
                      <div className={styles['product-selectoption-w']} data-value="10">價格: 由低到高</div>
                      <div className={styles['product-selectoption-w']} data-value="20">價格: 由高到低</div>
                    </div>
                  </div>
                </div>

                <div className={`${styles['product-selectwrapper-w']} ms-3`}>
                  <div className={styles['product-select-w']} id="product-selectpage-w">
                    <div className={styles['product-selecttrigger-w']}>
                      <span className="p">每頁顯示20個</span>
                      <FaChevronDown size={15} />
                    </div>
                    <div className={`${styles['product-selectoptions-w']} ms-3`}>
                      <div className={styles['product-selectoption-w']} data-value="10">每頁顯示20個</div>
                      <div className={styles['product-selectoption-w']} data-value="20">每頁顯示40個</div>
                      <div className={styles['product-selectoption-w']} data-value="30">每頁顯示60個</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`${styles['row']} ${styles['product-card-container']}`} id="product-card-container">
              {products.map((product) => (
                <div
                  key={product.color_id}
                  className={`${styles['product-card-w']} col-6 col-md-4 col-lg-3 text-center mb-5`}
                  onClick={() => handleCardClick(product.color_id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles['info']}>
                    <div className={`${styles['product-new-w']} d-inline-block p5`}>NEW</div>
                    <div className={`${styles['product-sale-w']} d-inline-block p5`}>SALE</div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleFavoriteClick(product.color_id); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                    }}
                  >
                    {favoriteProducts[product.color_id] ? <FaHeart color="#973929" size={24} /> : <FaRegHeart size={24} />}
                  </button>
                  <Image
                    width={200}
                    height={200}
                    src={`/product/mainimage/${product.mainimage}`}
                    className={styles['product-cardimg-w']}
                    alt={product.product_name}
                  />
                  <div className={styles['product-cardbody-w']}>
                    <h5 className={`${styles['product-cardtitle-w']} p`}>{product.brand}</h5>
                    <h5 className={`${styles['product-cardtitle-w']} p`}>{product.product_name}</h5>
                    <span className={`${styles['product-price-w']} h6`} style={{ color: '#973929' }}>
                      <del style={{ color: '#90957a' }} className="h6-del">NT${product.originalprice}</del> NT${product.price}
                    </span>
                    <div className={styles['product-colorsquares-w']}>
                      <div className={styles['product-colorbox-w']} style={{ backgroundColor: product.color }}></div>
                    </div>
                    <button className={`${styles['add-to-cart']} p btn-primary`} onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}>加入購物車</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProductPage;
