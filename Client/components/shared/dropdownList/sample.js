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
            { option: '項目一', link: '/page1' },
            { option: '項目二', link: '/page1' },
          ]}
        />

        <div className="mobile-drop d-block d-lg-none">
          {' '}
          {/* RWD範例 */}
          <Dropdown
            name="月份"
            items={[
              'ALL',
              '1月',
              '2月',
              '3月',
              '4月',
              '5月',
              '6月',
              '7月',
              '8月',
              '9月',
              '10月',
              '11月',
              '12月',
            ]}
          />
        </div>
      </div>
    </>
  )
}
//
