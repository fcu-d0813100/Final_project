import React, { useState } from 'react'
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
import styles from './index.module.scss'

function TopBar() {
  const [showOffcanvas, setShowOffcanvas] = useState(false)

  const handleClose = () => setShowOffcanvas(false)
  const handleShow = () => setShowOffcanvas(true)

  return (
    <>
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
              <Link href="/user">
                <PiUser size={22} className="me-3" />
              </Link>
              <Link href="/cart">
                <PiHandbagSimple size={22} />
              </Link>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Navbar with collapse and offcanvas for different screen sizes */}
      <Navbar expand="lg" className={styles['nav']}>
        {/* Toggle button sm */}
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
              <NavDropdown.Item href="#action/3.1">
                Bobbi Brown
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Estee Lauder
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Lancome</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4">NARS</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.5">YSL</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title="彩妝"
              id="makeup-nav-dropdown"
              className={styles['li']}
            >
              <div className={styles['dropdown-content-wrapper']}>
                <div className={styles['dropdown-section']}>
                  <Dropdown.Header>臉部妝容</Dropdown.Header>
                  <Dropdown.Item href="#action/3.1.1">粉底</Dropdown.Item>
                  <Dropdown.Item href="#action/3.1.2">遮瑕</Dropdown.Item>
                </div>
                <div className={styles['dropdown-section']}>
                  <Dropdown.Header>雙頰妝容</Dropdown.Header>
                  <Dropdown.Item href="#action/3.2.1">腮紅</Dropdown.Item>
                  <Dropdown.Item href="#action/3.2.2">修容</Dropdown.Item>
                </div>
                <div className={styles['dropdown-section']}>
                  <Dropdown.Header>眼部妝容</Dropdown.Header>
                  <Dropdown.Item href="#action/3.3.1">眼影</Dropdown.Item>
                  <Dropdown.Item href="#action/3.3.2">眼線筆</Dropdown.Item>
                </div>
                <div className={styles['dropdown-section']}>
                  <Dropdown.Header>唇部彩妝</Dropdown.Header>
                  <Dropdown.Item href="#action/3.4.1">唇膏</Dropdown.Item>
                  <Dropdown.Item href="#action/3.4.2">唇彩</Dropdown.Item>
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

        {/* Offcanvas sm */}
        <Offcanvas
          show={showOffcanvas}
          onHide={handleClose}
          placement="start"
          className={styles['offcanvas']}
        >
          <Offcanvas.Header closeButton className={styles['offcanvas-header']}>
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
                <NavDropdown.Item href="#action/3.1">
                  Bobbi Brown
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Estee Lauder
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Lancome</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.4">NARS</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.5">YSL</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title="彩妝"
                id="makeup-nav-dropdown"
                className={styles['li']}
              >
                <div className={styles['dropdown-content-wrapper']}>
                  <div className={styles['dropdown-section']}>
                    <Dropdown.Header>臉部妝容</Dropdown.Header>
                    <Dropdown.Item href="#action/3.1.1">粉底</Dropdown.Item>
                    <Dropdown.Item href="#action/3.1.2">遮瑕</Dropdown.Item>
                  </div>
                  <div className={styles['dropdown-section']}>
                    <Dropdown.Header>雙頰妝容</Dropdown.Header>
                    <Dropdown.Item href="#action/3.2.1">腮紅</Dropdown.Item>
                    <Dropdown.Item href="#action/3.2.2">修容</Dropdown.Item>
                  </div>
                  <div className={styles['dropdown-section']}>
                    <Dropdown.Header>眼部妝容</Dropdown.Header>
                    <Dropdown.Item href="#action/3.3.1">眼影</Dropdown.Item>
                    <Dropdown.Item href="#action/3.3.2">眼線筆</Dropdown.Item>
                  </div>
                  <div className={styles['dropdown-section']}>
                    <Dropdown.Header>唇部彩妝</Dropdown.Header>
                    <Dropdown.Item href="#action/3.4.1">唇膏</Dropdown.Item>
                    <Dropdown.Item href="#action/3.4.2">唇彩</Dropdown.Item>
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
    </>
  )
}

export default TopBar
