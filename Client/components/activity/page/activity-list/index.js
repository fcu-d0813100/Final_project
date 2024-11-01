import Header from '@/components/home/common/header'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Styles from '@/components/activity/page/activity-list/index.module.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import Brands from '@/components/home/common/brands'
import Footer from '@/components/home/common/footer'
import { Heart } from 'phosphor-react'
import { PiMagnifyingGlass } from 'react-icons/pi'
import Dropdown from '@/components/shared/dropdownList/sample'
import ListCarousel from '@/components/activity/common/ListCarousel/actCarousel'


export default function Activity(props) {
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
        <ListCarousel />
      </div>

      <div className={`${Styles['act-sec1']} container d-none d-lg-block`}>
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
      <div
        className={`${Styles['act-search']} container d-flex flex-wrap justify-content-between`}
      >
        <form
          className={`${Styles['search']} d-flex me-auto my-2 my-lg-0 align-items-center`} // 使表单在小屏幕下满宽
          role="search"
        >
          <input
            className="form-control me-2 rounded-pill border-dark"
            type="search"
            placeholder="活動 |"
            aria-label="Search"
            style={{ height: '30px' }} // 高度保持一致
          />
          <button
            className="btn d-flex align-items-center justify-content-center"
            type="submit"
            style={{ height: '30px', padding: '0 10px' }} // 使按钮高度与输入框一致
          >
            <PiMagnifyingGlass style={{ width: '20px', height: '20px' }} />
          </button>
        </form>

        <div className="ms-auto pc-drop text-center d-lg-block d-none">
          {' '}
          {/* 在大屏幕下显示，其他情况隐藏 */}
          <Dropdown />
        </div>
      </div>

      <div
        className="d-flex d-lg-none justify-content-center
      "
      >
        {' '}
        {/* 小于768px时居中 */}
        <Dropdown />
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
              <Link href="#">
                <div className={Styles['card-img']}>
                  <div className={`${Styles['card-text']} d-flex`}>
                    <div className="currentR">
                      <p className={Styles['num']}>06</p>
                      <p>目前人數</p>
                    </div>
                    <div className="maxR">
                      <p className={Styles['num']}>50</p>
                      <p>報名人數</p>
                    </div>
                    <div className="view">
                      <p className={Styles['num']}>247</p>
                      <p>瀏覽次數</p>
                    </div>
                  </div>
                  <p className={Styles['card-det']}>詳細資訊</p>
                  <Image
                    src={'/activity/BOBBI1_1.png'}
                    width={1200}
                    height={800}
                    alt="BOBBI1_1.png"
                  />
                </div>

                {/* 卡片內資訊 */}
              </Link>
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
                  <div className={Styles['status']}>報名中</div>
                  <Heart className={Styles['ph-heart']} size={24} color="red" />
                </div>
              </div>
            </div>
            {/* 左邊卡片樣式的 中文名字跟英文名字(字在右邊) */}
            <div className={Styles['rightTextCHN']}>奢光派對</div>
            <div className={Styles['rightTextENG']}>YSL BEAUTY LIGHT CLUB </div>
          </div>
          {/* ------------------------------------------------------------- */}
          <div className={`${Styles['cardRight']} d-flex`}>
            {/* 右邊卡片樣式的 中文名字跟英文名字(字在左邊) */}
            <div className={Styles['leftTextCHN']}>奢光派對</div>
            <div className={Styles['leftTextENG']}>YSL BEAUTY LIGHT CLUB </div>
            <div className={Styles['cardR']}>
              <Link href="#">
                <div className={Styles['card-img']}>
                  <div className={`${Styles['card-text']} d-flex`}>
                    <div className="currentR">
                      <p className={Styles['num']}>06</p>
                      <p>目前人數</p>
                    </div>
                    <div className="maxR">
                      <p className={Styles['num']}>50</p>
                      <p>報名人數</p>
                    </div>
                    <div className="view">
                      <p className={Styles['num']}>247</p>
                      <p>瀏覽次數</p>
                    </div>
                  </div>
                  <p className={Styles['card-det']}>詳細資訊</p>
                  <Image
                    src={'/activity/YSL3_1.png'}
                    width={1200}
                    height={800}
                    alt="YSL3_1.png"
                  />
                </div>

                {/* 卡片內資訊 */}
              </Link>

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
                  <div className={Styles['status']}>報名中</div>
                  <Heart className={Styles['ph-heart']} size={24} color="red" />
                </div>
              </div>
            </div>
          </div>
          {/* 左邊款卡片樣式 */}
          <div className={`${Styles['cardLeft']} d-flex`}>
            <div className={Styles['cardL']}>
              {/* 卡片內圖片 */}
              <Link href="#">
                <div className={Styles['card-img']}>
                  <Image
                    src={'/activity/BOBBI1_1.png'}
                    width={1200}
                    height={800}
                    alt="BOBBI1_1.png"
                  />
                </div>
                {/* 卡片內資訊 */}
              </Link>
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
              <Link href="#">
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
              </Link>
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
              <Link href="#">
                <div className={Styles['card-img']}>
                  <Image
                    src={'/activity/BOBBI1_1.png'}
                    width={1200}
                    height={800}
                    alt="BOBBI1_1.png"
                  />
                </div>
                {/* 卡片內資訊 */}
              </Link>
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
              <Link href="#">
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
              </Link>
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
      <Footer />
    </>
  )
}
