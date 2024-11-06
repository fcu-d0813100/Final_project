import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Styles from '@/components/activity/page/activity-list/index.module.scss'

export default function ListMonthBtn() {
  const [active, setActive] = useState([])
  const router = useRouter()

  // 函數來根據月份篩選活動數據
  const fetchActivitiesByMonth = async (month) => {
    try {
      // 清空 active 陣列
      setActive([])

      // 構建請求 URL，當 month 為 null 時，請求所有活動
      const url = month
        ? `http://localhost:3005/api/activity?month=${month}`
        : `http://localhost:3005/api/activity`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('網路回應不成功：' + response.status)
      }
      const data = await response.json()
      setActive(data) // 更新活動數據
      console.log(data)
      // 更新 URL 查詢參數
      router.push(`/activity${month ? `?month=${month}` : ''}`, undefined, {
        shallow: true,
      })
    } catch (err) {
      console.error('資料庫查詢失敗:', err)
    }
  }

  // 初始加載所有活動
  useEffect(() => {
    const month = router.query.month ? parseInt(router.query.month) : null
    fetchActivitiesByMonth(month) // 初次加載時根據 URL 查詢參數篩選活動
  }, [router.query.month]) // 當 URL 中的 month 參數改變時，重新加載活動

  return (
    <>
      <div className={`${Styles['act-sec1']} container d-none d-lg-block`}>
        <div className={`${Styles['act-month-button']} d-none d-lg-block`}>
          <ul className="d-flex justify-content-around">
            {/* "ALL" 按鈕 */}
            <li>
              <a href="#" onClick={() => fetchActivitiesByMonth(null)}>
                ALL
              </a>
            </li>
            {/* 1 到 12 月的按鈕 */}
            {[...Array(12)].map((_, i) => (
              <li key={i}>
                <a href="#" onClick={() => fetchActivitiesByMonth(i + 1)}>
                  {i + 1} 月
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
