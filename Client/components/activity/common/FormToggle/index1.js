import React, { useState, useEffect } from 'react'
import Styles from '@/components/activity/page/activity-det/index.module.scss'
import { useAuth } from '@/hooks/use-auth'
import LoginModal from '@/components/shared/modal-confirm'
import { useRouter } from 'next/router'

export default function FormToggle({ ENG_name, CHN_name, start_at, end_at }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const taiwanPhoneRegex = /^(09\d{8}|0[2-8]-?\d{7,8})$/
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    people: '',
    remark: '',
  })
  const { auth } = useAuth()
  const router = useRouter()
  const userId = auth.userData.id

  const toggleForm = () => {
    if (userId === 0) {
      setShowLoginModal(true) // 如果 userId 是 0，顯示登入模態框
    } else {
      setIsExpanded(!isExpanded) // 否則展開表單
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      date: '',
      people: '',
      remark: '',
    })
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({ ...prevData, [id]: value }))
  }

  const handleSubmit = async () => {
    const { name, phone, date, people, remark } = formData

    if (!name || !phone || !date || people === '請選擇人數') {
      alert('請填寫所有必填字段')
      return
    }

    // 電話號碼正規驗證
    if (!taiwanPhoneRegex.test(phone)) {
      alert('請輸入有效的台灣電話號碼')
      console.log('電話號碼驗證失敗:', phone) // 調試用，檢查電話號碼
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3005/api/activity/activity-reg/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            ENG_name,
            CHN_name,
            name,
            phone,
            date,
            people,
            remark,
          }),
        }
      )

      if (response.ok) {
        alert('報名成功！')
        resetForm()
        setIsExpanded(false)
      } else {
        const errorData = await response.json()
        alert(`報名失敗：${errorData.message || '請稍後再試'}`)
      }
    } catch (error) {
      console.error('報名失敗：', error)
      alert('報名失敗，請稍後再試')
    }
  }

  return (
    <div className={Styles['formArea']}>
      <button onClick={toggleForm} className={Styles['signup-button']}>
        我要報名
      </button>
      <div
        className={`${Styles['form-container']} ${
          isExpanded ? Styles['expanded'] : ''
        }`}
        id="formContainer"
      >
        {isExpanded && (
          <>
            <p className={Styles['form-title']}>活動報名</p>

            <div className={Styles['form-row']}>
              <div className={Styles['form-group']}>
                <div className="d-flex">
                  {' '}
                  <label htmlFor="name">姓名 | name</label>
                  <span className={`d-inline ${Styles['text-red']} ps-1`}>
                    *
                  </span>
                </div>

                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="請輸入姓名"
                />
              </div>
              <div className={Styles['form-group']}>
                <div className="d-flex">
                  <label htmlFor="phone">電話 | phone</label>
                  <span className={`d-inline ${Styles['text-red']} ps-1`}>
                    *
                  </span>
                </div>

                <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="請輸入電話"
                />
              </div>
            </div>
            <div className={Styles['form-row']}>
              <div className={Styles['form-group']}>
                <div className="d-flex">
                  {' '}
                  <label htmlFor="date">報名日期 | date</label>
                  <span className={`d-inline ${Styles['text-red']} ps-1`}>
                    *
                  </span>
                </div>

                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={start_at} // 限制最小日期為活動開始日期
                  max={end_at} // 限制最大日期為活動結束日期
                />
              </div>
              <div className={Styles['form-group']}>
                <div className="d-flex">
                  <label htmlFor="people">參加人數</label>
                  <span className={`d-inline ${Styles['text-red']} ps-1`}>
                    *
                  </span>
                </div>

                <select
                  id="people"
                  value={formData.people}
                  onChange={handleChange}
                >
                  <option value="">請選擇人數</option>
                  <option value="1">1人</option>
                  <option value="2">2人</option>
                  <option value="3">3人</option>
                </select>
              </div>
            </div>
            <div className={Styles['form-group']}>
              <label htmlFor="remark">備註 | remark</label>
              <textarea
                id="remark"
                value={formData.remark}
                onChange={handleChange}
                placeholder="例如：我有食物過敏..."
              ></textarea>
            </div>
            <div className={Styles['form-actions']}>
              <button className={Styles['reset-button']} onClick={resetForm}>
                重置
              </button>
              <button
                className={Styles['submit-button']}
                type="button"
                onClick={handleSubmit}
              >
                送出
              </button>
            </div>
          </>
        )}
      </div>

      {/* 顯示 LoginModal 當 userId 為 0 且點擊我要報名時彈出 */}
      {showLoginModal && (
        <LoginModal
          title="尚未登入會員"
          content="是否前往登入?"
          btnConfirm="前往登入"
          ConfirmFn={() => {
            router.push('/user/login/user')
          }}
          show={showLoginModal}
          handleClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  )
}
