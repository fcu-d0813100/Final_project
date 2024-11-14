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
import { FaSearch, FaHeart, FaRegHeart } from 'react-icons/fa'
import ProductCarousel from './ProductCarousel'   
import Image from 'next/image'
import { useCartProduct } from '@/hooks/use-cartP'
import Dropdown from '@/components/product/common/product-list/dropdownList'
import { PiCaretDown } from 'react-icons/pi'
import Pagination from '@/components/shared/pagination'
import { useFavorite } from '@/hooks/use-favorite'

const ProductPage = ({  
  products,
  onAll,
  onCategoryClick,
  onSubCategoryClick,
  onNewArrivalsClick,
  onNarsDiscountClick,
  onPriceFilterClick,
  onBrandFilterClick,
  onKeywordSearch,
  onHandlePopularClick
}) => {
  const { favoriteProducts, handleFavoriteClick } = useFavorite(); // 使用收藏鉤子
  const router = useRouter()
  const { onAddProductMany } = useCartProduct()

   // 狀態管理
   const [isDropdownOpen, setIsDropdownOpen] = useState({ face: false, cheek: false, lip: false, eye: false })
   // const [favoriteProducts, setFavoriteProducts] = useState({})
   const [currentPage, setCurrentPage] = useState(1)
   const [itemsPerPage, setItemsPerPage] = useState(20)
   const [filteredProducts, setFilteredProducts] = useState(products)
   const [searchKeyword, setSearchKeyword] = useState('')
   const [sortOrder, setSortOrder] = useState('asc') // 排序方式


  // 關鍵字搜尋處理函數
  const handleSearch = async () => {
  if (searchKeyword.trim()) {
    const isEmpty = await onKeywordSearch(searchKeyword) // 調用 onKeywordSearch 並傳入 searchKeyword

    // 檢查是否無搜尋結果並顯示 toast
    if (isEmpty) {
      toast.error('沒有找到相關商品，請嘗試其他關鍵字', {
        style: { border: '1.2px solid #90957a', padding: '12px 40px', color: '#626553' },
        iconTheme: { primary: '#963827', secondary: '#fff' },
      })
      // 延遲 2 秒後導回全部商品
      setTimeout(() => {
        onAll(); // 調用 onAll 函數來顯示所有商品
        setSearchKeyword(''); // 清空搜尋框
      }, 2000)
    }
  }
}

// 排序商品
const sortProducts = (order) => {
  setSortOrder(order)
  setFilteredProducts((prevProducts) =>
    [...prevProducts].sort((a, b) => {
      if (order === 'asc') return a.price - b.price
      else return b.price - a.price
    })
  )
}

  // 按下 Enter 鍵觸發搜尋
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }
  
//   // 處理收藏按鈕點擊事件
// const handleFavoriteClick = (color_id) => {
//   if (!auth.isAuth) {
//     // 如果未登入，跳轉到登入頁面
//     toast.error('請先登入以使用收藏功能', {
//       style: { border: '1.2px solid #90957a', padding: '12px 40px', color: '#963827' },
//       iconTheme: { primary: '#963827', secondary: '#fff' },
//     })
//     router.push('/user/login/user') // 跳轉到登入頁面
//     return
//   }

//   // 如果已登入，加入或移除收藏
//   setFavoriteProducts((prevFavorites) => ({
//     ...prevFavorites,
//     [color_id]: !prevFavorites[color_id],
//   }))
  
