import React, { useState } from 'react';
import styles from './ProductPage.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';
import { FaHeart, FaRegHeart, FaMinus, FaPlus, FaChevronUp, FaChevronDown, FaPlusCircle, FaShoppingBag } from 'react-icons/fa';
import { Tab, Nav } from 'react-bootstrap';
import CommentBoard from '@/components/product/common/CommentBoard'

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
        <div className= {`${styles['detail-lowercontainer']} container mt-5`}>
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
                  <div className={styles['description-content-context']}>最輕滑保濕的霧面唇膏！
                    革命性「3D半球型微米粉體」打造彷若裸唇最輕柔霧感，保濕全新升級！添加「玻尿酸」長效滋潤雙唇不乾澀。頂級精華注入！黃金玫瑰瞬效複方x玫瑰潤澤唇粹x普拉絲鏈
                    全面修護美唇，柔焦滑順零唇紋
                  </div>
                  <div className={styles['description-content-imgs']}>
                    <Image width={528}
                      height={528}
                      src={'/product/LANCOME_LS01_l_01.jpg'}
                      alt="Main Product"
                      className={styles['image']}>
                    </Image>
                    <Image width={528}
                      height={528}
                      src={'/product/LANCOME_LS01_l_02.jpg'}
                      alt="Main Product"
                      className={styles['image']}>
                    </Image>
                    <Image width={528}
                      height={528}
                      src={'/product/LANCOME_LS01_l_03.jpg'}
                      alt="Main Product"
                      className={styles['image']}>
                    </Image>
                    <Image width={528}
                      height={528}
                      src={'/product/LANCOME_LS01_l_04.jpg'}
                      alt="Main Product"
                      className={styles['image']}>
                    </Image>
                    <Image width={528}
                      height={528}
                      src={'/product/LANCOME_LS01_l_05.jpg'}
                      alt="Main Product"
                      className={styles['image']}>
                    </Image>
                    <div className={styles['description-content-notice']}>
                    <h2>購買與使用美妝產品須知：</h2>
                    <ol>
                      <li>
                        <strong className={styles['notice-title']}>成分過敏測試</strong>
                        <ul>
                          <li>
                            <strong>過敏測試：</strong>在使用新產品前，尤其是敏感肌膚或有過敏史的人，應先進行局部過敏測試。可以少量產品塗在耳後或手腕內側，觀察 24 小時內是否有過敏反應。
                          </li>
                          <li>
                            <strong>避免過敏成分：</strong>注意查看成分表，避免使用自己過敏的成分，例如酒精、香精、人工色素等。
                          </li>
                        </ul>
                      </li>
                      
                      <li>
                        <strong className={styles['notice-title']}>產品的保存期限與保存方式</strong>
                        <ul>
                          <li>
                            <strong>保存期限：</strong>美妝產品有一定的保質期，過期產品的功效可能會下降，甚至可能導致皮膚刺激或感染。在開封前注意查看日期和保存期限，尤其是開封後的使用期限 (PAO, Period After Opening)。
                          </li>
                          <li>
                            <strong>保存方式：</strong>部分產品需避光濕、遠離高溫，例如防曬霜、精華液等應存放在陰涼乾燥處，避免陽光直射。
                          </li>
                        </ul>
                      </li>
                      
                      <li>
                        <strong className={styles['notice-title']}>產品的真偽辨識</strong>
                        <ul>
                          <li>
                            正品產品建議應：應從可信賴的渠道（如品牌官方網站或授權）購買，避免購買假冒商品。假冒產品含有不明成分，對皮膚造成危害。
                          </li>
                          <li>
                            辨別購買來源：注意產品上的防偽標籤或 QR 碼，並可在官網上查詢產品的真偽。
                          </li>
                        </ul>
                      </li>
                    </ol>
                    <p>感謝您的關注，祝您購物愉快！</p>
                    </div>
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
