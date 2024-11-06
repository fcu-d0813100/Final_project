import React from 'react'
import Dropdown from '@/components/shared/dropdownList/index'

export default function Sample() {
  return (
    <>
      <div className="d-flex">
        <Dropdown
          name="狀態"
          items={[
            { option: '報名中', link: '/activity?status=1' },
            { option: '已截止', link: '/activity?status=0' },
          ]}
        />
        <div className="mobile-drop d-block d-lg-none">
          <Dropdown
            name="月份"
            items={[
              { option: 'ALL', link: '/activity' },
              { option: '1月', link: '/activity?month=1' },
              { option: '2月', link: '/activity?month=2' },
              { option: '3月', link: '/activity?month=3' },
              { option: '4月', link: '/activity?month=4' },
              { option: '5月', link: '/activity?month=5' },
              { option: '6月', link: '/activity?month=6' },
              { option: '7月', link: '/activity?month=7' },
              { option: '8月', link: '/activity?month=8' },
              { option: '9月', link: '/activity?month=9' },
              { option: '10月', link: '/activity?month=10' },
              { option: '11月', link: '/activity?month=11' },
              { option: '12月', link: '/activity?month=12' },
            ]}
          />
        </div>
      </div>
    </>
  )
}