//   // 在此處將收藏的商品新增到 `UserSection` 的收藏清單
//   // 可以考慮用 context 或直接傳遞 state 來管理
// }

  // 定義價格和品牌選項
  const priceOptions = [
    { label: 'NT$0 - NT$1000', minPrice: 0, maxPrice: 1000 },
    { label: 'NT$1000 - NT$2000', minPrice: 1000, maxPrice: 2000 },
    { label: 'NT$2000+', minPrice: 2000, maxPrice: 9999999 },
  ]
  const brandOptions = [
    { option: 'Bobbi Brown' },
    { option: 'Estee Lauder' },
    { option: 'LANCOME' },
    { option: 'NARS' },
    { option: 'YSL' },
  ]
 

  // 商品排序選項
  const sortOptions = [
    { option: '價格: 由低到高', onClick: () => sortProducts('asc') },
    { option: '價格: 由高到低', onClick: () => sortProducts('desc') },
  ]

  // 每頁顯示選項
  const itemsPerPageOptions = [
    { option: '每頁顯示20個', onClick: () => handleItemsPerPageChange(20) },
    { option: '每頁顯示40個', onClick: () => handleItemsPerPageChange(40) },
    { option: '每頁顯示60個', onClick: () => handleItemsPerPageChange(60) },
  ]

  useEffect(() => {
    setFilteredProducts(products)
    setCurrentPage(1) // 每次篩選或排序重置分頁
  }, [products])

  // 切換分類下拉框
  const toggleDropdown = (category) => {
    setIsDropdownOpen((prev) => ({ ...prev, [category]: !prev[category] }))
  }

  // clearAndFetchProducts 函數進行改進，重置所有狀態
