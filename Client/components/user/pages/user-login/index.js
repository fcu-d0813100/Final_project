import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'

export default function UserLogin(props) {
  return (
    <>
      <div className={styles['bg-img']}>
        <div className={`container ${styles['container-login']}`}>
          <div
            className={`vh-100 d-flex justify-content-center align-items-center flex-column py-2 ${styles['login-section']}`}
          >
            <div
              className={`shadow d-flex justify-content-between align-items-center ${styles['bg-card']}`}
            >
              {/* 左側圖片區塊 */}
              <div
                className={`d-flex flex-column align-items-center justify-content-center ${styles['card-img']}`}
              >
                <h2 className={styles['logo']}>Beautique</h2>
                <h3 className={styles['slogan']}>
                  Where Beauty <br /> Meets Uniqueness.
                </h3>
                <h6 className={`h6 ${styles['text']}`}>
                  註冊成為Beautique會員，第一時間掌握最新美妝潮流！
                </h6>
                <div className="col-12 d-flex justify-content-center align-items-center">
                  <button className={`btn-outline h6 ${styles['btn-outline']}`}>
                    立即註冊
                  </button>
                </div>
              </div>
              {/* 右側登入表單區塊 */}
              <div className={`d-inline ${styles['card-login']}`}>
                <div>
                  <h1 className={styles['login-title']}>LOGIN</h1>
                </div>
                <div className={styles['input-area']}>
                  <label htmlFor="username" className={styles['text-input']}>
                    帳號
                  </label>
                  <input
                    type="text"
                    id="username"
                    className={styles['line-input']}
                    placeholder="請輸入帳號/信箱"
                  />
                </div>
                <div className={styles['input-area']}>
                  <label htmlFor="password" className={styles['text-input']}>
                    密碼
                  </label>
                  <input
                    type="password"
                    id="password"
                    className={styles['line-input']}
                    placeholder="請輸入英文字母及數字"
                  />
                </div>
                <div className={`form-check ${styles['form-area']} my-2 `}>
                  <div>
                    <input
                      className={`form-check-input ${styles['form-check-input2']}`}
                      type="checkbox"
                      value=""
                      id="remember"
                    />
                    {/* 按鈕沒有變黑色 */}
                    <label
                      className={`form-check-label  ps`}
                      htmlFor="remember"
                    >
                      記住帳密
                    </label>
                  </div>
                  <a href="#" className={`${styles['forget-ps']} ps`}>
                    忘記密碼
                  </a>
                </div>
                <div className="d-grid col-12 pt-4">
                  <button className={`btn-primary h6 ${styles['btn-primary']}`}>
                    登入
                  </button>
                </div>
                <div className="row pt-4">
                  <div className={`col-7 ${styles['signin-rwd']}`}>
                    還沒有帳號?{' '}
                    <a href="#" className="text-black">
                      立即註冊
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <p
              className={`ps-phone text-white text-center ${styles['copyright']}`}
            >
              © 2024 COPYRIGHT@BEAUTIQUE CO.,LTD.ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
