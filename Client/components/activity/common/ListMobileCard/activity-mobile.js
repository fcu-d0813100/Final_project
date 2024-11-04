import WorkshopCardSm from '@/components/activity/common/ListMobileCard/index'
import React, { useState, useEffect } from 'react'

export default function Sample(props) {
  return (
    <>
      <WorkshopCardSm
        imgCover="/activity/BOBBI1_1.png"
        CHNname="奢光派對"
        ENGname="YSL BEAUTY LIGHT CLUB"
        beginDate="2024/09/30"
        endDate="2024/10/30"
        status="已截止"
      />
    </>
  )
}