const clearAndFetchProducts = async (fetchFunction) => {
  // 重置關鍵字搜尋框
  setSearchKeyword('')
  
  // 清空目前顯示的產品，並重置篩選條件（例如當前頁）
  setFilteredProducts([])
  setCurrentPage(1) // 重置為第一頁

  // 確保異步調用結束後再更新產品
  await fetchFunction()
}

  // 每頁顯示數量變更
  const handleItemsPerPageChange = (num) => {
    setItemsPerPage(num)
    setCurrentPage(1)
  }
  useEffect(() => {
    setFilteredProducts(products)
    setCurrentPage(1)
  }, [products])
  
  // 取得分頁商品
  const indexOfLastProduct = currentPage * itemsPerPage
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // 加入購物車功能
  const addPnotify = () =>
    toast.success('新增1件商品', {
      style: { border: '1.2px solid #90957a', padding: '12px 40px', color: '#626553' },
      iconTheme: { primary: '#626553', secondary: '#fff' },
    })

    // 根據 color_id 跳轉到商品詳細頁
  const handleCardClick = (color_id) => {
    router.push(`/product/product-list/${color_id}`)
  }


  return (
    <div className={styles['container']}>
      <header>
        <div className={styles['hamburger-menu']}>
          <i className="fa-solid fa-bars"></i>
        </div>
      </header>

      <ProductCarousel />

      <div className={`${styles['product-container-w']} ${styles['container-sm']} container`}>
        <div className={`${styles['row']} ${styles['product-row-w']}`}>
          <aside className={`${styles['product-sidebar-w']} col-lg-2`}>
            <div className={styles['product-sidebarcontent-w']}>
              <ul>
                <li><a href="#"><h4 style={{ color: '#90957a' }}>彩妝商城</h4></a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); clearAndFetchProducts(onNewArrivalsClick) }} className="p">新品上市</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); clearAndFetchProducts(onHandlePopularClick) }} className="p">人氣商品</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); clearAndFetchProducts(onNarsDiscountClick) }} className="p">優惠商品</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); clearAndFetchProducts(onAll) }} className="p">所有商品</a></li>

                {/* 臉部分類 */}
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('face') }} className="p">
                    臉部彩妝 <PiCaretDown size={15} />
                  </a>
                  {isDropdownOpen.face && (
                    <ul>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onCategoryClick(1, null) }} className="p">所有臉部</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(1, 1) }} className="p">粉底液</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(1, 2) }} className="p">遮瑕</a></li>
                    </ul>
                  )}
                </li>

                {/* 雙頰分類 */}
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('cheek') }} className="p">
                    雙頰彩妝 <PiCaretDown size={15} />
                  </a>
                  {isDropdownOpen.cheek && (
                    <ul>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onCategoryClick(2, null) }} className="p">所有雙頰</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(2, 3) }} className="p">腮紅</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(2, 4) }} className="p">修容</a></li>
                    </ul>
                  )}
                </li>

                {/* 唇部分類 */}
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('lip') }} className="p">
                    唇部彩妝 <PiCaretDown size={15} />
                  </a>
                  {isDropdownOpen.lip && (
                    <ul>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onCategoryClick(4, null) }} className="p">所有唇部</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(4, 9) }} className="p">唇膏</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(4, 10) }} className="p">唇彩</a></li>
                    </ul>
                  )}
                </li>

                {/* 眼部分類 */}
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('eye') }} className="p">
                    眼部彩妝 <PiCaretDown size={15} />
                  </a>
                  {isDropdownOpen.eye && (
                    <ul>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onCategoryClick(3, null) }} className="p">所有眼部</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(3, 5) }} className="p">眼影</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(3, 6) }} className="p">眼線筆</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(3, 7) }} className="p">眉筆</a></li>
                      <li><a href="#" onClick={(e) => { e.preventDefault(); onSubCategoryClick(3, 8) }} className="p">睫毛膏</a></li>
                    </ul>
                  )}
                </li>
              </ul>

              {/* 使用 Dropdown 組件來篩選價格和品牌 */}
              <Dropdown
                name="價格"
                items={priceOptions.map(option => ({
                  option: option.label,
                  onClick: () => clearAndFetchProducts(() => onPriceFilterClick(option.minPrice, option.maxPrice))
                }))}
                className={styles['dropdownTitle']}
              />
              <Dropdown
                name="品牌"
                items={brandOptions.map(option => ({
                  option: option.option,
                  onClick: () => clearAndFetchProducts(() => onBrandFilterClick(option.option))
                }))}
                className={styles['dropdownTitle']}
              />
            </div>
          </aside>

          <section className={`${styles['product-list-w']} ms-3 col-lg-10`}>
            <Toaster position="top-center" reverseOrder={true} />
            <div className={`${styles['row']} justify-content-between align-items-center mb-5`}>
              <div className="col-lg-3 mb-3 mb-lg-0">
                <div className={`${styles['product-breadcrumb-w']} p`}>首頁 / 彩妝商城 / 所有商品</div>
              </div>

              <div className="col-md-6 col-lg-4 mb-md-0">
                <div className={`${styles['product-search-w']} d-flex align-items-center justify-content-center`}>
                <input
                  type="text"
                  className="form-control p"
                  placeholder="找商品"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={handleKeyPress} // 監聽 Enter 鍵
                />
                <button onClick={handleSearch} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <FaSearch size={18} style={{ opacity: 0.7 }} className="ms-2" />
                </button>
                </div>
              </div>

              <div className="d-flex col-md-6 col-lg-5 justify-content-md-end pb-3">
                <Dropdown name="商品排序" items={sortOptions} />
                <Dropdown name="每頁顯示" items={itemsPerPageOptions} />
              </div>
            </div>

            <div className={`${styles['row']} ${styles['product-card-container']}`} id="product-card-container">
              {currentProducts.map((product) => (
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
                  <button onClick={(e) => { e.stopPropagation();console.log('Product details:', product);  handleFavoriteClick(product) ;}} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }}>
                    {favoriteProducts[product.color_id] ? <FaHeart color="#973929" size={24} /> : <FaRegHeart size={24} />}
                  </button>
                  <Image width={200} height={200} src={`/product/mainimage/${product.mainimage}`} className={styles['product-cardimg-w']} alt={product.product_name} />
                  <div className={styles['product-cardbody-w']}>
                    <h5 className={`${styles['product-cardtitle-w']} p`}>{product.brand}</h5>
                    <h5 className={`${styles['product-cardtitle-w']} p`}>{product.product_name}</h5>
                    <span className={`${styles['product-price-w']} h6`} style={{ color: '#973929' }}>
                      <del style={{ color: '#90957a' }} className="h6-del">NT${product.originalprice}</del> NT${product.price}
                    </span>
                    <div className={styles['product-colorsquares-w']}>
                      <div className={styles['product-colorbox-w']} style={{ backgroundColor: product.color }}></div>
                    </div>
                    <button
                      className={`${styles['add-to-cart']} p btn-primary`}
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddProductMany(product)
                        addPnotify()
                      }}
                    >
                      加入購物車
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
