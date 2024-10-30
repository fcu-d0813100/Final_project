import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PiNotePencilBold } from 'react-icons/pi';
import { PiMagnifyingGlass } from 'react-icons/pi';
import Header from '@/components/home/common/header';
import WallCard from '@/components/post/common/wall-card';

import styles from './index.module.scss';
export default function PostWall(props) {
  return (
    <>
      <Header />
      <div className={styles['post-banner']}>
        <div className={styles['post-banner-text']}>
          <span>— Share & Save —</span>
          <span>Share Your Insights & Save for Later</span>
        </div>
      </div>
      <section className={styles['post-section']}>
        <div className={styles['post-navbar']}>
          <div className={styles['post-nav']}>
            <Link className={styles['post-add']} href={'/user/post/create'}>
              <PiNotePencilBold size={22} />
              <span>建立</span>
            </Link>
            <div className={styles['post-search']}>
              <input type="text" placeholder="任意關鍵字｜" />
              <PiMagnifyingGlass size={22} />
            </div>
          </div>
          <div className={styles['post-filter']}>
            <button>熱門</button>
            <div className={styles['filter-line']}></div>
            <button>最新</button>
          </div>
        </div>
        <WallCard
          imageSrc="/post/p1_1.webp"
          title="新的遮瑕膏測評! 遮瑕力超強"
          username="Anna"
          avatarSrc="/post/user-img.png"
          likeCount={15}
        />
      </section>
    </>
  );
}
