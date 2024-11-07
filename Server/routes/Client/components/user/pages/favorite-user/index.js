import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Tab, Nav } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './index.module.scss'
import UserSection from '@/components/user/common/user-section'
export default function Index(props) {
  return (
    <>
      <UserSection titleCN="我的收藏" titleENG="favorite">
        <Tab.Container defaultActiveKey="/pdlike">
          <div className={styles['post-navbar']}>
            <Nav variant="underline" className={`${styles['nav-item']} h6`}>
              <Nav.Item className={`${styles['nav-link']} `}>
                <Nav.Link
                  className={`${styles['link-style']} `}
                  eventKey="/pdlike"
                >
                  最愛商品
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className={`${styles['nav-link']} `}>
                <Nav.Link
                  className={`${styles['link-style']} `}
                  eventKey="/classlike"
                >
                  課程追蹤
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <Tab.Content>
            <Tab.Pane eventKey="/pdlike">
              <div className={`row ${styles.line} `}>
                <div
                  className={`col-12 ${styles['favorite-area']} d-flex justify-content-center align-items-center `}
                >
                  <h5 className="h5">目前沒有收藏商品</h5>
                </div>
                <div className="col-12 d-flex justify-content-center align-items-center mt-5">
                  <h5 className="p">點擊愛心按鈕，將喜歡的商品加入收藏</h5>
                </div>
                <div className="col-12 d-flex justify-content-center align-items-center mt-5">
                  <Link href="/product/home" passHref>
                    <button className="btn-primary h6">前往收藏</button>
                  </Link>
                </div>
              </div>
              <div className={`row ${styles.interested}`}>
                <h6 className="h4">猜你可能感興趣</h6>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="/classlike">
              <div className={`row ${styles.line} `}>
                <div
                  className={`col-12 ${styles['favorite-area']} d-flex justify-content-center align-items-center `}
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
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </UserSection>
    </>
  )
}
