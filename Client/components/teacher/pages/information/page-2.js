'use client'
import { useAuth } from '@/hooks/use-auth'
import Textarea from '@/components/teacher/common/t-dashboard-textarea-style'
import InputStyle from '@/components/teacher/common/t-dashboard-input-style'
import DashboardTitle from '@/components/shared/dashboard-title-y'
import styles from '@/components/teacher/common/information.module.scss'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Page2({ onPreviousPage }) {
  const role = 'admin'
  const { auth, login, logout } = useAuth()
  const { userData } = auth // 撈取 teacherData 資料
  console.log(auth)

  const [teacher, setTeacher] = useState(null)
  const [gender, setGender] = useState('') // 新增 gender 狀態

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/teacher`)
      if (!response.ok) {
        throw new Error('網路回應不成功：' + response.status)
      }
      const data = await response.json()
      const filteredData = data.find((teacher) => teacher.id === userData.id) // 篩選符合 userData.id 的資料
      setTeacher(filteredData) // 只設定符合 id 的資料
      console.log(filteredData)
    } catch (err) {
      console.log(err)
    }
  }

  const handleGenderChange = (e) => {
    setGender(e.target.value)
    setTeacher((prevTeacher) => ({ ...prevTeacher, gender: e.target.value })) // 更新 teacher.gender
  }

  return (
    <>
      <div className={styles.main}>
        <DashboardTitle chTitle="個人資訊" enTitle="Information" />
        <form action="">
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
                        addclass="w-50"
                        forText="name"
                        titleCh="姓名"
                        titleEn=" | name"
                        typeText="text"
                        placeholder="請輸入姓名"
                        name=""
                        value={teacher.name}
                      />
                      <div className="mx-3"></div>
                      <InputStyle
                        addclass="w-50"
                        forText="email"
                        titleCh="信箱"
                        titleEn=" | email"
                        typeText="email"
                        placeholder="請輸入信箱"
                        name=""
                        value={teacher.email}
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
                        name=""
                        value={teacher.nation}
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
                            class="form-check-input p me-2 align-middle"
                            type="radio"
                            name="gender"
                            id="inlineRadio1"
                            value="male"
                            checked={teacher.gender === 'male'} // 當 teacher.gender 為 male 時選中
                            onChange={handleGenderChange} // 加入 onChange 事件
                          />
                          男
                        </div>
                        <div className="d-inline">
                          <input
                            class="form-check-input p me-2 align-middle"
                            type="radio"
                            name="gender"
                            id="inlineRadio2"
                            value="female"
                            checked={teacher.gender === 'female'} // 當 teacher.gender 為 female 時選中
                            onChange={handleGenderChange} // 加入 onChange 事件
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
                        name=""
                        value={teacher.years}
                      />
                    </div>
                    <InputStyle
                      addclass="col-6"
                      forText="birthday"
                      titleCh="生日"
                      titleEn=" | birthday"
                      typeText="date"
                      placeholder="請選擇日期"
                      name=""
                      value={teacher.birthday}
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
                  />
                  <Textarea
                    title="我的 Slogan"
                    name="notes"
                    rows="10"
                    width="100%"
                    placeholder="最多輸入250字"
                    addclass="w-100"
                    value={teacher.slogan}
                  />
                  <Textarea
                    title="經歷 Experience"
                    name="experience"
                    rows="10"
                    width="100%"
                    placeholder="最多輸入250字"
                    addclass="w-100"
                    value={teacher.experience}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p>載入中或找不到資料</p>
          )}
        </form>
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
          <button type="submit" className="btn-danger h6 ms-auto">
            儲存
          </button>
        </div>
      </div>
    </>
  )
}
