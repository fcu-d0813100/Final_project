'use client'
import WorkshopCardSm from '@/components/shared/workshop-card-sm-y'
import React, { useState, useEffect } from 'react'

export default function Sample(props) {
  return (
    <>
      <WorkshopCardSm
        imgCover="/workshop/workshop_img/1-1-c.jpg"
        name="F19時尚攝影妝容班"
        teacher="Terry Barber"
        beginDate="2024/09/30"
        endDate="2024/10/30"
        price="3200"
        status="已截止"
      />
    </>
  )
}
