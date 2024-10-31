import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import UserSection from '@/components/user/common/user-section';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.scss';
import Image from 'next/image';
export default function index({
  //   name = '王美美',
  //   nickname = 'Bella',
  //   email = 'bella32@gmail.com',
  //   birthday = '2001.05.05',
  //   gender = '女士',
  //   phone = '0912345678',
  //   address = '台北市信義區市府路1號',
  //   Img = '',
  //   created_at = '2023.05.05',
  //   updated_at = '2024.10.05',
  //   points = '100',
}) {
  return (
    <>
      <UserSection titleCN="更新資訊" titleENG="Information">
        <form action="" method="post" encType="multipart/form-data">
          <div class="d-flex mt-4">
            <div class="col-12 d-flex row justify-content-between align-items-center">
              <div class="col-8 d-flex flex-wrap">
                <div class={`col-4 mt-5 ${styles.info} `}>
                  <label class="form-label pb-2">姓名 <span class=" ps pe-4 ">| name</span></label>
                  <input type="text" class={`form-control ${styles['form-control2']} `} />
                </div>
                <div class={`col-4 mt-5 ${styles.info} `}>
                  <label class="form-label pb-2">暱稱 <span class=" ps pe-4">| nickname</span></label>
                  <input type="text" class={`form-control ${styles['form-control2']} `} />
                </div>
                <div class={`col-4 mt-5 ${styles.info} `}>
                  <label class="form-label pb-2">稱謂 <span class=" ps pe-4">| title</span></label>
                  <input type="text" class={`form-control ${styles['form-control2']} `} />
                </div>
                <div class={`col-3 ${styles.info} mt-5`}>
                  <label class="form-label pb-2">生日 <span class=" ps pe-4">| birthday</span></label>
                  <input type="date" class={`form-control ${styles['form-control2']} `} name="birthday" />
                </div>
                <div class={`col-3 ${styles.info} mt-5`}>
                  <label class="form-label pb-2">手機 <span class=" ps pe-4">| phone</span></label>
                  <input type="tel" class={`form-control ${styles['form-control2']} `} pattern="\d{10}" name="phone" />
                </div>
                <div class={`col-6 ${styles.info} mt-5`}>
                  <label class="form-label pb-2">信箱 <span class=" ps pe-5">| email</span></label>
                  <input type="email" class={`form-control ${styles['form-control2']} `} name="email" />
                </div>
              </div>
              <div class="col-4 d-flex justify-content-center align-items-center">
                <div class="col-8">
                  <div class="ratio ratio-1x1 w-75">

                    <Image
                      width={255}
                      height={255}
                      className={styles.avatar}
                      src="/user/img/avatar02.jpg"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 收件資訊 */}
          <div className={`row ${styles['address-line']} d-flex align-items-center pb-3 my-5`}>
            <h3 className={`h4 ${styles['center-title']} pb-2`}>收件資訊</h3>
          </div>

          <div className={`d-flex row ${styles['address-line']} ${styles['address-area']} align-items-center justify-content-start p-0 m-0`}>
            <div className={`col ${styles.info} ${styles['address-margin']}`}>
              <label className={`form-label pb-2`}>
                居住縣市 <span className={`${styles.ps} ${styles['info-address']}`}>| city</span>
              </label>
              <select className={`form-select ${styles['form-select2']}`}>
                <option value="" disabled selected>請選擇縣市</option>
                {/* Options omitted for brevity */}
              </select>
            </div>
            <div className={`col ${styles.info} ${styles['address-margin']}`}>
              <label className={`form-label pb-2`}>
                居住區域 <span className={`d-inline ${styles.ps} ${styles['info-address']}`}>| area</span>
              </label>
              <select className={`form-select ${styles['form-select2']}`}>
                <option value="" disabled selected>請選擇區域</option>
              </select>
            </div>
            <div className={`col-7 ${styles.info} ${styles['address-margin']}`}>
              <label className={`form-label pb-2`}>
                地址 <span className={`ps ${styles['info-address']}`}>| address</span>
              </label>
              <input
                type="text"
                className={`form-control ${styles['form-control2']}`}
                name="streetAddress"
                placeholder="請輸入完整地址"
              />
            </div>
          </div>

          {/* 注意事項與提交按鈕 */}
          <div className={`row d-flex justify-content-between align-items-center mt-3`}>
            <div className={`col-6`}>
              <p className={styles.ps}>※請填寫完整的個人資訊，以享有更多會員權益。</p>
            </div>
            <div className={`col-3 d-flex justify-content-end align-items-center`}>
              <a href="" className={`p ${styles['delete-account']}`}>停用會員帳戶</a>
            </div>
          </div>

          <div className={`${styles['submit-area']} d-flex justify-content-end align-items-center row`}>
            <button type="button" className={`btn-secondary h6 me-4`}>取消</button>
            <button type="submit" className={`btn-primary h6`}>儲存</button>
          </div>
        </form>


      </UserSection>
    </>
  )
}
