import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PiChatCircle } from 'react-icons/pi';
import { FgThumbsUp, FgThumbUpFill } from '@/components/icons/figma';

import styles from './index.module.scss';
export default function Index({
  imageSrc,
  title,
  avatarSrc,
  username,
  likeCount,
}) {
  return (
    <>
      <div className={styles['post-card1']}>
        <div className={styles['post-img']}>
          <Image
            src={imageSrc}
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
        <div className={styles['post-title']}>{title}</div>
        <div className={styles['post-info']}>
          <div className={styles['post-info-user']}>
            <Image src={avatarSrc} width={24} height={24} alt="User avatar" />
            <p className="p">{username}</p>
          </div>
          <div className={styles['post-info-like']}>
            <FgThumbsUp />
            <p className="p">{likeCount}</p>
          </div>
        </div>
      </div>
    </>
  );
}
