import React, { useState } from 'react'
import Image from 'next/image'
import Styles from '@/components/activity/common/userCard/index.module.scss'
import Link from 'next/link'
import DeleteModal from '@/components/shared/modal-delete'

export default function UserCard({
  title,
  subtitle,
  date,
  image,
  id,
  onDelete,
}) {
  const [showModal, setShowModal] = useState(false)

  const deleteAct = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/activity/delete/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      )
      console.log(id)
      if (response.ok) {
        setShowModal(false)
        onDelete(id) // 刪除成功後，呼叫 onDelete 傳遞刪除的 id
      } else {
        alert('刪除失敗1，請稍後再試！')
      }
    } catch (err) {
      alert('刪除失敗，請稍後再試！')
    }
  }

  return (
    <div className={`${Styles['card']} mt-5`}>
      <div className={Styles['card-img']}>
        <Image
          src={image}
          width={300}
          height={400}
          style={{ objectFit: 'cover' }}
          alt={title}
        />
      </div>

      <div className={Styles['card-content']}>
        <p className={Styles['title']}>活動日期</p>
        <p className={Styles['card-date']}>{date}</p>
        <p className={Styles['title']}>活動名稱</p>
        <p className={Styles['eng']}>{subtitle}</p>
        <p className={Styles['chn']}>{title}</p>
      </div>

      {/* 添加编辑和删除按钮 */}
      <div className={Styles['action-buttons']}>
        <Link href={`/admin/activity/edit?id=${id}`}>
          <button className={Styles['edit-button']}>編輯</button>
        </Link>
        <button
          className={Styles['delete-button']}
          onClick={() => setShowModal(true)} // 點擊顯示刪除模態框
        >
          刪除
        </button>

        <DeleteModal
          title="刪除活動"
          content="刪除後將無法恢復，確定要刪除這則活動嗎 ?"
          btnConfirm="確定刪除"
          btnCancel="取消"
          ConfirmFn={deleteAct}
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      </div>
    </div>
  )
}
