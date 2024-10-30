import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tab, Nav } from 'react-bootstrap';
import { PiNotePencilBold } from 'react-icons/pi';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.scss';
import UserSection from '@/components/user/common/user-section'
import PublishCard from '@/components/post/common/publish-card';
import WallCard from '@/components/post/common/wall-card';
export default function Index(props) {
  return (
    <>
      <UserSection titleCN="我的貼文" titleENG="My Post">
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

                  <Link
                    href="/user/post/create"
                    passHref
                    className={styles['post-add']}
                  >
                    <PiNotePencilBold size={30} />
                    <span>建立</span>
                  </Link>
                </div>
                <Tab.Content>
                  <Tab.Pane eventKey="/home">
                    <div className={styles['publish-all']}>
                      <PublishCard />
                      <div className={styles['pagination']}></div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="/aa">
                    <div className={styles['save-all']}>
                      <WallCard
                        imageSrc="/post/p1_1.webp"
                        title="近期愛用的粉底! 一整天都不會脫妝RS入坑戰利品"
                        username="Cleo"
                        avatarSrc="/post/p1_1.webp"
                        likeCount={22}
                      />
                      <WallCard
                        imageSrc="/post/p2_1.webp"
                        title="新的遮瑕膏測評! 遮瑕力超強"
                        username="Anna"
                        avatarSrc="/post/p2_avatar.webp"
                        likeCount={15}
                      />
                      <WallCard
                        imageSrc="/post/p1_1.webp"
                        title="近期愛用的粉底! 一整天都不會脫妝RS入坑戰利品"
                        username="Cleo"
                        avatarSrc="/post/p1_1.webp"
                        likeCount={22}
                      />
                      <WallCard
                        imageSrc="/post/p2_1.webp"
                        title="新的遮瑕膏測評! 遮瑕力超強"
                        username="Anna"
                        avatarSrc="/post/p2_avatar.webp"
                        likeCount={15}
                      />
                      <WallCard
                        imageSrc="/post/p2_1.webp"
                        title="新的遮瑕膏測評! 遮瑕力超強"
                        username="Anna"
                        avatarSrc="/post/p2_avatar.webp"
                        likeCount={15}
                      />
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
      </UserSection>
      
    </>
  );
}
