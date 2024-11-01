import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import UserSection from '@/components/user/common/user-section';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.scss';
import { PiLockLight } from "react-icons/pi";
import { PiEyeClosed } from "react-icons/pi";

export default function PasswordUser(props) {
  return (
    <>
      <UserSection titleCN="變更密碼" titleENG="Password">
        <div className={`${styles['password-area']} row d-flex justify-content-center align-items-center`}>
          <div className="col-11 col-xl-8 mb-3">
            <label htmlFor="old-password" className="form-label h6">
              原密碼
            </label>
          </div>
          <div className={`${styles['input-password']} col-11 col-xl-8 mb-3`}>
            <PiLockLight className={`${styles['icon-lock']}`} />
            <input
              type="password"
              className={`form-control ${styles['form-focus']}`}
              id="old-password"
              placeholder="請輸入原密碼"
            />
            <PiEyeClosed className={`${styles['icon-eye']}`} />
          </div>
        </div>

        <div className="row mt-4 d-flex justify-content-center align-items-center">
          <div className="col-11 col-xl-8 mb-3">
            <label htmlFor="new-password" className="form-label h6">
              新密碼
            </label>
          </div>
          <div className={`${styles['input-password']} col-11 col-xl-8 mb-3`}>
            <PiLockLight className={`${styles['icon-lock']}`} />
            <input
              type="password"
              className={`form-control ${styles['form-focus']}`}
              id="new-password"
              placeholder="請輸入新密碼"
            />
            <PiEyeClosed className={`${styles['icon-eye']}`} />
          </div>
        </div>

        <div className="row mt-4 d-flex justify-content-center align-items-center">
          <div className="col-11 col-xl-8 mb-3">
            <label htmlFor="confirm-password" className="form-label h6">
              確認密碼
            </label>
          </div>
          <div className={`${styles['input-password']} col-11 col-xl-8 mb-3`}>
            <PiLockLight className={`${styles['icon-lock']}`} />
            <input
              type="password"
              className={`form-control ${styles['form-focus']}`}
              id="confirm-password"
              placeholder="請再次輸入新密碼"
            />
            <PiEyeClosed className={`${styles['icon-eye']}`} />
          </div>
        </div>

        <div className={`${styles['email-area']} row d-flex justify-content-center align-items-center mt-5`}>
          <div className={`${styles['email-rwd']} col-11 col-xl-4 justify-content-center align-items-center`}>
            <div className="form-check col-6 col-xl-12">
              <input className={`form-check-input ${styles['form-check-input2']}`} type="checkbox" value="" id="default-check1" />
              <label className="form-check-label p" htmlFor="default-check1">
                email 密碼驗證
              </label>
            </div>
            <div className="col-6 col-xl-12">
              <p className={`${styles['email-text']} ps`}>*以個人資訊 email驗證</p>
            </div>
          </div>

          <div className="col-11 col-xl-4">
            <div className="input-group mb-3">
              <span className="input-group-text" id="inputGroup-sizing-default">驗證碼</span>
              <input
                type="text"
                className={`form-control ps-3 ${styles['form-focus']}`}
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                placeholder="請輸入信箱驗證碼"
              />
            </div>
          </div>
        </div>

        <div className={`${styles['line-title-down']} row d-flex justify-content-end align-items-center`}>
          <div className="col-12 h6 d-flex justify-content-end pt-5">
            <button className="btn btn-secondary h6 me-3">取消</button>
            <button className="btn btn-primary h6">確認</button>
          </div>
        </div>
      </UserSection>

    </>
  )
}
