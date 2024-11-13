import React, { useState, useEffect } from 'react'
import UserLogin from '@/components/user/pages/user-login'

function UserLoginPage(props) {
  return (
    <>
      <UserLogin />
    </>
  )
}
UserLoginPage.getLayout = function getLayout(page) {
  return page
}
export default UserLoginPage
