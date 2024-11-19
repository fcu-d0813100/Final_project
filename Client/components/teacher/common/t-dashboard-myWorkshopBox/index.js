'use client'
import DeleteModal from '@/components/shared/modal-delete'
import {
  PiMagnifyingGlass,
  PiCaretDown,
  PiArrowRight,
  PiTrash,
  PiExport,
} from 'react-icons/pi'
import Image from 'next/image'
import styles from '@/components/teacher/common/myworkshop.module.scss'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import ToastSuccess from '@/components/shared/toast-success'

export default function MyWorkshopBox({
  img,
  name,
  start_date,
  end_date,
  price,
  isUpload,
  registration_start,
  registration_end,
  filterStatus,
  id,
  setWorkshop,
}) {
  //----------吐司訊息
  const { upload1Toast } = ToastSuccess({
    message: '課程發布成功',
    functionName: 'upload1Toast', // 動態函數名稱
  })
  const { upload0Toast } = ToastSuccess({
    message: '取消發布成功',
    functionName: 'upload0Toast', // 動態函數名稱
  })
  const { valid0Toast } = ToastSuccess({
    message: '已移至垃圾桶',
    functionName: 'valid0Toast', // 動態函數名稱
  })
  const { valid1Toast } = ToastSuccess({
    message: '已復原課程',
    functionName: 'valid1Toast', // 動態函數名稱
  })
  const { deleteToast } = ToastSuccess({
    message: '已刪除課程',
    functionName: 'deleteToast', // 動態函數名稱
  })

  //------------------------------------------------------------
  const [showModal, setShowModal] = useState(false)
  const [workshopStatus, setWorkshopStatus] = useState(false)

  //發佈課程
  const handleSubmitisUpload1 = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(
        'http://localhost:3005/api/workshop/myWorkshop/isUpload1',
        {
          credentials: 'include',
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isUpload: workshopStatus, id }), // 包含物件格式的 JSON
        }
      )

      if (!response.ok) {
        throw new Error('上傳資料失敗')
      }
      const result = await response.json()
      console.log('上傳成功', result)
    } catch (error) {
      console.error('上傳失敗', error)
    }

    // 即時更新 workshop 狀態
    setWorkshop((prevWorkshops) =>
      prevWorkshops.map((workshop) =>
        workshop.id === id
          ? { ...workshop, isUpload: workshopStatus }
          : workshop
      )
    )

    upload1Toast()
  }

  //取消發佈
  const handleSubmitisUpload0 = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(
        'http://localhost:3005/api/workshop/myWorkshop/isUpload0',
        {
          credentials: 'include',
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isUpload: workshopStatus, id }), // 包含物件格式的 JSON
        }
      )

      if (!response.ok) {
        throw new Error('上傳資料失敗')
      }
      const result = await response.json()
      console.log('上傳成功', result)
    } catch (error) {
      console.error('上傳失敗', error)
    }

    // 即時更新 workshop 狀態
    setWorkshop((prevWorkshops) =>
      prevWorkshops.map((workshop) =>
        workshop.id === id
          ? { ...workshop, isUpload: workshopStatus }
          : workshop
      )
    )
    upload0Toast()
  }

  // 軟刪除（丟垃圾桶）
  const handleSubmitisValid0 = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(
        'http://localhost:3005/api/workshop/myWorkshop/valid0',
        {
          credentials: 'include',
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ valid: workshopStatus, id }), // 包含物件格式的 JSON
        }
      )

      if (!response.ok) {
        throw new Error('上傳資料失敗')
      }
      const result = await response.json()
      console.log('上傳成功', result)
    } catch (error) {
      console.error('上傳失敗', error)
    }

    // 即時更新 workshop 狀態
    setWorkshop((prevWorkshops) =>
      prevWorkshops.map((workshop) =>
        workshop.id === id ? { ...workshop, valid: workshopStatus } : workshop
      )
    )
    valid0Toast()
  }

  // 復原
  const handleSubmitisValid1 = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(
        'http://localhost:3005/api/workshop/myWorkshop/valid1',
        {
          credentials: 'include',
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ valid: workshopStatus, id }), // 包含物件格式的 JSON
        }
      )

      if (!response.ok) {
        throw new Error('上傳資料失敗')
      }
      const result = await response.json()
      console.log('上傳成功', result)
    } catch (error) {
      console.error('上傳失敗', error)
    }

    // 更新頁面上的狀態
    setWorkshop((prevWorkshops) =>
      prevWorkshops.map((workshop) =>
        workshop.id === id ? { ...workshop, valid: 1 } : workshop
      )
    )
    valid1Toast()
  }

  const handleSubmitisDelete = async () => {

    try {
      const response = await fetch(
        'http://localhost:3005/api/workshop/myWorkshop/delete',
        {
          credentials: 'include',
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }), // 刪除時只需傳送 id 即可
        }
      )

      if (!response.ok) {
        throw new Error('刪除資料失敗')
      }
      const result = await response.json()
      console.log('刪除成功', result)

      // 即時更新頁面上的狀態，移除被刪除的工作坊
      setWorkshop((prevWorkshops) =>
        prevWorkshops.filter((workshop) => workshop.id !== id)
      )
    } catch (error) {
      console.error('刪除失敗', error)
    }
    deleteToast()
  }

  //------------------------------------------------------------

  const now = new Date()
  const regStart = new Date(registration_start)
  const regEnd = new Date(registration_end)
  const endDateObj = new Date(end_date.replace(/\//g, '-'))

  let statusText = ''
  let statusClass = ''

  if (isUpload === 0) {
    statusText = '未發布'
    statusClass = styles.unUpload
  } else if (now >= regStart && now <= regEnd) {
    statusText = '報名中'
    statusClass = styles.registering
  } else if (now < regStart) {
    statusText = '即將開課'
    statusClass = styles.prepare
  } else if (now > regEnd && now <= endDateObj) {
    statusText = '已截止'
    statusClass = styles.end
  } else if (now > endDateObj) {
    statusText = '已過期'
    statusClass = styles.expired
  }

  return (
    <>
      <form>
        {showModal && (
          <DeleteModal
            title="刪除課程"
            content={`刪除後將無法恢復，確定要刪除課程資訊嗎 ?`}
            btnConfirm="確定刪除"
            btnCancel="取消"
            ConfirmFn={handleSubmitisDelete} // 直接傳入函式
            show={showModal}
            handleClose={() => setShowModal(false)}
          />
        )}
        <p name="id" className="d-none">
          {id}
        </p>

        <div className={`${styles.workshopArea}`}>
          <div className={`${styles.myWorkshop}`}>
            <div className="d-flex">
              <div className={styles.imgArea}>
                <Image
                  height={190}
                  width={190}
                  className={styles.coverImg}
                  src={img}
                  alt=""
                />
              </div>
              <div className={styles.infoText}>
                <h4 className="h4">{name}</h4>
                <h5 className="h5 mb-1">開課期間</h5>
                <p className="p">
                  {start_date} - {end_date}
                </p>
              </div>
            </div>

            <div className={styles.priceAndStatus}>
              <h4 className="h4 m-0 me-3">NT$ {price}</h4>
              <p className={`ps ${statusClass}`}>{statusText}</p>
            </div>

            <div className="ph d-flex gap-1">
              {filterStatus === 'unpublished' && (
                <>
                  <button
                    title="丟到垃圾桶"
                    className={styles.trash}
                    type="submit"
                    onClick={handleSubmitisValid0}
                  >
                    <PiTrash />
                  </button>
                  <button
                    title="發佈課程"
                    className={styles.upload}
                    type="submit"
                    onClick={handleSubmitisUpload1}
                  >
                    <PiExport className="ph" />
                  </button>
                  <Link
                    href={`/teacher/workshopEdit/${id}`}
                    className={`${styles.editBtn} h6 mx-2 text-decoration-none`}
                  >
                    編輯 <PiArrowRight className={`${styles.arrow} ph ms-2`} />
                  </Link>
                </>
              )}

              {filterStatus === 'trash' && (
                <>
                  <button
                    className={`${styles.editBtn} h6 mx-2 text-decoration-none`}
                    type="submit"
                    title="復原"
                    onClick={handleSubmitisValid1}
                  >
                    復原
                  </button>
                  {/* onClick={handleSubmitisDelete} */}
                  <button
                    className={`${styles.deleteBtn} h6 mx-2 text-decoration-none`}
                    type="button"
                    onClick={() => setShowModal(true)}
                  >
                    永久刪除
                  </button>
                </>
              )}

              {filterStatus === 'published' && (
                <>
                  <button
                    title="丟到垃圾桶"
                    className={styles.trash}
                    type="submit"
                    onClick={handleSubmitisValid0}
                  >
                    <PiTrash />
                  </button>
                  <button
                    title="取消上傳"
                    className={styles.upload}
                    type="submit"
                    onClick={handleSubmitisUpload0}
                  >
                    <PiExport
                      className="ph"
                      style={{ transform: 'rotate(180deg)' }}
                    />
                  </button>
                  <Link
                    href={`/teacher/workshopEdit/${id}`}
                    className={`${styles.editBtn} h6 mx-2 text-decoration-none`}
                  >
                    編輯 <PiArrowRight className={`${styles.arrow} ph ms-2`} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  )
}