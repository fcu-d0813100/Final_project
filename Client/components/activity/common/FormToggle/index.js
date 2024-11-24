import React, { useState, useEffect } from 'react'
import Styles from '@/components/activity/page/activity-det/index.module.scss'
import { useAuth } from '@/hooks/use-auth'
import LoginModal from '@/components/shared/modal-confirm'
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast'

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
  const now = new Date()

  const dateStr1 = end_at
  const dateStr2 = now
  const date1 = new Date(dateStr1) //活動結束時間
  const date2 = new Date(dateStr2) //目前此時此刻的時間

  useEffect(() => {
    console.log('使用者 ID:', userId) // 印出 userId
  }, [userId])
  const toggleForm = () => {
    if (userId === 0) {
      setShowLoginModal(true) // 如果 userId 是 0，顯示登入模態框
    } else if (date1 < date2) {
      toast.error(' 活動已結束', {
        style: {
          border: '1.2px solid #90957a',
          padding: '12px 40px',
          color: '#963827',
        },
        iconTheme: {
          primary: '#963827',
          secondary: '#fff',
        },
      })
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
      // alert('請填寫所有必填字段')
      toast.error(' 必填欄位不能為空', {
        style: {
          border: '1.2px solid #90957a',
          padding: '12px 40px',
          color: '#963827',
        },
        iconTheme: {
          primary: '#963827',
          secondary: '#fff',
        },
      })
      return
    }

    // 電話號碼正規驗證
    if (!taiwanPhoneRegex.test(phone)) {
      // alert('請輸入有效的台灣電話號碼')
      toast.error(' 請輸入有效的電話號碼', {
        style: {
          border: '1.2px solid #90957a',
          padding: '12px 40px',
          color: '#963827',
        },
        iconTheme: {
          primary: '#963827',
          secondary: '#fff',
        },
      })
      // console.log('電話號碼驗證失敗:', phone)
      return
    }

    try {
      const { id } = router.query
      // 從後端取得活動的 currentREG 和 maxREG
      const activityResponse = await fetch(
        `http://localhost:3005/api/activity/id?id=${id}`
      )
      if (!activityResponse.ok) {
        throw new Error('無法獲取活動資訊')
      }
      const activityData = await activityResponse.json()

      const currentREG = Number(activityData.currentREG)
      const maxREG = Number(activityData.maxREG)
      const applicantAmount = Number(people)

      // 檢查報名是否超過限制
      if (currentREG + applicantAmount > maxREG) {
        // alert('報名失敗：報名人數已達上限')
        toast.error(' 報名失敗：報名人數已達上限', {
          style: {
            border: '1.2px solid #90957a',
            padding: '12px 40px',
            color: '#963827',
          },
          iconTheme: {
            primary: '#963827',
            secondary: '#fff',
          },
        })

        return
      }

      // 發送報名請求
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
        // alert('報名成功！')
        toast.success('報名成功！', {
          style: {
            border: '1.2px solid #90957a',
            padding: '12px 40px',
            color: '#626553',
          },
          iconTheme: {
            primary: '#626553',
            secondary: '#fff',
          },
        })
        resetForm()
        setIsExpanded(false)
      } else {
        const errorData = await response.json()
        // alert(`報名失敗：${errorData.message || '請稍後再試'}`)
        toast.error(`報名失敗：${errorData.message || '請稍後再試'}`, {
          style: {
            border: '1.2px solid #90957a',
            padding: '12px 40px',
            color: '#963827',
          },
          iconTheme: {
            primary: '#963827',
            secondary: '#fff',
          },
        })
      }
    } catch (error) {
      console.error('報名失敗：', error)
      // alert('報名失敗，請稍後再試')
      toast.error(`報名失敗`, {
        style: {
          border: '1.2px solid #90957a',
          padding: '12px 40px',
          color: '#963827',
        },
        iconTheme: {
          primary: '#963827',
          secondary: '#fff',
        },
      })
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
            <div className="row justify-content-center gap-4">
              <div className="col-md-5 leftform mb-5">
                <div className="formGroup mb-3">
                  <div className="d-flex">
                    {' '}
                    <label htmlFor="name">姓名 </label>
                    <span>| name</span>
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
                <div className="formGroup mb-3">
                  <div className="d-flex">
                    <label htmlFor="phone">電話</label>
                    <span>| phone</span>
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
                <div className="formRow d-flex justify-content-between">
                  <div className="formGroup col-md-7 ">
                    <div className="d-flex">
                      {' '}
                      <label htmlFor="date">報名日期</label>
                      <span>| date</span>
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
                  <div className="formGroup col-md-4">
                    <div className="d-flex">
                      <label htmlFor="people">參加人數</label>
                      <span>| amount</span>
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
              </div>
              <div className="col-md-5 rightform  ">
                {' '}
                <div className="formGroup mb-3">
                  <label htmlFor="remark">備註</label>
                  <span>| remark</span>
                  <textarea
                    id="remark"
                    value={formData.remark}
                    onChange={handleChange}
                    placeholder="例如：我有食物過敏..."
                  ></textarea>
                </div>
                <div className={`${Styles['form-actions']} mb-3`}>
                  <button
                    className={Styles['reset-button']}
                    onClick={resetForm}
                  >
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
              </div>
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
