import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './index.module.scss'

import Sidebar from '@/components/activity/common/Sidebar'
import UserTitle from '@/components/user/common/user-title'
import Pagination from '@/components/shared/pagination'
import { PiArrowRight } from 'react-icons/pi'
import Image from 'next/image'
import { useAuth } from '@/hooks/use-auth'
import DeleteModal from '@/components/shared/modal-delete'
import AdminTitle from '@/components/admin/common/admin-title'
import AdminSideBar from '@/components/activity/common/admin-side-bar'
export default function Index({ children, titleCN, titleENG }) {
  const [activities, setActivities] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const activitiesPerPage = 6
  const [showModal, setShowModal] = useState(false)
  const { auth } = useAuth()
  const userId = auth.userData.id
  //活動刪除
  const deleteAct = async (id) => {
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
        setActivities((prevActivities) =>
          prevActivities.filter((activity) => activity.id !== id)
        )
        setShowModal(false)
      } else {
        alert('刪除失敗1，請稍後再試！')
      }
    } catch (err) {
      alert('刪除失敗，請稍後再試！')
    }
  }
  // 抓取活動進來
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://localhost:3005/api/activity/${userId}'
        )
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }
        const data = await response.json()
        setActivities(data)
      } catch (error) {
        console.error('Failed to fetch activities:', error)
      }
    }
    fetchData()
  }, [])
  const handleDelete = (deletedId) => {
    setActivities((prevActivities) =>
      prevActivities.filter((act) => act.id !== deletedId)
    )
  }
  // Pagination Logic
  const indexOfLastActivity = currentPage * activitiesPerPage
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage
  const currentActivities = activities.slice(
    indexOfFirstActivity,
    indexOfLastActivity
  )

  const totalPages = Math.ceil(activities.length / activitiesPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    console.log(`切換到頁碼: ${page}`)
  }

  return (
    <>
      <header
        className={`${styles.header} d-flex justify-content-between align-items-center px-5`}
      >
        <div className={`${['h3-L']}`}>Beautique</div>
        <div className="h5">Admin</div>
        <div></div>
      </header>
      <div className={styles['user-section']}>
        <AdminSideBar />

        <div className={styles['any-section']}>
          <UserTitle CN="活動管理" ENG="Activity Management" />

          <div className={`${styles['newAct']} `}>
            <Link href="/admin/activity/upload">
              <button className="btn btn-primary">新增活動</button>
            </Link>
          </div>

          <div className={`${styles['card-Area']} d-flex  flex-wrap`}>
            {currentActivities.map((item) => (
              <div key={item.id} className={`${styles.fav} col-4 mt-5`}>
                <div className={`${styles.workshop} p-0`}>
                  {/* 編輯與刪除按鈕 */}
                  <div className={styles['action-buttons']}>
                    <Link href={`/admin/activity/edit?id=${item.id}`}>
                      <button className={styles['edit-button']}>編輯</button>
                    </Link>
                    <button
                      className={styles['delete-button']}
                      onClick={() => setShowModal(true)} // 僅顯示模態框
                    >
                      刪除
                    </button>
                    <DeleteModal
                      title="刪除活動"
                      content={`確定要刪除「${item.CHN_name}」這則活動嗎？`}
                      btnConfirm="確定刪除"
                      btnCancel="取消"
                      ConfirmFn={() => deleteAct(item.id)} // 在確認按鈕中執行刪除
                      show={showModal}
                      handleClose={() => setShowModal(false)} // 關閉模態框
                    />
                  </div>

                  {/* 活動圖片 */}
                  <div className={styles.workshopImg}>
                    <Image
                      layout="responsive"
                      width={480}
                      height={615}
                      className={styles.coverImg}
                      src={`http://localhost:3005/upload/activity/${item.img1}`}
                      alt={`${item.CHN_name} 的圖片`}
                    />
                  </div>

                  {/* 活動資訊 */}
                  <div className={styles.wInformation}>
                    <div className={styles.innerText}>
                      <h4
                        className={`h5 ${styles.wTitle} d-flex align-items-center justify-content-between`}
                      >
                        {item.CHN_name}
                      </h4>
                      <div className={styles.wDetail}>
                        <p className="p mb-2">{item.ENG_name}</p>
                        <h6 className="p mb-3">
                          活動時間
                          <br />
                          {item.start_at} - {item.end_at}
                        </h6>
                        <div className={styles.wStatus}>
                          <p
                            className={`ps ${
                              item.status === '已截止'
                                ? styles.over
                                : styles.nowOpen
                            }`}
                          >
                            {item.status}
                          </p>
                          <Link href={`/activity/activity-det?id=${item.id}`}>
                            <div className={styles.more}>
                              <h6 className="h6">MORE</h6>
                              <PiArrowRight
                                className={`${styles.phArrow} ms-2`}
                              />
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  )
}
