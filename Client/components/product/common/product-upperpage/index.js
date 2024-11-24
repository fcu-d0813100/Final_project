import React, { useState, useEffect , useMemo } from 'react';
import styles from './ProductPage.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';
import { FaHeart, FaRegHeart, FaMinus, FaPlus, FaChevronUp, FaChevronDown, FaPlusCircle, FaShoppingBag } from 'react-icons/fa';
import { Tab, Nav } from 'react-bootstrap';
import CommentBoard from '@/components/product/common/CommentBoard';
import toast from 'react-hot-toast'
import { useCartProduct } from '@/hooks/use-cartP'
import { useRouter } from 'next/router'
import { useFavorite } from '@/hooks/use-favorite'; 

// productPage 此參數，為一個陣列
const ProductPage = ({ productPage }) => {
  console.log("productPage:", productPage);

  if (!productPage || productPage.length === 0) {
    return <div>Loading...</div>; // 確保資料存在後再顯示
  }
  const router = useRouter()
  const { onAddProductMany } = useCartProduct()
  const { cid } = router.query;
  
  const [quantity, setQuantity] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(productPage[0]); // 預設顯示第一個色號
  const [orderItemId, setOrderItemId] = useState(null); // 用於存儲從 localStorage 獲取的 orderItemId
  const [isFavorite, setIsFavorite] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [startIndex, setStartIndex] = useState(0);
  const [uniqueProducts, setUniqueProducts] = useState([]);
  const [animateChart, setAnimateChart] = useState(false);
  const { favoriteProducts, handleFavoriteClick } = useFavorite(); // 收藏鉤子

  useEffect(() => {
    // 使用 color_id 作為鍵，將重複的 color_id 過濾，並將 info_image 合併到 images 陣列
    const uniqueMap = productPage.reduce((acc, product) => {
      if (!acc[product.color_id]) {
        acc[product.color_id] = { ...product, images: [product.info_image] };
      } else {
        acc[product.color_id].images.push(product.info_image);
      }
      return acc;
    }, {});

    const uniqueList = Object.values(uniqueMap);
    setUniqueProducts(uniqueList);

    console.log("Unique Products:", uniqueList); // 查看過濾後的資料
  }, [productPage]);


  useEffect(() => {
  if (cid && uniqueProducts.length > 0) {
    const product = uniqueProducts.find((p) => p.color_id === parseInt(cid)); // 使用 cid 來匹配 color_id
    setSelectedProduct(product || uniqueProducts[0]);
  }
  }, [cid, uniqueProducts]);

  // 從 localStorage 獲取 orderItemId
  useEffect(() => {
    const storedOrderItemId = localStorage.getItem('orderId'); 
    if (storedOrderItemId) {
      setOrderItemId(storedOrderItemId);
    } else {
      console.warn('No orderItemId found in localStorage');
    }
  }, []);

   // 打印 selectedProduct 和 orderItemId
  useEffect(() => {
    console.log('Selected Product:', selectedProduct);
    console.log('Order Item ID:', orderItemId);
  }, [selectedProduct, orderItemId]);

  // 數量
  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => setQuantity(quantity > 1 ? quantity - 1 : 0);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  // const toggleFavorite = () => setIsFavorite(!isFavorite);

  // 使用 useMemo 來計算唯一縮圖，避免每次渲染時重複計算
  const uniqueThumbnails = useMemo(() => {
    return [...new Map(
      productPage.map((product) => [product.color_id, product]) // 使用 color_id 作為 Map 的 key，去重
    ).values()];
  }, [productPage]);

  // 過濾出相同 color_id 的所有介紹圖，並去除重複的圖片
const selectedProductImages = useMemo(() => {
  const images = productPage
    .filter((product) => product.color_id === selectedProduct.color_id)
    .map((product) => product.info_image);
  // 使用 Set 去除重複的圖片
  return [...new Set(images)];
}, [productPage, selectedProduct.color_id]);

  // 每次顯示 4 張圖片，從 startIndex 開始
  const visibleThumbnails = useMemo(() => {
    return uniqueThumbnails.slice(startIndex, startIndex + 4);
  }, [uniqueThumbnails, startIndex]);

  // 控制上下按鈕的顯示，避免超出範圍
  const handleNext = () => {
    if (startIndex + 4 < uniqueThumbnails.length) {
      setStartIndex(startIndex + 1);
    }
  };
  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  // 加入購物車通知
  const addPnotify = () =>
    toast.success(`已新增 ${quantity} 件商品至購物車`, {
      style: { padding: '12px 40px', color: '#626553' },
      iconTheme: { primary: '#626553', secondary: '#fff' },
    })
  
  // 庫存不足通知
  const outOfStockNotify = () =>
  toast.error(`目前庫存僅剩 ${selectedProduct.stock} 件，請調整購買數量`, {
    style: {
      padding: '12px 40px',
      color: '#973929',
    },
    iconTheme: { primary: '#973929', secondary: '#fff' },
  });

  // 立即購買函數
  const handleAddToCart = async (navigateToCart = false) => {
    if (quantity > selectedProduct.stock) { // 判斷是否超過庫存
      outOfStockNotify();
      return;
    }
    if (quantity > 0) { // 確保數量大於 0 才能添加到購物車
      onAddProductMany({
        product_id: selectedProduct.product_id,
        color_name: selectedProduct.color_name,
        product_name: selectedProduct.product_name,
        price: selectedProduct.price,
        originalprice: selectedProduct.originalprice,
        quantity: quantity,
        mainimage: selectedProduct.mainimage,
      });
      addPnotify();
    } else {
      toast.error("請選擇至少 1 件商品", {
        style: {
          // border: '1.2px solid #f44336',
          padding: '12px 40px',
          color: '#973929',
        },
        iconTheme: { primary: '#973929', secondary: '#fff' },
      });
      navigateToCart = false;
    }
    if (navigateToCart) {
      router.push('/cart'); // 導向購物車頁面
    }
  };

  // 在顧客評論Tab被選中時，觸發動畫填滿
  const handleTabSelect = (eventKey) => {
    if (eventKey === "reviews") {
      setAnimateChart(false); // 重置動畫狀態
      setTimeout(() => setAnimateChart(true), 0); // 確保狀態改變來觸發動畫
    }
  };
  
  // 每次當 ProductPage 組件加載時，它會檢查 URL 中的哈希值，如果哈希值是 #reviews，它就會滾動到評論區域
  useEffect(() => {
    if (window.location.hash === '#reviews') {
      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className={styles['product-page']}>
      <div className="container">
        <div className={`${styles['product-page-row']} row justify-content-center`}>
          {/* 左側縮圖選項 */}
          <div className="col-3 col-md-1  mt-5 p-1">
            <div className={styles['thumbnail-gallery']}>
              <button onClick={handlePrev} disabled={startIndex === 0} className={styles['arrow-button']}>
                <FaChevronUp />
              </button>
              {uniqueProducts.slice(startIndex, startIndex + 4).map((product, index) => (
                <Image
                  key={product.color_id}
                  width={100}
                  height={100}
                  src={`/product/mainimage/${product.mainimage}`}
                  alt={`Thumbnail ${index + 1}`}
                  className={`${styles.thumbnail} ${selectedProduct.color_id === product.color_id ? styles['active-thumbnail'] : ''} ${styles['thumail']} `}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
              {/* <button onClick={handleNext} disabled={startIndex + 4 >= uniqueThumbnails.length} className={styles['arrow-button']}> */}
              <button onClick={() => setStartIndex(Math.min(uniqueProducts.length - 4, startIndex + 1))} disabled={startIndex + 4 >= uniqueProducts.length} className={styles['arrow-button']}>
                <FaChevronDown />
              </button>
            </div>
          </div>

          {/* 主圖顯示區 */}
          <div className={`${styles['main-image-container']} col-9 col-md-6 d-flex justify-content-center`}>
            <div
              className={styles['main-image']}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                width={528}
                height={528}
                src={`/product/mainimage/${selectedProduct.mainimage}`}
                alt="Main Product"
                className={styles['image']}
              />
              {isZoomed && (
                <div
                  className={styles['zoom-lens']}
                  style={{
                    backgroundImage: `url(/product/mainimage/${selectedProduct.mainimage})`,
                    backgroundPosition: `-${zoomPosition.x * 2}px -${zoomPosition.y * 2}px`,
                    top: `${zoomPosition.y}px`,
                    left: `${zoomPosition.x}px`,
                  }}
                ></div>
              )}
            </div>
          </div>

          {/* 右側產品詳細資訊 */}
          <div className={`${styles['product-details-container']} col-md-5 mt-2`}>
            <div className={styles['product-details']}>
              <div className="justify-content-between align-items-center">
                <div className="d-flex align-items-center mb-3 mt-3">
                  <div className="h6">{selectedProduct.brand}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteClick(selectedProduct); // 使用收藏鉤子
                    }}
                    className={`${styles['favorite-button']} ms-3`}
                  >
                    {favoriteProducts[selectedProduct.color_id] ? <FaHeart color="#973929" size={24} /> : <FaRegHeart size={24} />}
                  </button>
                </div>
                <h3 className={`${styles['product-name']} mb-0`}>{selectedProduct.product_name}</h3>
              </div>
              <div className={styles['product-details-info']}>
                <p>{`使用方法: ${selectedProduct.usages}`}</p>
                <div className={styles['stock-and-more-info']}>
                  <p className={styles['more-info']} style={{ marginRight: '10px' }}>更多詳細資訊</p>
                  {selectedProduct.stock <= 10 && selectedProduct.stock > 0 && (
                    <>
                      <span style={{ color: 'red' }}>
                        僅剩 {selectedProduct.stock} 件
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className={styles.price}>
                <span className={styles['current-price']}>{`NT$${selectedProduct.price}`}</span>
                <span className={styles['original-price']}>{`NT$${selectedProduct.originalprice}`}</span>
              </div>

              <div className={styles['color-selector']}>
                <span>{`顏色: ${selectedProduct.color_name}`}</span>
                <div className={styles['color-options']}>
                {uniqueProducts.map((product) => (
                    <span
                      key={product.color_id}
                      className={`${styles['color-swatch']} ${selectedProduct.color_id === product.color_id ? styles['active-swatch'] : ''}`}
                      style={{ backgroundColor: product.color }}
                      onClick={() => setSelectedProduct(product)}
                    ></span>
                  ))}
                  {/* {[...new Map(
                    productPage
                      .filter((product) => product.product_id === selectedProduct.product_id) // 過濾出相同 product_id 的產品
                      .map((product) => [product.color_id, product]) // 使用 color_id 作為 Map 的 key
                    ).values()]
                    .map((product) => (
                      <span
                        key={product.color_id}
                        className={`${styles['color-swatch']} ${selectedProduct.color_id === product.color_id ? styles['active-swatch'] : ''}`}
                        style={{ backgroundColor: product.color }}
                        onClick={() => setSelectedProduct(product)}
                      ></span>
                    ))} */}
                </div>
              </div>
              
             {/* 商品數量選擇區域 */}
              <div className={styles['quantity-selector']}>
              {selectedProduct.stock > 0 && (
              <div className={styles['quantity-selector']}>
                <button onClick={handleDecrement} className={`${styles.btnSm} ph`}><FaMinus /></button>
                <span>{quantity}</span>
                <button onClick={handleIncrement} className={`${styles.btnSm} ph`}><FaPlus /></button>
              </div>
              )}
              </div>

              {/* 按鈕區域 */}
              <div className={styles.buttons}>
                {selectedProduct.stock > 0 ? (
                  <>
                    <button
                      className={`${styles['add-to-cart']} h6 btn-primary`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (quantity > selectedProduct.stock) {
                          // 如果數量超過庫存，顯示庫存不足通知並停止操作
                          outOfStockNotify();
                          return;
                        }
                        if (quantity > 0) { 
                          onAddProductMany({ ...selectedProduct, quantity });
                          addPnotify();
                        } else {
                          toast.error("請選擇至少 1 件商品", {
                            style: {
                              padding: '12px 40px',
                              color: '#973929',
                            },
                            iconTheme: { primary: '#973929', secondary: '#fff' },
                          });
                        }
                      }}
                    >
                      <FaPlusCircle className={styles['icon']} />
                      加入購物車
                    </button>
                    <button
                      className={`${styles['buy-now']} h6 btn-primary`}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (quantity > selectedProduct.stock) {
                          // 如果數量超過庫存，顯示庫存不足通知並停止操作
                          outOfStockNotify()
                          return
                        }
                        if (quantity > 0) {
                          onAddProductMany({ ...selectedProduct, quantity })
                          addPnotify()
                          router.push('/cart') // 導向購物車頁面
                        } else {
                          toast.error('請選擇至少 1 件商品', {
                            style: {
                              border: '1.2px solid #f44336',
                              padding: '12px 40px',
                              color: '#f44336',
                            },
                            iconTheme: {
                              primary: '#f44336',
                              secondary: '#fff',
                            },
                          })
                        }
                      }}
                    >
                      <FaShoppingBag className={styles['icon']} />
                      立即購買
                    </button>
                  </>
                ) : (
                  <button className={`${styles['out-of-stock-button']} h6 btn-secondary`} 
                  disabled
                  style={{ backgroundColor: '#797d66', color: '#ffffff', border: 'none' }}
                  >
                    缺貨
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 導覽行區域 */}
      <div className={styles['nav-section-bg']}> {/* 外層的灰色背景區域 */}
        <div className={`${styles['detail-lowercontainer']} container mt-5`}>
        <Tab.Container defaultActiveKey="description" onSelect={handleTabSelect}>
            <div className={`${styles['post-navbar']} border-bottom`}>
              <Nav variant="underline" className={`justify-content-center ${styles['post-nav']}`}>
                <Nav.Item className={styles['nav-item']}>
                  <Nav.Link eventKey="description" className={`${styles['nav-link']} ${styles['custom-link']} h5`}>
                    商品描述
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className={styles['nav-item']}>
                  <Nav.Link eventKey="reviews" className={`${styles['nav-link']} ${styles['custom-link']} h5`}>
                    顧客評論
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            <Tab.Content className="mt-4">
              <Tab.Pane eventKey="description">
                <div className={styles['description-content']}>
                  <div className={styles['description-content-context']}>{selectedProduct.description}</div>
                  <div className={styles['description-content-imgs']}>
                    {selectedProductImages.map((image, index) => (
                      <Image
                        key={index}
                        width={528}
                        height={528}
                        src={`/product/info/${image}`}
                        alt={`Product Info Image ${index + 1}`}
                        className={styles['image']}
                      />
                    ))}
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="reviews">
                <div className={styles['reviews-content']}>
                              <div className={styles['reviews-content']}>
                  <CommentBoard 
                    orderItemId={orderItemId}
                    productId={selectedProduct.product_id} 
                    productImage={selectedProduct.mainimage}
                    colorId={selectedProduct.color_id} 
                    brand={selectedProduct.brand} 
                    productName={selectedProduct.product_name} 
                    colorName={selectedProduct.color_name} 
                    animateChart={animateChart} // 傳遞動畫狀態
                  />
                </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

