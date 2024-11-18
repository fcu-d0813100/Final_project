import styles from '@/components/shared/workshop-card-lg/index.module.scss'
import {
  PiArrowRight,
  PiHeartStraight,
  PiHeartStraightFill,
} from 'react-icons/pi'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useFavoriteWorkshop } from '@/hooks/use-favorite-workshop'
import { CloudFog } from '@phosphor-icons/react/dist/ssr'

export default function WorkshopCardLg({
  wid = '',
  imgCover = '',
  name = '',
  teacher = '',
  beginDate = '',
  endDate = '',
  price = '',
  status = '',
}) {
  const { favoriteWorkshop, handleFavoriteWorkshopClick } =
    useFavoriteWorkshop()

  return (
    <Link href={`/workshop/detail/${wid}`} className={`${styles.workshop} p-0`}>
      <div className={styles.workshopImg}>
        <Image
          height={615}
          width={480}
          className={styles.coverImg}
          src={imgCover}
          alt=""
        />
      </div>
      <div className={styles.wInformation}>
        <div className={styles.innerText}>
          <div>
            <h4
              className={`h4 ${styles.wTitle} d-flex align-items-center justify-content-between`}
            >
              {name}
              {/* 愛心收藏按鈕 */}
              <button
                className={styles.heart}
                onClick={(e) => {
                  e.preventDefault()
                  handleFavoriteWorkshopClick({ workshop_id: wid }) // 傳遞一個包含 workshop_id 的物件
                  console.log('workshop details:', { workshop_id: wid })
                }}
              >
                {favoriteWorkshop[wid] ? (
                  <PiHeartStraightFill color="#973929" className="me-3" />
                ) : (
                  <PiHeartStraight className="me-3" />
                )}
              </button>
            </h4>
          </div>
          <div className={styles.wDetail}>
            <p className="p mb-2">{teacher}</p>
            <h6 className="h6 mb-3">
              開課時間
              <br />
              {beginDate} - {endDate}
            </h6>
            <h4 className="h4 mb-3">NT${price}</h4>
            <div className={styles.wStatus}>
              <p
                className={`ps ${
                  status === '已截止'
                    ? styles.over
                    : status === '報名中'
                    ? styles.opening
                    : styles.prepare
                }`}
              >
                {status}
              </p>
              <div className={styles.more}>
                <h6 className="h6">MORE</h6>
                <PiArrowRight className="ph ms-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
