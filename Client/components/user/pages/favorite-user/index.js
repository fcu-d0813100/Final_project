import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tab, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.scss';
import UserSection from '@/components/user/common/user-section'
export default function Index(props) {
  return (
    <>
      <UserSection titleCN="我的收藏" titleENG="favorite">
        <div class="container container-user d-flex justify-content-center align-items-center p">

          <Tab.Container defaultActiveKey="/pdLike">
            <div className={styles['post-navbar']}>
              <Nav
                variant="underline"
                className={`${styles['post-nav']} ${styles['h6']}`}
              >
                <Nav.Item className={`${styles['nav-link']} `}>
                  <Nav.Link eventKey="/pdlike">最愛商品</Nav.Link>
                </Nav.Item>
                <Nav.Item className={`${styles['nav-link']} `}>
                  <Nav.Link eventKey="/classlike">課程追蹤</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            <Tab.Content>
              <Tab.Pane eventKey="/pdlike">
                <div className={`row ${styles.line}`}>
                  <div className={`col-12 ${styles['favorite-area']}`}>
                    <h5 className="h5">目前沒有收藏商品</h5>
                  </div>
                  <div className="col-12 d-flex justify-content-center align-items-center mt-5">
                    <h5 className="p">點擊愛心按鈕，將喜歡的商品加入收藏</h5>
                  </div>
                  <div className="col-12 d-flex justify-content-center align-items-center mt-5">
                    <button className="btn-primary h6">前往收藏</button>
                  </div>
                </div>
                <div className={`row ${styles.interested}`}>
                  <h6 className="h4">猜你可能感興趣</h6>
                </div>
              </Tab.Pane>




              <Tab.Pane eventKey="/classLike">

              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </UserSection>

    </>
  );
}
