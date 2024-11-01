import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
import { PiEyeClosed } from "react-icons/pi";
import Link from 'next/link';


export default function UserSignup(props) {
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

              {/* 右側登入表單區塊 */}
              <div className={`d-inline ${styles['card-login']}`}>
                <div>
                  <h1 className={styles['login-title']}>SIGNUP</h1>
                </div>
                <div className={styles['input-area']}>
                  <label htmlFor="username" className={styles['text-input']}>
                    帳號<span className={`d-inline ${styles['text-red']} ps-1`}>*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    className={styles['line-input']}
                    placeholder="請輸入帳號/信箱"
                  />
                </div>
                <div className={`${styles['input-area']} ${styles['line-input-pw']}`}>
                  <label htmlFor="password" className={styles['text-input']}>
                    密碼<span className={`d-inline ${styles['text-red']} ps-1`}>*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    className={`${styles['line-input']} `}
                    placeholder="請輸入英文字母及數字"
                  />
                  <PiEyeClosed className={styles.eyeiclosed} />
                </div>
                <div className={`${styles['input-area']} ${styles['line-input-pw']}`}>
                  <label htmlFor="password" className={styles['text-input']}>
                    確認密碼<span className={`d-inline ${styles['text-red']} ps-1`}>*</span>
                  </label>
                  <input
                    type="password-confirm"
                    id="password-confirm"
                    className={`${styles['line-input']} `}
                    placeholder="請再次輸入密碼"
                  />
                  <PiEyeClosed className={styles.eyeiclosed} />
                </div>
                <div className='row p-0 m-0 d-flex justify-content-between'>
                  <div className={`${styles['input-area']} ${styles['line-input-pw']} pe-2 col-6`}>
                    <label htmlFor="password" className={styles['text-input']}>
                      姓名<span className={`d-inline ${styles['text-red']} ps-1`}>*</span></label>
                    <input
                      type="text"
                      id=""
                      className={`${styles['line-input']} `}
                    />
                  </div>
                  <div className={` ${styles['input-area']} ${styles['line-input-pw']} ps-2 col-6`}>
                    <label htmlFor="" className={styles['text-input']}>
                      稱謂                  </label>
                    <select
                      id="title"
                      className={`${styles['line-input']} ${styles['custom-select']}`}
                    >
                      <option value="" disabled selected>選擇稱謂</option>
                      <option value="male">先生</option>
                      <option value="female">女士</option>
                      <option value="other">其他</option>
                    </select>
                  </div>
                  <div className={`${styles['input-area']} ${styles['line-input-pw']} pe-2 col-12 col-sm-6`}>
                    <label htmlFor="" className={styles['text-input']}>
                      手機<span className={`d-inline ${styles['text-red']} ps-1 `}>*</span></label>
                    <input
                      type="text"
                      id=""
                      className={`${styles['line-input']} `}
                    />
                  </div>
                  <div className={`${styles['input-area']} ${styles['line-input-pw']} ps-2 col-12 col-sm-6`}>
                    <label htmlFor="password" className={styles['text-input']}>
                      生日</label>
                    <input
                      type="date"
                      id=""
                      className={`${styles['line-input']} `}
                    />
                  </div>
                </div>
                <div className={`form-check ${styles['form-area']} my-2 `}>
                  <div>
                    <input
                      className={`form-check-input ${styles['form-check-input2']}`}
                      type="checkbox"
                      value=""
                      id="remember"
                    />
                    <label
                      className={`form-check-label ps`}
                      htmlFor="remember"
                    >
                      我已閱讀並同意《會員權益聲明</label>
                  </div>
                </div>
                <div className="d-grid col-12 pt-1">
                  <button className={`btn-primary h6 ${styles['btn-primary']}`}>
                    創建帳號
                  </button>
                </div>
                <div className="row d-flex justify-content-end align-items-start">
                  <div className={`col-7 ${styles['signup-rwd']}`}>
                    已經有帳號了?{' '}
                    <Link href="/user/login" className="text-black">
                      立即登入
                    </Link>
                  </div>

                </div>
              </div>
              <div
                className={`d-flex flex-column align-items-center justify-content-center ${styles['card-img']}`}
              >
                <h2 className={styles['logo']}>Beautique</h2>
                <h3 className={styles['slogan']}>
                  Where Beauty <br /> Meets Uniqueness.
                </h3>
                <h6 className={`h6 ${styles['text']}`}>
                  已經是Beautique會員?立即登入享受會員專屬體驗！                </h6>
                <div className="col-12 d-flex justify-content-center align-items-center">
                  <Link href="/user/login">
                    <button className={`btn-outline h6 ${styles['btn-outline']}`}>
                      立即登入                    </button>
                  </Link>
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
