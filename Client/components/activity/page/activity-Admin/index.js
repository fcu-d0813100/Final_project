import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { PiPlus } from 'react-icons/pi'
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './index.module.scss'
import UserCard from '../../common/userCard'
import Sidebar from '@/components/admin/common/admin-side-bar'
import UserTitle from '@/components/user/common/user-title'
import AdminTitle from '@/components/admin/common/admin-title'

export default function Index() {
  const [activities, setActivities] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const activitiesPerPage = 7

  // Fetch data from the API
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

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  return (
    <>
      <AdminTitle/>

      <div className={styles['user-section']}>
        <Sidebar />
        <div className={styles['any-section']}>
          <UserTitle CN="活動管理" ENG="Activity Management" />

          <div className={`${styles['card-Area']} d-flex mt-5 flex-wrap`}>
            <Link href="/admin/activity/upload">
              <button className={`${styles['new-act']} mt-5 me-5`}>
                <div className="text-center">
                  <PiPlus className={styles.plus} />
                  <p className={`${styles.picUploadText} h4 mt-3`}>新增活動</p>
                </div>
              </button>
            </Link>

            {currentActivities.map((activity) => (
              <UserCard
                key={activity.id}
                title={activity.CHN_name}
                subtitle={activity.ENG_name}
                date={`${activity.start_at} - ${activity.end_at}`}
                image={`http://localhost:3005/upload/activity/${activity.img1}`}
                id={activity.id}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* 控制page*/}
          <div
            className="d-flex justify-content-center
           align-items-center gap-5  mt-5"
          >
            <button
              onClick={handlePrevPage}
              className="btn btn-dark"
              disabled={currentPage === 1}
            >
              上一頁
            </button>
            <p>
              第 {currentPage} 頁，共 {totalPages} 頁
            </p>
            <button
              onClick={handleNextPage}
              className="btn btn-dark"
              disabled={currentPage === totalPages}
            >
              下一頁
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
