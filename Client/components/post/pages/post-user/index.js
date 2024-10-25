import React, { useState, useEffect } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.scss';
import { PiNotePencilBold } from 'react-icons/pi';

import PublishCard from '@/components/post/common/publish-card';
import WallCard from '@/components/post/common/wall-card';
export default function Index(props) {
  return (
    <>
      <div className={styles['member-post']}>
        <div className={styles['post-section']}>
          <div className={styles['post-title']}>
            <span className="h3">我的貼文</span>
            <span className="h1-L">My Post</span>
          </div>
          <div className={styles['post-content']}>
            <Tab.Container defaultActiveKey="/home">
              <div className={styles['post-navbar']}>
                <Nav
                  variant="underline"
                  className={`${styles['post-nav']} ${styles['h6']}`}
                >
                  <Nav.Item className={`${styles['nav-link']} `}>
                    <Nav.Link eventKey="/home">已發布</Nav.Link>
                  </Nav.Item>
                  <Nav.Item className={`${styles['nav-link']} `}>
                    <Nav.Link eventKey="/aa">已收藏</Nav.Link>
                  </Nav.Item>
                </Nav>

                <button className={styles['post-add']}>
                  <PiNotePencilBold size={30} />
                  <span>建立</span>
                </button>
              </div>
              <Tab.Content>
                <Tab.Pane eventKey="/home">
                  <div className={styles['post-all']}>
                    <PublishCard />
                    {/* <div className={styles['post-card3']}>
                      <Image
                        src="/post/p2_1.webp"
                        alt=""
                        width={200}
                        height={200}
                      />

                      <div className={styles['post-info']}>
                        <div className={styles['post-info-main']}>
                          <div
                            className={`${styles['post-main-title']} ${styles['h5']}`}
                          >
                            #分享 NARS 入坑戰利品坑戰利品坑戰利品
                            <div className={styles['ps']}>
                              <button>編輯</button>
                              <button>刪除</button>
                            </div>
                          </div>
                          <div className={styles['post-main-content']}>
                            1. 裸光蜜粉餅-小白餅 4. 眼影打底筆 megapx
                            這支是為了湊到$3900才買的......櫃姐說是明星商品
                            可以遮眼周暗沉、讓眼影更顯色和更持妝
                            想說我蠻常畫眼影的 也許可以入手玩看看～
                          </div>
                        </div>
                        <div className={styles['post-info-others']}>
                          <div className={styles['post-icon']}>
                            <div className={styles['post-icons-like']}>
                              <FgThumbsUp size={24} />
                              <span>10</span>
                            </div>
                            <div className={styles['post-icons-reply']}>
                              <PiChatCircle size={24} />
                              <span>0</span>
                            </div>
                          </div>
                          <div className={styles['post-date']}>
                            <span>2024-06-11 18:45</span>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    <div className={styles['pagination']}></div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="/aa">
                  <WallCard />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </div>
      </div>
    </>
  );
}
