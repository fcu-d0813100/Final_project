import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PiChatCircle } from 'react-icons/pi';
import { FgThumbsUp, FgThumbUpFill } from '@/components/icons/figma';
import styles from './index.module.scss';
export default function Index(props) {
  return (
    <>
      <div className={styles['post-card3']}>
        <Image src="/post/p2_1.webp" alt="" width={200} height={200} />

        <div className={styles['post-info']}>
          <div className={styles['post-info-main']}>
            <div className={`${styles['post-main-title']} ${styles['h5']}`}>
              #分享 NARS 入坑戰利品坑戰利品坑戰利品
              <div className={styles['ps']}>
                <button>編輯</button>
                <button>刪除</button>
              </div>
            </div>
            <div className={styles['post-main-content']}>
              1. 裸光蜜粉餅-小白餅 4. 眼影打底筆 megapx
              這支是為了湊到$3900才買的......櫃姐說是明星商品
              可以遮眼周暗沉、讓眼影更顯色和更持妝 想說我蠻常畫眼影的
              也許可以入手玩看看～
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
      </div>
    </>
  );
}
