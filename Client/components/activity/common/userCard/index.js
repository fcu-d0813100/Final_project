import React from 'react'
import Image from 'next/image'
import Styles from '@/components/activity/common/userCard/index.module.scss'
import Link from 'next/link'

export default function UserCard(props) {
  return (
    <div className={Styles['card']}>
      <div className={Styles['card-img']}>
        <Image
          src={'/activity/YSL4_1.png'}
          width={300}
          height={400}
          style={{ objectFit: 'cover' }}
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

      {/* 添加编辑和删除按钮 */}
      <div className={Styles['action-buttons']}>
        <Link href="/admin/activity/edit">
          <button className={Styles['edit-button']}>編輯</button>
        </Link>

        <button className={Styles['delete-button']}>刪除</button>
      </div>
    </div>
  )
}
