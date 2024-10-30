import Header from '@/components/home/common/header'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Styles from '@/components/activity/page/index.module.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import Brands from '@/components/home/common/brands'

export default function Activity() {
  // 使用 useEffect 確保 Bootstrap JavaScript 僅在客戶端加載
  useEffect(() => {
    typeof document !== undefined
      ? require('bootstrap/dist/js/bootstrap.bundle.min.js')
      : null
  }, [])

  return (
    <>
      <Header />
      {/* 輪播圖片 */}
      <div className={Styles['act-img-container']}>
        <Image
          src={'/activity/YSL4_1.png'}
          width={1920}
          height={700}
          alt="YSL4_1"
        />
      </div>

      <div className={`${Styles['act-sec1']} container`}>
        <div
          className={`${Styles['act-month-button']} ${Styles['act-sec1']} d-none d-lg-block`}
        >
          {/* 在小於992px時隱藏 */}
          <ul className="d-flex justify-content-around">
            <li>
              <a href="#">ALL</a>
            </li>
            <li>
              <a href="#">1 月</a>
            </li>
            <li>
              <a href="#">2 月</a>
            </li>
            <li>
              <a href="#">3 月</a>
            </li>
            <li>
              <a href="#">4 月</a>
            </li>
            <li>
              <a href="#">5 月</a>
            </li>
            <li>
              <a href="#">6 月</a>
            </li>
            <li>
              <a href="#">7 月</a>
            </li>
            <li>
              <a href="#">8 月</a>
            </li>
            <li>
              <a href="#">9 月</a>
            </li>
            <li>
              <a href="#">10 月</a>
            </li>
            <li>
              <a href="#">11 月</a>
            </li>
            <li>
              <a href="#">12 月</a>
            </li>
          </ul>
        </div>
      </div>

      {/* 活動搜尋input */}
      <div className={`${Styles['act-search']} container`}>
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarScroll"
              aria-controls="navbarScroll"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarScroll">
              <ul
                className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
                style={{ '--bs-scroll-height': '100px' }}
              >
                <li className="nav-item dropdown border-bottom border-dark mb-3">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    狀態
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        報名中
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        已截止
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown border-bottom border-dark mb-3 d-lg-none">
                  <a
                    className="nav-link dropdown-toggle month-button-mobile"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    月份
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        ALL
                      </a>
                    </li>
                    {/* 更多月份選項 */}
                  </ul>
                </li>
              </ul>
              <form className="d-flex" role="search">
                <input
                  className="form-control me-2 rounded-pill border-dark"
                  type="search"
                  placeholder="活動 |"
                  aria-label="Search"
                />
                <button className="btn" type="submit">
                  <i className="ph ph-magnifying-glass"></i>
                </button>
              </form>
            </div>
          </div>
        </nav>
      </div>

      {/* 活動列表區域 */}
      <div className={Styles['act-main']}>
        {/* 控制活動月份標籤 */}
        <div className={`${Styles['month-title']} container`}>2月活動</div>
        <div className={`${Styles['act-card-sec']} container`}>
          {/* 左邊款卡片樣式 */}
          <div className={`${Styles['cardLeft']} d-flex`}>
            <div className={Styles['cardL']}>
              {/* 卡片內圖片 */}
              <a href="#">
                <div className={Styles['card-img']}>
                  <Image
                    src={'/activity/BOBBI1_1.png'}
                    width={1200}
                    height={800}
                    alt="BOBBI1_1.png"
                  />
                </div>
                {/* 卡片內資訊 */}
              </a>
              <div className={Styles['card-content']}>
                <div className={Styles['card-date']}>
                  2024-11-16 ~ 2024-11-17
                </div>
                <div className={Styles['card-info']}>
                  <p className={Styles['title']}>主辦單位 | host</p>
                  <p>Yves Saint Laurent</p>
                  <p className={Styles['title']}>活動地點 | location</p>
                  <p>110台北市信義區市府路45號</p>
                </div>
                {/* 卡片內狀態及收藏 */}
                <div className={Styles['card-footer']}>
                  <div className={Styles['badge']}>12 人</div>
                  <div className={Styles['status']}>報名中</div>
                  <i className={Styles['ph-heart']} />
                </div>
              </div>
            </div>
            {/* 左邊卡片樣式的 中文名字跟英文名字(字在右邊) */}
            <div className={Styles['rightTextCHN']}>奢光派對</div>
            <div className={Styles['rightTextENG']}>YSL BEAUTY LIGHT CLUB </div>
          </div>
          <div className={`${Styles['cardRight']} d-flex`}>
            {/* 右邊卡片樣式的 中文名字跟英文名字(字在左邊) */}
            <div className={Styles['leftTextCHN']}>奢光派對</div>
            <div className={Styles['leftTextENG']}>YSL BEAUTY LIGHT CLUB </div>
            <div className={Styles['cardR']}>
              <a href="#">
                {/* 圖片 */}
                <div className={Styles['card-img']}>
                  <Image
                    src={'/activity/YSL3_1.png'}
                    width={1200}
                    height={800}
                    alt="YSL3_1.png"
                  />
                </div>
                {/* 資訊 */}
              </a>
              <div className={Styles['card-content']}>
                <div className={Styles['card-date']}>
                  2024-11-16 ~ 2024-11-17
                </div>
                <div className={Styles['card-info']}>
                  <p className={Styles['title']}>主辦單位 | host</p>
                  <p>Yves Saint Laurent</p>
                  <p className={Styles['title']}>活動地點 | location</p>
                  <p>110台北市信義區市府路45號</p>
                </div>
                {/* 狀態擊收藏 */}
                <div className={Styles['card-footer']}>
                  <div className={Styles['badge']}>12 人</div>
                  <div className={Styles['status']}>報名中</div>
                  <i className={Styles['ph-heart']} />
                </div>
              </div>
            </div>
          </div>
          {/* 左邊款卡片樣式 */}
          <div className={`${Styles['cardLeft']} d-flex`}>
            <div className={Styles['cardL']}>
              {/* 卡片內圖片 */}
              <a href="#">
                <div className={Styles['card-img']}>
                  <Image
                    src={'/activity/BOBBI1_1.png'}
                    width={1200}
                    height={800}
                    alt="BOBBI1_1.png"
                  />
                </div>
                {/* 卡片內資訊 */}
              </a>
              <div className={Styles['card-content']}>
                <div className={Styles['card-date']}>
                  2024-11-16 ~ 2024-11-17
                </div>
                <div className={Styles['card-info']}>
                  <p className={Styles['title']}>主辦單位 | host</p>
                  <p>Yves Saint Laurent</p>
                  <p className={Styles['title']}>活動地點 | location</p>
                  <p>110台北市信義區市府路45號</p>
                </div>
                {/* 卡片內狀態及收藏 */}
                <div className={Styles['card-footer']}>
                  <div className={Styles['badge']}>12 人</div>
                  <div className={Styles['status']}>報名中</div>
                  <i className={Styles['ph-heart']} />
                </div>
              </div>
            </div>
            {/* 左邊卡片樣式的 中文名字跟英文名字(字在右邊) */}
            <div className={Styles['rightTextCHN']}>奢光派對</div>
            <div className={Styles['rightTextENG']}>YSL BEAUTY LIGHT CLUB </div>
          </div>
          <div className={`${Styles['cardRight']} d-flex`}>
            {/* 右邊卡片樣式的 中文名字跟英文名字(字在左邊) */}
            <div className={Styles['leftTextCHN']}>奢光派對</div>
            <div className={Styles['leftTextENG']}>YSL BEAUTY LIGHT CLUB </div>
            <div className={Styles['cardR']}>
              <a href="#">
                {/* 圖片 */}
                <div className={Styles['card-img']}>
                  <Image
                    src={'/activity/YSL3_1.png'}
                    width={1200}
                    height={800}
                    alt="YSL3_1.png"
                  />
                </div>
                {/* 資訊 */}
              </a>
              <div className={Styles['card-content']}>
                <div className={Styles['card-date']}>
                  2024-11-16 ~ 2024-11-17
                </div>
                <div className={Styles['card-info']}>
                  <p className={Styles['title']}>主辦單位 | host</p>
                  <p>Yves Saint Laurent</p>
                  <p className={Styles['title']}>活動地點 | location</p>
                  <p>110台北市信義區市府路45號</p>
                </div>
                {/* 狀態擊收藏 */}
                <div className={Styles['card-footer']}>
                  <div className={Styles['badge']}>12 人</div>
                  <div className={Styles['status']}>報名中</div>
                  <i className={Styles['ph-heart']} />
                </div>
              </div>
            </div>
          </div>
          {/* 左邊款卡片樣式 */}
          <div className={`${Styles['cardLeft']} d-flex`}>
            <div className={Styles['cardL']}>
              {/* 卡片內圖片 */}
              <a href="#">
                <div className={Styles['card-img']}>
                  <Image
                    src={'/activity/BOBBI1_1.png'}
                    width={1200}
                    height={800}
                    alt="BOBBI1_1.png"
                  />
                </div>
                {/* 卡片內資訊 */}
              </a>
              <div className={Styles['card-content']}>
                <div className={Styles['card-date']}>
                  2024-11-16 ~ 2024-11-17
                </div>
                <div className={Styles['card-info']}>
                  <p className={Styles['title']}>主辦單位 | host</p>
                  <p>Yves Saint Laurent</p>
                  <p className={Styles['title']}>活動地點 | location</p>
                  <p>110台北市信義區市府路45號</p>
                </div>
                {/* 卡片內狀態及收藏 */}
                <div className={Styles['card-footer']}>
                  <div className={Styles['badge']}>12 人</div>
                  <div className={Styles['status']}>報名中</div>
                  <i className={Styles['ph-heart']} />
                </div>
              </div>
            </div>
            {/* 左邊卡片樣式的 中文名字跟英文名字(字在右邊) */}
            <div className={Styles['rightTextCHN']}>奢光派對</div>
            <div className={Styles['rightTextENG']}>YSL BEAUTY LIGHT CLUB </div>
          </div>
          <div className={`${Styles['cardRight']} d-flex`}>
            {/* 右邊卡片樣式的 中文名字跟英文名字(字在左邊) */}
            <div className={Styles['leftTextCHN']}>奢光派對</div>
            <div className={Styles['leftTextENG']}>YSL BEAUTY LIGHT CLUB </div>
            <div className={Styles['cardR']}>
              <a href="#">
                {/* 圖片 */}
                <div className={Styles['card-img']}>
                  <Image
                    src={'/activity/YSL3_1.png'}
                    width={1200}
                    height={800}
                    alt="YSL3_1.png"
                  />
                </div>
                {/* 資訊 */}
              </a>
              <div className={Styles['card-content']}>
                <div className={Styles['card-date']}>
                  2024-11-16 ~ 2024-11-17
                </div>
                <div className={Styles['card-info']}>
                  <p className={Styles['title']}>主辦單位 | host</p>
                  <p>Yves Saint Laurent</p>
                  <p className={Styles['title']}>活動地點 | location</p>
                  <p>110台北市信義區市府路45號</p>
                </div>
                {/* 狀態擊收藏 */}
                <div className={Styles['card-footer']}>
                  <div className={Styles['badge']}>12 人</div>
                  <div className={Styles['status']}>報名中</div>
                  <i className={Styles['ph-heart']} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Brands />
    </>
  )
}
