import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PiChatCircle } from 'react-icons/pi';
import { FgThumbsUp, FgThumbUpFill } from '@/components/icons/figma';

import styles from './index.module.scss';
export default function Index(props) {
  return (
    <>
      <div className={styles['post-card1']}>
        <div className={styles['post-img']}>
          <Image
            src="/post/p1_1.webp"
            alt="share image"
            sizes="100%"
            width={0}
            height={0}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }}
            priority
          />
        </div>
        <div className={styles['post-title']}>
          近期愛用的粉底! 一整天都不會脫妝RS入坑戰利品
        </div>
        <div className={styles['post-info']}>
          <div className={styles['post-info-user']}>
            <Image
              src="/post/p1_1.webp"
              width={24}
              height={24}
              alt="User avatar"
            />
            <p className="p">Cleo</p>
          </div>
          <div className={styles['post-info-like']}>
            <i className="fa-regular fa-heart"></i>
            <p className="p">22</p>
          </div>
        </div>
      </div>
    </>
  );
}
