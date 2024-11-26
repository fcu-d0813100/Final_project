'use client'
import axios from 'axios'
import { PiFolderSimpleDashed } from 'react-icons/pi'
import Dropdown from '@/components/workshop/common/dropdown'
import styles from '@/components/workshop/common/workshops.module.scss'
import WorkshopsBN from '@/components/workshop/common/workshop-bn'
import WorkshopCardLg from '@/components/shared/workshop-card-lg'
import React, { useState, useEffect } from 'react'
import Pagination from '@/components/shared/pagination'

export default function WorkshopAll(props) {
  const [workshop, setWorkshop] = useState([])
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState('3')
  const [typeId, setTypeId] = useState('')
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')
  const [status, setStatus] = useState('')

  const [selectedOrder, setSelectedOrder] = useState('排序')
  const [selectedType, setSelectedType] = useState('類型')
  const [selectedStatus, setSelectedStatus] = useState('狀態')

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const currentItems = workshop.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const filteredWorkshops = workshop.filter((item) => {
    const datesArray = item.dates ? item.dates.split(',') : []
    const endDate =
      datesArray.length > 0 ? new Date(datesArray.slice(-1)[0]) : null

    return !endDate || endDate >= new Date() // 排除已結束的課程
  })

  useEffect(() => {
    fetchData()
  }, [search, order, typeId, min, max, status]) // 更新時重新調用 fetchData

  const fetchData = async () => {
    try {
      // 搜尋所有工作坊或依 `search` 查詢
      const response = await fetch(
        `http://localhost:3005/api/workshop/?search=${search}&order=${order}&type_id=${typeId}&min=${min}&max=${max}&status=${status}`
      )
      if (!response.ok) {
        throw new Error('網路回應不成功：' + response.status)
      }
      const data = await response.json()
      setWorkshop(...data) // 設置工作坊資料
      console.log(...data)
    } catch (err) {
      console.log(err)
    }
  }

  const onSearch = () => {
    fetchData() // 搜尋時觸發獲取新資料
  }

  const getStatus = (registrationStart, registrationEnd) => {
    const currentDate = new Date()
    const startDate = new Date(registrationStart)
    const endDate = new Date(registrationEnd)

    if (currentDate < startDate) {
      return '即將開課' // 時間在 startDate 之前
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return '報名中' // 時間在 startDate 和 endDate 之間
    } else if (currentDate > endDate) {
      return '已截止' // 時間在 endDate 之後
    }
  }

  const onSelectStatus = (value) => {
    setStatus(value) // 設置狀態
    setSelectedStatus(
      value === '' ? '狀態' : getOptionName(value, statusOptions)
    )
    fetchData() // 更新資料
  }

  const onSelectType = (value) => {
    setTypeId(value) // 設置類型
    setSelectedType(value === '' ? '類型' : getOptionName(value, typeOptions))
    fetchData() // 更新資料
  }

  const onSelectOrder = (value) => {
    setOrder(value) // 設置排序
    setSelectedOrder(value === '' ? '排序' : getOptionName(value, orderOptions))
    fetchData() // 更新資料
  }

  // 新增一個輔助函數來根據 value 取得 option 名稱
  const getOptionName = (value, options) => {
    const option = options.find((item) => item.value === value)
    return option ? option.option : ''
  }

  const statusOptions = [
    { option: '狀態', value: '' },
    { option: '即將開課', value: 'prepare' },
    { option: '報名中', value: 'open' },
    { option: '已截止', value: 'closed' },
  ]

  const typeOptions = [
    { option: '類型', value: '' },
    { option: '基礎化妝', value: '1' },
    { option: '新娘化妝', value: '2' },
    { option: '時尚與攝影化妝', value: '3' },
    { option: '韓系美妝', value: '4' },
    { option: '特效化妝', value: '5' },
    { option: '美妝產品知識', value: '6' },
  ]

  const orderOptions = [
    { option: '排序', value: '3' },
    { option: '價錢 高 -- 低', value: '2' },
    { option: '價錢 低 -- 高', value: '1' },
    { option: '最新上架', value: '3' },
  ]

  return (
    <>
      <WorkshopsBN search={search} setSearch={setSearch} onSearch={onSearch} />
      <div className={`${styles.colorArea}`}></div>
      <div className="container">
        <div className={styles.selectBar}>
          <div className="d-flex align-items-center">
            <p className="m-0 me-3 h6 text-dark d-none d-sm-block">日期</p>
            <input
              type="date"
              className={`${styles.searchInput} mx-2`}
              placeholder="開始日期"
              value={min}
              onChange={(e) => {
                setMin(e.target.value) // 設置開始日期
                fetchData() // 更新篩選
              }}
            />
            <p className="text-dark m-0">--</p>
            <input
              type="date"
              className={`${styles.searchInput} mx-2`}
              placeholder="結束日期"
              value={max}
              onChange={(e) => {
                setMax(e.target.value) // 設置結束日期
                fetchData() // 更新篩選
              }}
            />
          </div>

          <div className={`${styles.dropdownArea} d-flex`}>
            <Dropdown
              name={selectedStatus}
              items={statusOptions}
              onSelect={onSelectStatus}
            />

            <Dropdown
              name={selectedType}
              items={typeOptions}
              onSelect={onSelectType}
            />

            <Dropdown
              name={selectedOrder}
              items={orderOptions}
              onSelect={onSelectOrder}
            />
          </div>
        </div>
      </div>

      <div className={`${styles.section03} container`}>
        <div
          className={`${styles.tOwnWorkshops} row row-cols-sm-1 row-cols-md-2 row-cols-xl-3 mt-4 mb-5`}
        >
          {currentItems.length > 0 ? (
            currentItems.map((item) => {
              // 將 dates 字串轉換成陣列
              const datesArray = item.dates ? item.dates.split(',') : []

              // 取得第一個和最後一個日期，並格式化為 YYYY/MM/DD
              const formatDate = (dateString) => {
                const [year, month, day] = dateString.split('-')
                return `${year}/${month}/${day}`
              }

              // 取得第一個和最後一個日期
              const beginDate =
                datesArray.length > 0 ? formatDate(datesArray[0]) : ''
              const endDate =
                datesArray.length > 0
                  ? formatDate(datesArray[datesArray.length - 1])
                  : ''

              // 獲取報名狀態
              const status = getStatus(
                item.registration_start,
                item.registration_end
              )

              // 檢查課程時間結束日期是否已過
              const isEndDatePassed =
                new Date(endDate.replace(/\//g, '-')) < new Date() // 檢查 endDate 是否已過

              // 如果課程時間的 endDate 已過，則不顯示該工作坊
              if (isEndDatePassed) {
                return null // 不顯示該工作坊
              }

              return (
                <WorkshopCardLg
                  key={item.id}
                  wid={item.id}
                  imgCover={`http://localhost:3005/workshop/${item.img_cover}`}
                  name={item.name}
                  teacher={item.teacher_name}
                  beginDate={beginDate}
                  endDate={endDate}
                  price={item.price}
                  status={status}
                />
              )
            })
          ) : (
            <p className={styles.noneWorkshopText}>
              <PiFolderSimpleDashed className={styles.noneWorkshopIcon} />
              <br />
              目前沒有此篩選條件課程
            </p>
          )}
        </div>
        {/* 分頁元件 */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredWorkshops.length / itemsPerPage)}
          onPageChange={(page) => setCurrentPage(page)}
        />
        <div className="my-5 py-1"></div>
      </div>
    </>
  )
}
