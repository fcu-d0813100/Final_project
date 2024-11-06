import React, { useState } from 'react';
import styles from './ProductPage.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';
import { FaHeart, FaRegHeart, FaMinus, FaPlus, FaChevronUp, FaChevronDown, FaPlusCircle, FaShoppingBag } from 'react-icons/fa';
import { Tab, Nav } from 'react-bootstrap';
import CommentBoard from '@/components/product/common/CommentBoard';

// productPage 此參數，為一個陣列
const ProductPage = ({ productPage }) => {
  console.log("productPage:", productPage);

  if (!productPage || productPage.length === 0) {
    return <div>Loading...</div>; // 確保資料存在後再顯示
  }

  const [quantity, setQuantity] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(productPage[0]); // 預設顯示第一個色號
  const [isFavorite, setIsFavorite] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [startIndex, setStartIndex] = useState(0);

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

  const toggleFavorite = () => setIsFavorite(!isFavorite);

 // 去重的縮圖列表
 const uniqueThumbnails = [...new Map(
  productPage.map((product) => [product.color_id, product]) // 使用 color_id 作為 Map 的 key，去重
).values()];

// 過濾出相同 color_id 的所有介紹圖
const selectedProductImages = productPage
  .filter((product) => product.color_id === selectedProduct.color_id)
  .map((product) => product.info_image);

// 每次顯示 4 張圖片，從 startIndex 開始
const visibleThumbnails = uniqueThumbnails.slice(startIndex, startIndex + 4);

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

  return (
    <div className={styles['product-page']}>
      <div className="container">
        <div className="row justify-content-center">
          {/* 左側縮圖選項 */}
          <div className="col-md-1 mt-5 p-1">
  <div className={styles['thumbnail-gallery']}>
    <button onClick={handlePrev} disabled={startIndex === 0} className={styles['arrow-button']}>
      <FaChevronUp />
    </button>
    {visibleThumbnails.map((product, index) => (
      <Image
        key={product.color_id}
        width={100}
        height={100}
        src={`/product/mainimage/${product.mainimage}`}
        alt={`Thumbnail ${index + 1}`}
        className={`${styles.thumbnail} ${selectedProduct.color_id === product.color_id ? styles['active-thumbnail'] : ''}`}
        onClick={() => setSelectedProduct(product)}
      />
    ))}
    <button onClick={handleNext} disabled={startIndex + 4 >= productPage.length} className={styles['arrow-button']}>
      <FaChevronDown />
    </button>
  </div>
</div>

          {/* 主圖顯示區 */}
          <div className="col-md-6 d-flex justify-content-center">
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
          <div className="col-md-5 mt-2">
            <div className={styles['product-details']}>
              <div className="justify-content-between align-items-center">
                <div className="d-flex align-items-center mb-3 mt-3">
                  <div className="h6">{selectedProduct.brand}</div>
                  <button onClick={toggleFavorite} className={`${styles['favorite-button']} ms-3`}>
                    {isFavorite ? <FaHeart color="#973929" size={24} /> : <FaRegHeart size={24} />}
                  </button>
                </div>
                <h3 className="mb-0">{selectedProduct.product_name}</h3>
              </div>
              <div className={styles['product-details-info']}>
                <p>{`使用方法: ${selectedProduct.usages}`}</p>
                <p>更多詳細資訊</p>
              </div>

              <div className={styles.price}>
                <span className={styles['current-price']}>{`NT$${selectedProduct.price}`}</span>
                <span className={styles['original-price']}>{`NT$${selectedProduct.originalprice}`}</span>
              </div>

              <div className={styles['color-selector']}>
                <span>{`顏色: ${selectedProduct.color_name}`}</span>
                <div className={styles['color-options']}>
                  {[...new Map(
                    productPage
                      .filter((product) => product.product_id === selectedProduct.product_id) // 過濾出相同 product_id 的產品
                      .map((product) => [product.color_id, product]) // 使用 color_id 作為 Map 的 key
                      ).values()] // 獲取唯一的色號
                      .map((product) => (
                      <span
                        key={product.color_id}
                        className={`${styles['color-swatch']} ${selectedProduct.color_id === product.color_id ? styles['active-swatch'] : ''}`}
                        style={{ backgroundColor: product.color }}
                        onClick={() => setSelectedProduct(product)}
                      ></span>
                    ))}
                </div>
              </div>


              <div className={styles['quantity-selector']}>
                <button onClick={handleDecrement} className={`${styles.btnSm} ph`}><FaMinus /></button>
                <span>{quantity}</span>
                <button onClick={handleIncrement} className={`${styles.btnSm} ph`}><FaPlus /></button>
              </div>

              <div className={styles.buttons}>
                <button className={`${styles['add-to-cart']} h6 btn-primary`}>
                  <FaPlusCircle className={styles['icon']} />加入購物車
                </button>
                <button className={`${styles['buy-now']} h6 btn-primary`}>
                  <FaShoppingBag className={styles['icon']} />立即購買
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 導覽行區域 */}
      <div className={styles['nav-section-bg']}> {/* 外層的灰色背景區域 */}
        <div className={`${styles['detail-lowercontainer']} container mt-5`}>
          <Tab.Container defaultActiveKey="description">
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
                  <CommentBoard />
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
