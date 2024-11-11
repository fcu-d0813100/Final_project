import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
// import { useAction } from '@/hooks/post/use-action'
// import { useCard } from '@/hooks/post/use-card'
import { FgThumbsUp, FgThumbUpFill } from '@/components/icons/figma'
import PostIcon from '../post-icon'

import styles from './index.module.scss'
export default function WallCard({
  postId,
  href,
  imageSrc,
  title,
  avatarSrc,
  username,
  likeCount,
}) {
  // const { liked, likeToggle } = useAction(postId, {
  //   fetchLike: true,
  //   fetchSave: true,
  // })
  // const { wallCard, fetchWallPosts, updateLikeCount } = useCard()
  // const [likeCount, setLikeCount] = useState(initialLikeCount)
  return (
    <>
      <div className={styles['post-card1']}>
        <div className={styles['post-img']}>
          <Link href={href || '/'}>
            <Image
              src={imageSrc || '/post/user-img.png'}
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
          </Link>
        </div>
        <div className={styles['post-title']}>{title}</div>
        {/* <div className={styles['post-info']}>
          <div className={styles['post-info-user']}>
            <Image src={avatarSrc} width={24} height={24} alt="User avatar" />
            <p className="p">{username}</p>
          </div>
          <div className={styles['post-info-like']}>
            <PostIcon
              postId={postId}
              icon="like"
              count={likeCount}
              initialToggled={liked}
              onToggle={likeToggle}
            />
          </div>
        </div> */}
      </div>
    </>
  )
}
