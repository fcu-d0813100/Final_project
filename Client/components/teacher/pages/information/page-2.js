'use client'
import Textarea from '@/components/teacher/common/t-dashboard-textarea-style'
import InputStyle from '@/components/teacher/common/t-dashboard-input-style'
import DashboardTitle from '@/components/shared/dashboard-title-y'
import styles from '@/components/teacher/common/information.module.scss'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Page2({ onPreviousPage }) {
  return (
    <>
      <div className={styles.main}>
        <DashboardTitle chTitle="個人資訊" enTitle="Information" />
        <div
          className={`${styles.basicInfoArea} d-flex justify-content-between align-items-center`}
        >
          <div className="col-8">
            <div className={styles.account}>
              <h4 className="m-0 h4">Gina Bettelli</h4>
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
                  value="Gina Bettelli"
                />
                <div className="mx-3"></div>
                <InputStyle
                  addclass="w-50"
                  forText="email"
                  titleCh="信箱"
                  titleEn=" | email"
                  typeText="text"
                  placeholder="請輸入信箱"
                  name=""
                  value="ginabettelli@gmail.com"
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
                  value="美國"
                />
                <div className="mx-3 pb-3 ">
                  <label
                    htmlFor=""
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
                      checked
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
                  value="17"
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
                value="1983-07-12"
              />
            </div>
          </div>
          <div className={`${styles.editImgArea}`}>
            <Image
              height={320}
              width={320}
              className={styles.editImg}
              src="/teacher/teachers_img/T_1_color.jpg"
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
              value="現任職彩妝藝術總監。身為一個表演者，我喜歡後台的能量和創造力，
              但無論在哪裡 - 在世界各地教授彩妝大師班，在全球舉行活動或參與密集的時裝週活動 - 品牌的多樣性仍然是我持續的靈感來源"
            />
            <Textarea
              title="我的 Slogan"
              name="notes"
              rows="10"
              width="100%"
              placeholder="最多輸入250字"
              addclass="w-100"
              value="“我喜歡贈送口紅。 口紅如此豐富多變，一旦你用過了它們，你就離不開了！”"
            />
            <Textarea
              title="經歷 Experience"
              name="experience"
              rows="10"
              width="100%"
              placeholder="最多輸入250字"
              addclass="w-100"
              value="於M·A·C Cosmetics 擔任資深彩妝師 11 年
              在職業生涯中，曾與眾多全球頂級的時尚品牌如 Chanel、Dior、Gucci 和 Louis Vuitton 合作，
              為他們的高端時裝秀創作出驚豔的妝容設計。她與眾多知名攝影師，如 Mario Testino、Annie Leibovitz 和 Steven Meisel 等合作，
              參與了無數著名雜誌如《Vogue》、《Harper's Bazaar》 和《Elle》的封面拍攝。"
            />
          </div>
        </div>

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
          <button className="btn-danger h6 ms-auto">儲存</button>
        </div>
      </div>
    </>
  )
}
