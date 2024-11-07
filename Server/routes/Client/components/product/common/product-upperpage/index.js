import React, { useState } from 'react';
import styles from './ProductPage.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';
import { FaHeart, FaRegHeart, FaMinus, FaPlus, FaChevronUp, FaChevronDown, FaPlusCircle, FaShoppingBag } from 'react-icons/fa';
import { Tab, Nav } from 'react-bootstrap';

const ProductPage = () => {
  const [quantity, setQuantity] = useState(0);
  const [selectedImage, setSelectedImage] = useState('/product/LANCOME_LS01_M_196.webp');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => setQuantity(quantity > 1 ? quantity - 1 : 0);

  const thumbnails = [
    '/product/LANCOME_LS01_M_196.webp',
    '/product/LANCOME_LS01_M_218.webp',
    '/product/LANCOME_LS01_M_274.webp',
    '/product/LANCOME_LS01_M_289.webp',
    '/product/LANCOME_LS01_M_299.webp',
    '/product/LANCOME_LS01_M_330.webp',
    '/product/LANCOME_LS01_M_505.webp',
    '/product/LANCOME_LS01_M_888.webp'
  ];

  const colors = ['#91372f', '#9d3e3e', '#af4b46', '#8b3333', '#8c4238'];

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  const visibleThumbnails = thumbnails.slice(startIndex, startIndex + 4);

  const handleNext = () => {
    if (startIndex + 4 < thumbnails.length) {
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
          {/* 左側縮圖 */}
          <div className="col-md-1 mt-5">
            <div className={styles['thumbnail-gallery']}>
              <button onClick={handlePrev} disabled={startIndex === 0} className={styles['arrow-button']}>
                <FaChevronUp />
              </button>
              {visibleThumbnails.map((thumbnail, index) => (
                <Image
                  key={index}
                  width={100}
                  height={100}
                  src={thumbnail}
                  alt={`Thumbnail ${index + 1}`}
                  className={`${styles.thumbnail} ${currentThumbnailIndex === startIndex + index ? styles['active-thumbnail'] : ''}`}
                  onClick={() => {
                    setSelectedImage(thumbnail);
                    setCurrentThumbnailIndex(startIndex + index);
                  }}
                />
              ))}
              <button onClick={handleNext} disabled={startIndex + 4 >= thumbnails.length} className={styles['arrow-button']}>
                <FaChevronDown />
              </button>
            </div>
          </div>

          {/* 主圖 */}
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
                src={selectedImage}
                alt="Main Product"
                className={styles['image']}
              />
              {isZoomed && (
                <div
                  className={styles['zoom-lens']}
                  style={{
                    backgroundImage: `url(${selectedImage})`,
                    backgroundPosition: `-${zoomPosition.x}% -${zoomPosition.y}%`,
                    top: `${zoomPosition.y - 50}px`,
                    left: `${zoomPosition.x - 50}px`,
                  }}
                ></div>
              )}
            </div>
          </div>

          {/* 右側產品詳細資訊 */}
          <div className="col-md-5 mt-2">
            <div className={styles['product-details']}>
              <div className="justify-content-between align-items-center">
                <div className='h6'>LANCOME</div>
                <div className="d-flex align-items-center mb-3 mt-3">
                  <h3 className="mb-0">玲瓏巧思五色眼影盤</h3>
                  <button onClick={toggleFavorite} className={`${styles['favorite-button']} ms-3`}>
                    {isFavorite ? <FaHeart color="#973929" size={24} /> : <FaRegHeart size={24} />}
                  </button>
                </div>
              </div>
              <div className={styles['product-details-info']}>
                <p>使用方法: 塗抹於眼部</p>
                <p>更多詳細資訊</p>
              </div>

              <div className={styles.price}>
                <span className={styles['current-price']}>NT$ 1,200</span>
                <span className={styles['original-price']}>NT$ 1,200</span>
              </div>

              <div className={styles['color-selector']}>
                <span>顏色: 來杯摩卡-01</span>
                <div className={styles['color-options']}>
                  {colors.map((color, index) => (
                    <span key={index} className={styles['color-swatch']} style={{ backgroundColor: color }}></span>
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
        <div className=  'container mt-5'>
          <Tab.Container defaultActiveKey="description">
            <div className={`${styles['post-navbar']} border-bottom`}>
              <Nav variant="underline" className={`justify-content-center ${styles['post-nav']}`}>
                <Nav.Item className={styles['nav-item']}>
                  <Nav.Link eventKey="description" className={`${styles['nav-link']} ${styles['custom-link']}`}>
                    商品描述
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className={styles['nav-item']}>
                  <Nav.Link eventKey="reviews" className={`${styles['nav-link']} ${styles['custom-link']}`}>
                    顧客評論
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            <Tab.Content className="mt-4">
              <Tab.Pane eventKey="description">
                <div className={styles['description-content']}>
                  <h4>商品描述</h4>
                  <p>這裡是商品的詳細描述內容。你可以放置更多文字來描述產品的特點、功能和用途。</p>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="reviews">
                <div className={styles['reviews-content']}>
                  <h4>顧客評論</h4>
                  <p>這裡是顧客評論區域。顯示用戶的評價和反饋，幫助其他用戶了解產品的實際表現。</p>
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
