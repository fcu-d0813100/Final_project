import React, { useState } from 'react'
import Styles from '@/components/activity/page/activity-det/index.module.scss'

export default function FormToggle({ uid }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleForm = () => setIsExpanded(!isExpanded)

  const resetForm = () => {
    document.getElementById('name').value = ''
    document.getElementById('phone').value = ''
    document.getElementById('date').value = ''
    document.getElementById('people').selectedIndex = 0
    document.getElementById('remark').value = ''
  }

  const handleSubmit = async () => {
    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value
    const date = document.getElementById('date').value
    const people = document.getElementById('people').value
    const remark = document.getElementById('remark').value

    if (!name || !phone || !date || people === '請選擇人數') {
      alert('請填寫所有必填字段')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3005/api/activity/activity-reg/${uid}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, phone, date, people, remark }),
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
                <label htmlFor="name">姓名 | name</label>
                <input type="text" id="name" placeholder="請輸入姓名" />
              </div>
              <div className={Styles['form-group']}>
                <label htmlFor="phone">電話 | phone</label>
                <input type="text" id="phone" placeholder="請輸入電話" />
              </div>
            </div>
            <div className={Styles['form-row']}>
              <div className={Styles['form-group']}>
                <label htmlFor="date">報名日期 | date</label>
                <input type="date" id="date" />
              </div>
              <div className={Styles['form-group']}>
                <label htmlFor="people">參加人數</label>
                <select id="people">
                  <option>請選擇人數</option>
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
    </div>
  )
}
