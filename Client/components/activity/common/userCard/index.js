import React, { useState } from 'react'
import Image from 'next/image'
import Styles from '@/components/activity/common/userCard/index.module.scss'
import { ST } from 'next/dist/shared/lib/utils'

export default function userCard(props) {
  return (
    <>
      <div className={Styles['card']}>
        <div className={`${Styles['card-img']}`}>
          <Image
            src={'/activity/YSL4_1.png'}
            width={300}
            height={400}
            objectFit="cover" // 確保圖片比例，避免溢出
            alt="YSL4_1"
          />
        </div>

        <div className={Styles['card-content']}>
          <p className={Styles['title']}>活動日期</p>
          <p className={Styles['card-date']}>113-11-16~113-11-17</p>
          <p className={Styles['title']}>活動名稱</p>
          <p className={Styles['eng']}>YSL BEAUTY LIGHT CLUB</p>
          <p className={Styles['chn']}>奢光派對</p>
        </div>
      </div>
    </>
  )
}
