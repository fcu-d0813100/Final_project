import React, { useState } from 'react';
import Link from 'next/link';
import { PiUser, PiHandbagSimple, PiMagnifyingGlass } from 'react-icons/pi';
import {
  Container,
  Row,
  Col,
  Form,
  Navbar,
  Nav,
  NavDropdown,
  Dropdown,
} from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.scss';

function TopBar() {
  return (
    <>
      <header className={styles.header}>
        <Container fluid>
          <Row className={styles['head-wrap']}>
            {/* 左邊 搜尋*/}
            <Col xs={4} className="p-0">
              <Form className="d-none d-md-block">
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
              <img src="/logo.png" alt="Logo" height="40" />
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
      <Navbar expand="lg" className={styles['nav']}>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav d-md-none"
          className={styles['toggle-btn']}
        />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-center"
        >
          <Nav className={` ${styles['ul']} `}>
            <Nav.Link href="#home" className={styles['li']}>
              首頁
            </Nav.Link>
            <NavDropdown
              title="品牌"
              id="basic-nav-dropdown"
              className={`${styles['li']}`}
              // bsPrefix="custom-dropdown-toggle"
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
              id="basic-nav-dropdown"
              className={styles['li']}
              // bsPrefix="custom-dropdown-toggle"
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
              id="basic-nav-dropdown"
              className={styles['li']}
              // bsPrefix="custom-dropdown-toggle"
            >
              <NavDropdown.Item href="#action/3.1">彩妝師</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">美妝課程</NavDropdown.Item>
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
      </Navbar>
      
    </>
  );
}

export default TopBar;
