'use client'
import { useAuth } from '@/hooks/use-auth'
import Textarea from '@/components/teacher/common/t-dashboard-textarea-style'
import InputStyle from '@/components/teacher/common/t-dashboard-input-style'
import DashboardTitle from '@/components/shared/dashboard-title-y'
import styles from '@/components/teacher/common/information.module.scss'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Page2({ onPreviousPage }) {
  const role = 'teacher'
  const { auth, login, logout } = useAuth()
  //const { userData } = auth // 撈取 teacherData 資料
  console.log(auth)

  const [teacher, setTeacher] = useState(null)
 

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch(
        'http://localhost:3005/api/teacher/information',
        {
          credentials: 'include', //一定要加，才會帶cookie
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (!response.ok) {
        throw new Error('網路回應不成功：' + response.status)
      }
      const data = await response.json()
      // const filteredData = data.find((teacher) => teacher.id === userData.id) // 篩選符合 userData.id 的資料
      setTeacher(data) // 只設定符合 id 的資料
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }


  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setTeacher((prevTeacher) => ({
      ...prevTeacher,
      [name]: value, // 使用動態屬性來更新 teacher 對應欄位的值
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(
        'http://localhost:3005/api/teacher/information/update',
        {
          credentials: 'include',
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(teacher),
        }
      )

      if (!response.ok) {
        throw new Error('更新資料失敗')
      }
      const result = await response.json()
      console.log('更新成功', result)
    } catch (error) {
      console.error('更新失敗', error)
    }
    onPreviousPage()
  }

  return (
    <>
      <div className={styles.main}>
        <DashboardTitle chTitle="個人資訊" enTitle="Information" />
        <form onSubmit={handleSubmit} method="post">
          {teacher ? (
            <div>
              <div
                className={`${styles.basicInfoArea} d-flex justify-content-between align-items-center`}
              >
                <div className="col-8">
                  <div className={styles.account}>
                    <h4 className="m-0 h4">{teacher.account}</h4>
                    <p className="m-0 ms-2">| account</p>
                  </div>

                  <div className={`${styles.inputArea} mt-5`}>
                    <div className="d-flex mb-3">
                      <InputStyle
                        addclass="d-none"
                        forText="id"
                        titleCh="ID"
                        titleEn=""
                        typeText=""
                        placeholder=""
                        name="id"
                        value={teacher.id}
                        onChange={handleFieldChange}
                      />
                      <InputStyle
                        addclass="w-50"
                        forText="name"
                        titleCh="姓名"
                        titleEn=" | name"
                        typeText="text"
                        placeholder="請輸入姓名"
                        name="name"
                        value={teacher.name}
                        onChange={handleFieldChange}
                      />
                      <div className="mx-3"></div>
                      <InputStyle
                        addclass="w-50"
                        forText="email"
                        titleCh="信箱"
                        titleEn=" | email"
                        typeText="email"
                        placeholder="請輸入信箱"
                        name="email"
                        value={teacher.email}
                        onChange={handleFieldChange}
                      />
                    </div>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <InputStyle
                        addclass="col-5"
                        forText="nation"
                        titleCh="國籍"
                        titleEn=" | nation"
                        typeText="text"
                        placeholder="請輸入課程名稱"
                        name="nation"
                        value={teacher.nation}
                        onChange={handleFieldChange}
                      />
                      <div className="mx-3 pb-3 ">
                        <label
                          htmlFor="gender"
                          className={`${styles.radioLable} d-block p mb-3`}
                        >
                          性別
                          <span className="ps"> | gender</span>
                        </label>
                        <div className="d-inline me-3">
                          <input
                            className="form-check-input p me-2 align-middle"
                            type="radio"
                            name="gender"
                            id="inlineRadio1"
                            value="male"
                            checked={teacher.gender === 'male'} // 當 teacher.gender 為 male 時選中
                            onChange={handleFieldChange} // 加入 onChange 事件
                          />
                          男
                        </div>
                        <div className="d-inline">
                          <input
                            className="form-check-input p me-2 align-middle"
                            type="radio"
                            name="gender"
                            id="inlineRadio2"
                            value="female"
                            checked={teacher.gender === 'female'} // 當 teacher.gender 為 female 時選中
                            onChange={handleFieldChange} // 加入 onChange 事件
                          />
                          女
                        </div>
                      </div>
                      <InputStyle
                        addclass="col-4"
                        forText="years of experience"
                        titleCh="資歷"
                        titleEn=" | years of experience"
                        typeText="text"
                        placeholder="請填入資歷/年"
                        name="years"
                        value={teacher.years}
                        onChange={handleFieldChange}
                      />
                    </div>
                    <InputStyle
                      addclass="col-6"
                      forText="birthday"
                      titleCh="生日"
                      titleEn=" | birthday"
                      typeText="date"
                      placeholder="請選擇日期"
                      name="birthday"
                      value={teacher.birthday}
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
                <div className={`${styles.editImgArea}`}>
                  <Image
                    height={320}
                    width={320}
                    className={styles.editImg}
                    src={`/teacher/teachers_img/T_${teacher.id}_color.jpg`}
                    alt=""
                  />
                </div>
              </div>

              <hr className="opacity-75" />

              <div className={styles.editMoreInfoArea}>
                <div className={`${styles.editTextArea} d-flex gap-5`}>
                  <Textarea
                    title="關於我 About me"
                    name="about"
                    rows="10"
                    width="100%"
                    placeholder="最多輸入250字"
                    addclass="w-100"
                    value={teacher.about}
                    onChange={handleFieldChange}
                  />
                  <Textarea
                    title="我的 Slogan"
                    name="slogan"
                    rows="10"
                    width="100%"
                    placeholder="最多輸入250字"
                    addclass="w-100"
                    value={teacher.slogan}
                    onChange={handleFieldChange}
                  />
                  <Textarea
                    title="經歷 Experience"
                    name="experience"
                    rows="10"
                    width="100%"
                    placeholder="最多輸入250字"
                    addclass="w-100"
                    value={teacher.experience}
                    onChange={handleFieldChange}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p>載入中或找不到資料</p>
          )}

          <div className={`${styles.button} d-flex`}>
            <button
              className="btn-primary h6"
              onClick={(e) => {
                e.preventDefault()
                onPreviousPage()
              }}
            >
              回前頁
            </button>
            <button
              type="submit"
              className="btn-danger h6 ms-auto"
              // onClick={(e) => {
              //   e.preventDefault()
              //   onPreviousPage()
              // }}
            >
              儲存
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
