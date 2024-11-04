import React from 'react'
import Dropdown from '@/components/shared/dropdownList/index'

export default function Sample() {
  return (
    <>
      {/* 下拉式選單超過一個記得要加 d-flex */}
      {/* name是下拉式選單名稱 */}
      {/* items是下拉式選單裡的選項 */}
      <div
        className="d-flex
    "
      >
        <Dropdown
          name="狀態"
          items={[
            { option: '報名中', link: '/page1' },
            { option: '已截止', link: '/page1' },
          ]}
        />

        <div className="mobile-drop d-block d-lg-none">
          {' '}
          {/* RWD範例 */}
          <Dropdown
            name="月份"
            items={[
              { option: 'ALL', link: '/page1' },
              { option: '1月', link: '/page1' },
              { option: '2月', link: '/page1' },
              { option: '3月', link: '/page1' },
              { option: '4月', link: '/page1' },
              { option: '5月', link: '/page1' },
              { option: '6月', link: '/page1' },
              { option: '7月', link: '/page1' },
              { option: '8月', link: '/page1' },
              { option: '9月', link: '/page1' },
              { option: '10月', link: '/page1' },
              { option: '11月', link: '/page1' },
              { option: '12月', link: '/page1' },
            ]}
          />
        </div>
      </div>
    </>
  )
}
//
