import React, { useState, useEffect } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'

export default function ActivityDet() {
  const [mapHeight, setMapHeight] = useState('400px') // 預設值

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateHeight = () => {
        setMapHeight(window.innerWidth <= 390 ? '200px' : '400px')
      }

      updateHeight() // 初始化高度
      window.addEventListener('resize', updateHeight)

      return () => {
        window.removeEventListener('resize', updateHeight)
      }
    }
  }, []) // 空依賴陣列表示只在第一次渲染後執行

  return (
    <div
      style={{
        width: '100%',
        height: mapHeight,
      }}
    >
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: mapHeight,
        }}
        center={{ lat: 0, lng: 0 }} // 替換為您的默認座標
        zoom={15}
      >
        <Marker position={{ lat: 0, lng: 0 }} /> {/* 替換為您的實際座標 */}
      </GoogleMap>
    </div>
  )
}
