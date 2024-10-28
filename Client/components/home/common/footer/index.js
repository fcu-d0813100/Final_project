import React from 'react'
import Link from 'next/link'
import { FaGoogle } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { FaFacebookF } from 'react-icons/fa'
import { FaLine } from 'react-icons/fa'
import styles from './footer.module.scss'

export default function index() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles['footer-one']}>
          <div className={styles['footer-logo']}>
            <div className={styles['footer-logo-name']}>Beautique</div>
            <div className={styles['footer-icon']}>
              <a href="https://x.com/">
                <FaXTwitter />
              </a>
              <a href="https://www.facebook.com/?locale=zh_TW">
                <FaFacebookF />
              </a>
              <a href="https://www.google.com/">
                <FaGoogle />
              </a>
              <a href="https://x.com/">
                <FaLine />
              </a>
            </div>
          </div>

          {/* 站內連結 */}
          <div className={styles['footer-list']}>
            <ul className={styles['user-area']}>
              <li>會員專區</li>
              <li>
                <Link href="/user/login">會員登入</Link>
              </li>
              <li>
                <Link href="/user">我的帳戶</Link>
              </li>
              <li>
                <Link href="/user/favorite">我的收藏</Link>
              </li>
              <li>
                <Link href="/user/order">訂單查詢</Link>
              </li>
            </ul>
            <ul className={styles['sharing-area']}>
              <li>交流空間</li>
              <li>
                <Link href="/post">美妝社群</Link>
              </li>
              <li>
                <Link href="/activity">活動報名</Link>
              </li>
            </ul>
            <ul className={styles['shopping-area']}>
              <li>SHOPPING</li>
              <li>
                <Link href="/product">彩妝商品</Link>
              </li>
              <li>
                <Link href="/workshop">美妝課程</Link>
              </li>
              <li>
                <Link href="/discount">優惠券專區</Link>
              </li>
              <li>
                <Link href="/">常見問題</Link>
              </li>
            </ul>
            <ul className={styles['other-area']}>
              <li>其他</li>
              <li>
                <Link href="/admin/login">管理員登入</Link>
              </li>
              <li>
                <Link href="/teacher/login">彩妝師登入</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles['footer-two']}>
          © 2024 COPYRIGHT@BEAUTIQUE CO.,LTD.ALL RIGHTS RESERVED.
        </div>
      </footer>
    </>
  )
}
