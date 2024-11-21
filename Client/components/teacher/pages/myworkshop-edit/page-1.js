'use client'

import AddWorkshopTime from '@/components/teacher/common/t-dashboard-add-worshopTime'
import TimeSelect from '@/components/teacher/common/t-dashboard-time-select'
import Textarea from '@/components/teacher/common/t-dashboard-textarea-style'
import UploadImg from '@/components/teacher/common/t-dashboard-uploadImg'
import SelectInput from '@/components/teacher/common/t-dashboard-select-input'
import InputStyle from '@/components/teacher/common/t-dashboard-input-style'
import { PiArrowRight, PiX } from 'react-icons/pi'
import DashboardTitle from '@/components/shared/dashboard-title-y'
import styles from '@/components/teacher/common/upload.module.scss'
import timeSelectstyles from '@/components/teacher/common/t-dashboard-add-worshopTime/add-workshopTime.module.scss'
import React, { useState, useEffect } from 'react'

export default function Page1({
  onNextPage,
  setWorkshop,
  timeSchedule,
  setTimeSchedule,
  workshop,
  handleSave,
}) {
  const [modalOpenId, setModalOpenId] = useState(null) // 紀錄哪個 Modal 是開啟的
  const [selectedTime, setSelectedTime] = useState({
    id: '',
    date: '',
    start_time: '',
    end_time: '',
    min_students: '',
    max_students: '',
  })
  const timeOptions = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
  ]

  useEffect(() => {
    // 初始化 timeSchedule 的值，從 workshop 中解析出各項陣列
    const initialTimeSchedule = (
      workshop.dates ? workshop.dates.split(',') : []
    ).map((date, index) => ({
      id: workshop.time_id ? workshop.time_id.split(',')[index] : null,
      date,
      start_time: workshop.start_times
        ? workshop.start_times.split(',')[index].slice(0, 5)
        : '',
      end_time: workshop.end_times
        ? workshop.end_times.split(',')[index].slice(0, 5)
        : '',
      min_students: workshop.min_students
        ? workshop.min_students.split(',')[index]
        : '',
      max_students: workshop.max_students
        ? workshop.max_students.split(',')[index]
        : '',
    }))
    setTimeSchedule(initialTimeSchedule)
  }, [workshop, setTimeSchedule])

  const handleAddTime = (newTime) => {
    setTimeSchedule((prevSchedule) => [
      ...prevSchedule,
      { ...newTime, id: Date.now() },
    ])
  }

  // 處理表單數據變更
  const handleChange = (e) => {
    const { name, value } = e.target
    setWorkshop((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // 新增移除時間的函數
  const handleRemoveTime = (id) => {
    setTimeSchedule((prevSchedule) =>
      prevSchedule.filter((time) => time.id !== id)
    )
  }

  const toggleModal = (id, time = {}) => {
    if (modalOpenId === id) {
      setModalOpenId(null)
    } else {
      setModalOpenId(id)
      setSelectedTime({
        date: time.date || '',
        start_time: time.start_time || '',
        end_time: time.end_time || '',
        min_students: time.min_students || '',
        max_students: time.max_students || '',
      })
    }
  }

  const handleSaveChanges = (id) => {
    setTimeSchedule((prevSchedule) =>
      prevSchedule.map((time) =>
        time.id === id ? { ...time, ...selectedTime } : time
      )
    )
    toggleModal(id)
  }
  //console.log(formData)
  const handleFileChange = (name, file) => {
    setWorkshop((prevData) => ({
      ...prevData,
      [name]: file,
    }))
  }

  // 更新課程類別
  const handleTypeChange = (e) => {
    const { value } = e.target
    // 根據選擇的 value 找到對應的 option 文字
    const selectedOption =
      items.find((item) => item.value === parseInt(value, 10))?.option || '類別'
    console.log('Selected option:', selectedOption)

    setWorkshop((prevData) => ({
      ...prevData,
      type_id: parseInt(value, 10),
      type_name: selectedOption, // 儲存顯示的文字
    }))
  }

  const items = [
    { name: 'type_id', option: '基礎化妝', value: 1 },
    { name: 'type_id', option: '新娘化妝', value: 2 },
    { name: 'type_id', option: '時尚與攝影化妝', value: 3 },
    { name: 'type_id', option: '韓系美妝', value: 4 },
    { name: 'type_id', option: '特效化妝', value: 5 },
    { name: 'type_id', option: '美妝產品知識', value: 6 },
  ]
  // 更新 `workshop` 後印出 檢查
  useEffect(() => {
    console.log('Updated workshop:', workshop)
  }, [workshop])

  return (
    <>
      <div className={styles.main}>
        <DashboardTitle chTitle="課程上架" enTitle="New workshop" />
        <div className={`${styles.section1} d-flex align-items-end`}>
          <UploadImg
            width="445px"
            height="320px"
            bigText="新增封面圖"
            smText="必填"
            name="img_cover"
            initialImage={`http://localhost:3005/workshop/${workshop.img_cover}`} // 傳入現有圖片的 URL
            onFileChange={handleFileChange}
          />

          <div className={`${styles.uploadMainInfo} flex-grow-1`}>
            <div className={styles.subtitle}>
              <h4 className="h4 pb-2 ms-2">主要資訊</h4>
            </div>
            <div className={styles.inputArea}>
              <div className="container d-flex gap-4 mb-3">
                <InputStyle
                  addclass="col-8"
                  forText="name"
                  titleCh="課程名稱"
                  titleEn=" | name"
                  typeText="text"
                  placeholder="請輸入課程名稱"
                  name="name"
                  value={workshop.name}
                  onChange={handleChange}
                />
                <InputStyle
                  addclass="col-4 pe-4"
                  forText="price"
                  titleCh="價錢"
                  titleEn=" | price"
                  typeText="number"
                  placeholder="請填入金額"
                  name="price"
                  value={workshop.price}
                  onChange={handleChange}
                />
              </div>
              <div className="container d-flex gap-4 mb-3">
                <SelectInput
                  initName={workshop.type_name || '類別'} // 顯示選擇的文字
                  addClass="col-5"
                  forText="type_id"
                  titleCh="課程類別"
                  titleEn=" | type"
                  items={items}
                  name="type_id"
                  value={workshop.type_id}
                  onChange={handleTypeChange}
                />

                <InputStyle
                  addclass="col-7 pe-4"
                  forText="address"
                  titleCh="上課地點"
                  titleEn=" | address"
                  typeText="text"
                  placeholder="請填入地址"
                  name="address"
                  value={workshop.address}
                  onChange={handleChange}
                />
              </div>
              <div className="container d-flex align-items-end justify-content-between gap-2">
                <InputStyle
                  addclass="w-100"
                  forText="registration_start"
                  titleCh="報名時間"
                  titleEn=" | registration period"
                  typeText="date"
                  placeholder="Beginning Date"
                  name="registration_start"
                  value={workshop.registration_start}
                  min={new Date().toISOString().split('T')[0]} // 設定最小日期為今天
                  onChange={handleChange}
                />
                <p className="col-1 mx-1 d-flex justify-content-center align-items-center">
                  <PiArrowRight className="ph" />
                </p>

                <InputStyle
                  addclass="w-100"
                  forText="price"
                  titleCh=""
                  titleEn=""
                  typeText="date"
                  placeholder="End Date"
                  name="registration_end"
                  value={workshop.registration_end}
                  min={workshop.registration_start}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="opacity-75" />
        <div className={`${styles.section02}`}>
          <div className={`${styles.workshopDetail} p-5`}>
            <Textarea
              title="課程簡介"
              name="description"
              rows="5"
              width="100%"
              placeholder="最多輸入200字"
              addclass="mb-4"
              value={workshop.description}
              onChange={handleChange}
            />
            <div className="d-flex justify-content-between p-0">
              <Textarea
                title="課程大綱"
                name="outline"
                rows="10"
                width="93%"
                placeholder="最多輸入120字"
                addclass="w-100"
                value={workshop.outline}
                onChange={handleChange}
              />
              <Textarea
                title="注意事項"
                name="notes"
                rows="10"
                width="100%"
                placeholder="最多輸入120字"
                addclass="w-100"
                value={workshop.notes}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <hr className="opacity-75" />
        <div className={`${styles.section03} `}>
          <h4 className="h4 mb-4">開課時程</h4>
          <div className="row row-cols-3">
            {timeSchedule.map((time, index) => (
              <div key={index}>
                <TimeSelect
                  key={time.id}
                  id={time.id}
                  date={time.date.replace(/-/g, '/')}
                  beginTime={time.start_time}
                  endTime={time.end_time}
                  min={time.min_students}
                  max={time.max_students}
                  onClick={() => toggleModal(time.id, time)} // 點擊以打開特定 Modal
                />

                {/* Modal 視窗 */}
                {modalOpenId === time.id && (
                  <button
                    type="button"
                    className={timeSelectstyles.modalOverlay}
                    onClick={() => toggleModal(time.id)}
                  >
                    <button
                      type="button"
                      className={timeSelectstyles.modalContent}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => toggleModal(time.id)}
                        className={`${timeSelectstyles.close} ph`}
                      >
                        <PiX />
                      </button>
                      <h5 className="h5 mb-4">修改課程時間</h5>

                      {/* 表單元素 */}
                      <InputStyle
                        addclass="mb-3"
                        forText="date"
                        titleCh="上課時間"
                        typeText="date"
                        placeholder="請選擇日期"
                        name="date"
                        value={selectedTime.date}
                        min={workshop.registration_end}
                        onChange={(e) =>
                          setSelectedTime({
                            ...selectedTime,
                            date: e.target.value,
                          })
                        }
                      />

                      {/* 開始與結束時間選擇 */}
                      <div className="d-flex align-items-end justify-content-between p-0 mb-3">
                        <SelectInput
                          initName="開始時間"
                          addClass="w-100"
                          forText="start_time"
                          titleCh="時間"
                          items={timeOptions.map((t) => ({
                            name: 'start_time',
                            option: t,
                            value: `${t}`,
                          }))}
                          name="start_time"
                          value={selectedTime.start_time}
                          onChange={(e) =>
                            setSelectedTime({
                              ...selectedTime,
                              start_time: e.target.value,
                            })
                          }
                        />
                        <p className="col-1 d-flex justify-content-center align-items-center">
                          <PiArrowRight className="ph" />
                        </p>
                        <SelectInput
                          initName="結束時間"
                          addClass="w-100"
                          forText="end_time"
                          items={timeOptions.map((t) => ({
                            name: 'end_time',
                            option: t,
                            value: `${t}`,
                          }))}
                          name="end_time"
                          value={selectedTime.end_time}
                          onChange={(e) =>
                            setSelectedTime({
                              ...selectedTime,
                              end_time: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* 最少與最多學生人數 */}
                      <div className="container d-flex align-items-end justify-content-between p-0">
                        <InputStyle
                          addclass="w-100"
                          forText="min_students"
                          titleCh="人數區間"
                          typeText="text"
                          placeholder="最少人數"
                          name="min_students"
                          value={selectedTime.min_students}
                          onChange={(e) =>
                            setSelectedTime({
                              ...selectedTime,
                              min_students: e.target.value,
                            })
                          }
                        />
                        <p className="col-1 d-flex justify-content-center align-items-center">
                          <PiArrowRight className="ph" />
                        </p>
                        <InputStyle
                          addclass="w-100"
                          forText="max_students"
                          typeText="text"
                          placeholder="最多人數"
                          name="max_students"
                          value={selectedTime.max_students}
                          onChange={(e) =>
                            setSelectedTime({
                              ...selectedTime,
                              max_students: e.target.value,
                            })
                          }
                        />
                      </div>

                      <p
                        className={`${timeSelectstyles.note} ps my-3 mb-5 pb-5`}
                      >
                        *少於區間人數將自動通知不開班授課
                      </p>

                      <div className="d-flex justify-content-end pt-4 h6">
                        <button
                          className="btn-danger me-3 w-100"
                          onClick={() => handleRemoveTime(time.id)}
                        >
                          移除
                        </button>
                        <button
                          className="btn-success w-100"
                          onClick={() => handleSaveChanges(time.id)}
                        >
                          確認修改
                        </button>
                      </div>
                    </button>
                  </button>
                )}
              </div>
            ))}
            <AddWorkshopTime
              onAddTime={handleAddTime}
              workshopIdVal={workshop.id}
              registrationEnd={workshop.registration_end}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end mt-2">
          <button
            href={`/teacher/myworkshop`}
            className="btn-secondary h6 me-4"
            type="submit"
            onClick={handleSave}
          >
            取消
          </button>
          <button
            className="btn-danger h6 me-4 ms-auto "
            type="submit"
            onClick={handleSave}
          >
            儲存
          </button>
          <button
            className="btn-primary h6"
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              onNextPage() // 確保點擊時觸發
            }}
          >
            下一步
          </button>
        </div>
      </div>
    </>
  )
}
