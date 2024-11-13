import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // 引入 useRouter
import { Tab, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.scss';
import UserSection from '@/components/user/common/user-section';
import { useFavorite } from '@/hooks/use-favorite';
import Image from 'next/image';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCartProduct } from '@/hooks/use-cartP';
import toast from 'react-hot-toast';

export default function Index() {
  const { favoritesList, handleFavoriteClick, favoriteProducts } = useFavorite(); // 使用收藏鉤子
  const hasFavorites = favoritesList.length > 0; // 判斷是否有收藏商品
  const { onAddProductMany } = useCartProduct();
  const router = useRouter(); // 初始化 useRouter
  const addPnotify = () =>
    toast.success('新增1件商品', {
      style: { border: '1.2px solid #90957a', padding: '12px 40px', color: '#626553' },
      iconTheme: { primary: '#626553', secondary: '#fff' },
    });

  // 處理商品卡片點擊事件，跳轉到商品細節頁
  const handleCardClick = (color_id) => {
    router.push(`/product/product-list/${color_id}`);
  };

  return (
    <>
      <UserSection titleCN="我的收藏" titleENG="favorite">
        <Tab.Container defaultActiveKey="/pdlike">
          <div className={styles['post-navbar']}>
            <Nav variant="underline" className={`${styles['nav-item']} h6`}>
              <Nav.Item className={`${styles['nav-link']} `}>
                <Nav.Link className={`${styles['link-style']} `} eventKey="/pdlike">
                  最愛商品
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className={`${styles['nav-link']} `}>
                <Nav.Link className={`${styles['link-style']} `} eventKey="/classlike">
                  課程追蹤
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <Tab.Content>
            {/* 最愛商品區域 */}
            <Tab.Pane eventKey="/pdlike">
              {hasFavorites ? (
                <div className={`${styles['row']} ${styles['product-card-container']}`} id="product-card-container">
                  {favoritesList.map((product) => (
                    <div
                      key={product.color_id}
                      className={`${styles['product-card-w']} col-6 col-md-4 col-lg-3 text-center mb-5`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleCardClick(product.color_id)} // 點擊卡片跳轉到商品詳細頁
                    >
                      <div className={styles['info']}>
                        <div className={`${styles['product-new-w']} d-inline-block p5`}>NEW</div>
                        <div className={`${styles['product-sale-w']} d-inline-block p5`}>SALE</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // 阻止事件冒泡到卡片點擊事件
                          handleFavoriteClick(product);
                        }}
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
                            e.stopPropagation();
                            onAddProductMany(product);
                            addPnotify();
                          }}
                        >
                          加入購物車
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // 沒有收藏商品時顯示的內容
                <>
                  <div className={`row ${styles.line}`}>
                    <div
                      className={`col-12 ${styles['favorite-area']} d-flex justify-content-center align-items-center`}
                    >
                      <h5 className="h5">目前沒有收藏商品</h5>
                    </div>
                    <div className="col-12 d-flex justify-content-center align-items-center mt-5">
                      <h5 className="p">點擊愛心按鈕，將喜歡的商品加入收藏</h5>
                    </div>
                    <div className="col-12 d-flex justify-content-center align-items-center mt-5">
                      <Link href="/product/product-list" passHref>
                        <button className="btn-primary h6">前往收藏</button>
                      </Link>
                    </div>
                  </div>
                  <div className={`row ${styles.interested}`}>
                    <h6 className="h4">猜你可能感興趣</h6>
                    {/* 此處可以加上猜你可能感興趣的商品展示 */}
                  </div>
                </>
              )}
            </Tab.Pane>

            {/* 課程追蹤區域 */}
            <Tab.Pane eventKey="/classlike">
              <div className={`row ${styles.line}`}>
                <div
                  className={`col-12 ${styles['favorite-area']} d-flex justify-content-center align-items-center`}
                >
                  <h5 className="h5">目前沒有收藏課程</h5>
                </div>
                <div className="col-12 d-flex justify-content-center align-items-center mt-5">
                  <h5 className="p">點擊愛心按鈕，將喜歡的課程加入收藏</h5>
                </div>
                <div className="col-12 d-flex justify-content-center align-items-center mt-5">
                  <Link href="/workshop" passHref>
                    <button className="btn-primary h6">前往收藏</button>
                  </Link>
                </div>
              </div>
              <div className={`row ${styles.interested}`}>
                <h6 className="h4">猜你可能感興趣</h6>
                {/* 此處可以加上猜你可能感興趣的課程展示 */}
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </UserSection>
    </>
  );
}
