import styles from '@/components/activity/common/ListMobileCard/index.module.scss'
import Link from 'next/link'
import {
  PiArrowRight,
  PiHeartStraight,
  PiHeartStraightFill,
} from 'react-icons/pi'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function ActMobileCard({
  id = '',
  imgCover = '',
  CHNname = '',
  ENGname = '',
  beginDate = '',
  endDate = '',
  status = '',
  isFavorite = false,
  onToggleFavorite = () => {},
}) {
  const [favorite, setFavorite] = useState(isFavorite)

  useEffect(() => {
    setFavorite(isFavorite) // 同步父组件传递的状态
  }, [isFavorite])

  const toggleHeart = () => {
    const newFavoriteState = !favorite
    setFavorite(newFavoriteState)
    onToggleFavorite(id, newFavoriteState) // 回调传递新状态
  }

  return (
    <div className={`${styles.workshop} p-0`}>
      <div className={styles.workshopImg}>
        <Image
          height={615}
          width={480}
          className={styles.coverImg}
          src={imgCover}
          alt={`${CHNname} 的图片`}
        />
      </div>
      <div className={styles.wInformation}>
        <div className={styles.innerText}>
          <div>
            <h4
              className={`h5 ${styles.wTitle} d-flex align-items-center justify-content-between`}
            >
              {CHNname}
              <div
                className={styles['heart-icon']}
                onClick={toggleHeart}
                aria-label={favorite ? '取消收藏' : '添加收藏'}
              >
                {favorite ? (
                  <PiHeartStraightFill
                    size={22}
                    className={styles['ph-heart']}
                  />
                ) : (
                  <PiHeartStraight size={22} className={styles['ph-heart']} />
                )}
              </div>
            </h4>
          </div>
          <div className={styles.wDetail}>
            <p className="p mb-2">{ENGname}</p>
            <h6 className="p mb-3">
              活動時間
              <br />
              {beginDate} - {endDate}
            </h6>
            <div className={styles.wStatus}>
              <p
                className={`ps ${
                  status === '已截止' ? styles.over : styles.nowOpen
                }`}
              >
                {status}
              </p>
              <div className={styles.more}>
                <h6 className="h6">MORE</h6>
                <Link href={`/activity/activity-det?id=${id}`}>
                  <PiArrowRight className={`${styles.phArrow} ms-2`} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
