import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { PiUser, PiHandbagSimple, PiMagnifyingGlass } from 'react-icons/pi'
import {
  Container,
  Row,
  Col,
  Form,
  Navbar,
  Nav,
  NavDropdown,
  Dropdown,
  Offcanvas,
} from 'react-bootstrap'
import Headroom from 'react-headroom' // 引入 Headroom
import styles from './index.module.scss'
import { useModal } from '@/hooks/use-modal'
import { useAuth } from '@/hooks/use-auth'
// 根據 user 是否存在來決定跳轉的鏈接
// const userLink = auth ? '/user' : '/user/login/user'
// 初始化用戶資料
// 獲取用戶信息
function TopBar({ cartitems }) {
  //-------阻擋未登入
  const { ensureLoggedIn } = useModal()
  const handleCartClick = () => {
    if (!ensureLoggedIn()) {
      return
    }
    window.location.href = '/cart'
  }

  const [showOffcanvas, setShowOffcanvas] = useState(false)

  const handleClose = () => setShowOffcanvas(false)
  const handleShow = () => setShowOffcanvas(true)

  const [auth, setAuth] = useState({
    isAuth: false, // 表示是否已登入
    userData: {
      id: 0,
      name: '',
      email: '',
      account: '',
      google_uid: '',
      line_uid: '',
      identity: '', // 身分：如 admin、teacher
    },
  })

  const { getUser } = useAuth() // 假設 getUser 是一個返回用戶信息的函數

  useEffect(() => {
    // 如果未獲取用戶數據，嘗試從 getUser 獲取並更新 auth
    if (!auth.isAuth) {
      getUser().then((user) => {
        if (user) {
          setAuth({
            isAuth: true,
            userData: {
              ...user, // 假設 getUser 返回的數據結構與 userData 一致
            },
          })
        }
      })
    }
  }, [auth.isAuth, getUser])

  const getUserLink = () => {
    if (!auth.isAuth) {
      return '/user/login/user' // 如果未登入，跳轉到登入頁面
    }

    switch (auth.userData.identity) {
      case 'admin':
        return '/admin/activity' // 管理員頁面
      case 'teacher':
        return '/teacher/information' // 老師頁面
      default:
        return '/user' // 用戶頁面
    }
  }

  console.log(auth) // 確認 auth 狀態是否正確更新
  console.log(auth.userData.identity)
  console.log(auth.userData.id)

  return (
    <>
      {/* 使用 Headroom 包裹 header 元素 */}
      <Headroom>
        <header className={styles.header}>
          <Container fluid>
            <Row className={styles['head-wrap']}>
              {/* 左邊 搜尋 */}
              <Col xs={4} className="p-0">
                <Form className="d-none d-lg-block">
                  <input
                    type="text"
                    placeholder="新上市口紅 |"
                    className="me-3"
                  />
                  <PiMagnifyingGlass size={22} />
                </Form>
              </Col>

              {/* 中間 Logo */}
              <Col xs={4} className={`${styles['logo']} text-center p-0`}>
                <Link href={'/'}>
                  <img src="/logo.png" alt="Logo" height="40" />
                </Link>
              </Col>

              {/* 右邊 會員中心和購物車 */}
              <Col xs={4} className={`text-end ${styles['header-icons']}`}>
                <Link href={getUserLink()}>
                  <PiUser size={22} className="me-3" />
                </Link>
                <span onClick={handleCartClick} className={styles['cart-icon']}>
                  <PiHandbagSimple size={22} />
                  {auth.userData.id !== undefined &&
                    auth.userData.id !== 0 &&
                    cartitems > 0 && (
                      <span className={styles['cart-number']}>{cartitems}</span>
                    )}
                </span>
              </Col>
            </Row>
          </Container>
        </header>

        {/* Navbar，適用於不同螢幕尺寸的折疊和側邊欄 */}
        <Navbar expand="lg" className={styles['nav']}>
          {/* 小螢幕下的切換按鈕 */}
          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            onClick={handleShow}
            className={`${styles['toggle-btn']} d-lg-none`}
          />

          {/* Horizontal Navbar lg */}
          <Navbar.Collapse
            id="navbar-nav"
            className="justify-content-center d-none d-lg-flex"
          >
            <Nav className={` ${styles['ul']} `}>
              <Nav.Link href="/" className={styles['li']}>
                首頁
              </Nav.Link>
              <NavDropdown
                title="品牌"
                id="brand-nav-dropdown"
                className={styles['li']}
              >
                <Dropdown.Item href="/product/product-list?brand=Bobbi%20Brown">
                  Bobbi Brown
                </Dropdown.Item>
                <Dropdown.Item href="/product/product-list?brand=Estee%20Lauder">
                  Estee Lauder
                </Dropdown.Item>
                <Dropdown.Item href="/product/product-list?brand=LANCOME">
                  Lancome
                </Dropdown.Item>
                <Dropdown.Item href="/product/product-list?brand=NARS">
                  NARS
                </Dropdown.Item>
                <Dropdown.Item href="/product/product-list?brand=YSL">
                  YSL
                </Dropdown.Item>
              </NavDropdown>
              <NavDropdown
                title="彩妝"
                id="makeup-nav-dropdown"
                className={styles['li']}
              >
                <div className={styles['dropdown-content-wrapper']}>
                  <div className={styles['dropdown-section']}>
                    <Dropdown.Header>臉部妝容</Dropdown.Header>
                    <Dropdown.Item href="/product/product-list?main_category=1&sub_category=1">
                      粉底
                    </Dropdown.Item>
                    <Dropdown.Item href="/product/product-list?main_category=1&sub_category=2">
                      遮瑕
                    </Dropdown.Item>
                  </div>
                  <div className={styles['dropdown-section']}>
                    <Dropdown.Header>雙頰妝容</Dropdown.Header>
                    <Dropdown.Item href="/product/product-list?main_category=2&sub_category=3">
                      腮紅
                    </Dropdown.Item>
                    <Dropdown.Item href="/product/product-list?main_category=2&sub_category=4">
                      修容
                    </Dropdown.Item>
                  </div>
                  <div className={styles['dropdown-section']}>
                    <Dropdown.Header>眼部妝容</Dropdown.Header>
                    <Dropdown.Item href="/product/product-list?main_category=3&sub_category=5">
                      眼影
                    </Dropdown.Item>
                    <Dropdown.Item href="/product/product-list?main_category=3&sub_category=6">
                      眼線筆
                    </Dropdown.Item>
                  </div>
                  <div className={styles['dropdown-section']}>
                    <Dropdown.Header>唇部彩妝</Dropdown.Header>
                    <Dropdown.Item href="/product/product-list?main_category=4&sub_category=9">
                      唇膏
                    </Dropdown.Item>
                    <Dropdown.Item href="/product/product-list?main_category=4&sub_category=10">
                      唇彩
                    </Dropdown.Item>
                  </div>
                </div>
              </NavDropdown>
              <Nav.Link href="/discount" className={styles['li']}>
                優惠專區
              </Nav.Link>
              <NavDropdown
                title="美妝課程"
                id="course-nav-dropdown"
                className={styles['li']}
              >
                <NavDropdown.Item href="/teacher">彩妝師</NavDropdown.Item>
                <NavDropdown.Item href="/workshop">美妝課程</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/post" className={styles['li']}>
                美妝社群
              </Nav.Link>
              <Nav.Link href="/activity" className={styles['li']}>
                活動
              </Nav.Link>
              <Nav.Link href="/about" className={styles['li']}>
                About
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>

          {/* 小螢幕下的側邊欄 */}
          <Offcanvas
            show={showOffcanvas}
            onHide={handleClose}
            placement="start"
            className={styles['offcanvas']}
          >
            <Offcanvas.Header
              closeButton
              className={styles['offcanvas-header']}
            >
              <Offcanvas.Title>選單</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className={`flex-column ${styles['ul']}`}>
                <Nav.Link href="/" className={styles['li']}>
                  首頁
                </Nav.Link>
                <NavDropdown
                  title="品牌"
                  id="brand-nav-dropdown"
                  className={styles['li']}
                >
                  <NavDropdown.Item href="/product/product-list?brand=Bobbi%20Brown">
                    Bobbi Brown
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/product/product-list?brand=Estee%20Lauder">
                    Estee Lauder
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/product/product-list?brand=LANCOME">
                    Lancome
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/product/product-list?brand=NARS">
                    NARS
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/product/product-list?brand=YSL">
                    YSL
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title="彩妝"
                  id="makeup-nav-dropdown"
                  className={styles['li']}
                >
                  <div className={styles['dropdown-content-wrapper']}>
                    <div className={styles['dropdown-section']}>
                      <Dropdown.Header>臉部妝容</Dropdown.Header>
                      <Dropdown.Item href="/product/product-list?main_category=1&sub_category=1">
                        粉底
                      </Dropdown.Item>
                      <Dropdown.Item href="/product/product-list?main_category=1&sub_category=2">
                        遮瑕
                      </Dropdown.Item>
                    </div>
                    <div className={styles['dropdown-section']}>
                      <Dropdown.Header>雙頰妝容</Dropdown.Header>
                      <Dropdown.Item href="/product/product-list?main_category=2&sub_category=3">
                        腮紅
                      </Dropdown.Item>
                      <Dropdown.Item href="/product/product-list?main_category=2&sub_category=4">
                        修容
                      </Dropdown.Item>
                    </div>
                    <div className={styles['dropdown-section']}>
                      <Dropdown.Header>眼部妝容</Dropdown.Header>
                      <Dropdown.Item href="/product/product-list?main_category=3&sub_category=5">
                        眼影
                      </Dropdown.Item>
                      <Dropdown.Item href="/product/product-list?main_category=3&sub_category=6">
                        眼線筆
                      </Dropdown.Item>
                    </div>
                    <div className={styles['dropdown-section']}>
                      <Dropdown.Header>唇部彩妝</Dropdown.Header>
                      <Dropdown.Item href="/product/product-list?main_category=4&sub_category=9">
                        唇膏
                      </Dropdown.Item>
                      <Dropdown.Item href="/product/product-list?main_category=4&sub_category=10">
                        唇彩
                      </Dropdown.Item>
                    </div>
                  </div>
                </NavDropdown>
                <Nav.Link href="/discount" className={styles['li']}>
                  優惠專區
                </Nav.Link>
                <NavDropdown
                  title="美妝課程"
                  id="course-nav-dropdown"
                  className={styles['li']}
                >
                  <NavDropdown.Item href="/teacher">彩妝師</NavDropdown.Item>
                  <NavDropdown.Item href="/workshop">美妝課程</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/post" className={styles['li']}>
                  美妝社群
                </Nav.Link>
                <Nav.Link href="/activity" className={styles['li']}>
                  活動
                </Nav.Link>
                <Nav.Link href="/about" className={styles['li']}>
                  About
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
        </Navbar>
      </Headroom>
    </>
  )
}

export default TopBar
