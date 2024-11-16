'use client'
import styles from '@/components/workshop/common/workshop-detail.module.scss'
import { PiHeartStraight, PiHeartStraightFill } from 'react-icons/pi'
import React, { useState, useEffect } from 'react'
import { useFavoriteWorkshop } from '@/hooks/use-favorite-workshop'

export default function WorkshopAddCartInfo({
  wid = '',
  name,
  registrationStart,
  registrationEnd,
  price,
}) {
  const { favoriteWorkshop, handleFavoriteWorkshopClick } =
    useFavoriteWorkshop()
  return (
    <>
      <div>
        <div className="d-flex">
          <h1 className={`${styles.cName}`}>{name}</h1>
          <p className={`${styles.cDateTime} p`}>
            <span className="fw-semibold">報名時間</span>
            <br />
            {registrationStart} - {registrationEnd}
          </p>
        </div>
        <p className="d-flex align-items-center">
          {/* 愛心收藏按鈕 */}
          <button
            className="border-0 bg-white d-flex align-items-center ph"
            onClick={(e) => {
              e.preventDefault()
              if (wid) {
                handleFavoriteWorkshopClick({ workshop_id: wid })
                // console.log('workshop details:', { workshop_id: wid })
              } else {
                console.error('Error: workshop_id is undefined')
              }
            }}
          >
            {favoriteWorkshop[wid] ? (
              <PiHeartStraightFill color="#973929" />
            ) : (
              <PiHeartStraight />
            )}
          </button>
          {/* <button className="border-0 bg-white d-flex align-items-center ph">
            <PiHeartStraight />
          </button> */}
          加入追蹤清單
        </p>
        <p className={`h3 ${styles.price}`}>NT${price}</p>
      </div>
    </>
  )
}
