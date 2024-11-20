import React, { useEffect, useState } from 'react';
import Order from '@/components/order-list/common/order'; // 引入訂單組件
import styles from './index.module.scss'; // 確保正確引入樣式
import OrderSection from '@/components/order-list/common/order-section'; // 訂單區段組件
import Nav from 'react-bootstrap/Nav'; // 引入Bootstrap的Nav組件，用於導航
import { useAuth } from '@/hooks/use-auth'; // 自定義的驗證Hook，用來獲取用戶信息
import { HiMiniMagnifyingGlass } from "react-icons/hi2"; // 引入放大鏡圖標
import Link from 'next/link';

export default function OrderList() {
    const { auth } = useAuth(); // 使用useAuth hook來獲取用戶的驗證信息
    const [activeKey, setActiveKey] = useState("全部"); // 設置默認選中的項目
    const [orders, setOrders] = useState([]); // 用來保存所有訂單
    const [filteredOrders, setFilteredOrders] = useState([]); // 用來保存過濾後的訂單
    const [loading, setLoading] = useState(false); // 用來標識加載狀態
    const [searchTerm, setSearchTerm] = useState(''); // 用來保存搜尋框的內容

    // 從 AuthContext 獲取 userId
    const userId = auth.isAuth ? auth.userData.id : null;
    console.log("用戶 ID 從 auth:", userId); // 打印 userId 來確認

    const handleSelect = (key) => {
        setActiveKey(key); // 點擊時更新 activeKey
        filterOrders(key, searchTerm); // 根據選擇的狀態和搜索內容過濾訂單
    };

    const handleSearch = () => {
        filterOrders(activeKey, searchTerm); // 搜索按鈕點擊時觸發過濾
    };

    const filterOrders = (status, search) => {
        // 根據訂單狀態過濾訂單
        const filteredByStatus = status === "全部" ? orders : orders.filter(order => order.status === status);

        // 根據訂單編號或商品名稱過濾
        const filtered = filteredByStatus.filter(order => {
            const orderMatches = order.order_number.includes(search); // 訂單編號匹配
            const itemMatches = order.items.some(item =>
                item.product_name.toLowerCase().includes(search.toLowerCase()) // 商品名稱匹配
            );
            const worckshopMatches = order.items.some(item =>
                item.type.toLowerCase().includes(search.toLowerCase()) // 課程名稱匹配
            );
            const brandsMatches = order.items.some(item =>
                item.name.toLowerCase().includes(search.toLowerCase()) // 品牌名稱匹配
            );
            const teacherMatches = order.items.some(item =>
                item.teachers_name.toLowerCase().includes(search.toLowerCase()) // 品牌名稱匹配
            );
            return orderMatches || itemMatches || worckshopMatches || brandsMatches || teacherMatches; // 任一條件匹配即可
        });

        setFilteredOrders(filtered); // 更新過濾後的訂單
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) return; // 確保 userId 已經加載
            setLoading(true); // 設置加載狀態為 true
            try {
                const response = await fetch(`http://localhost:3005/api/order/${userId}`); // 根據 userId 請求訂單
                const data = await response.json(); // 解析回應數據

                const processedData = data.map(order => {
                    let items = [];
                    try {
                        items = JSON.parse(order.items); // 確保 items 是有效的 JSON 數組
                        // console.log(items);
                    } catch (error) {
                        console.error('解析 items 發生錯誤:', error);
                    }
                    return {
                        ...order,
                        items,
                    };
                });

                setOrders(processedData); // 更新所有訂單
                setFilteredOrders(processedData); // 初始顯示所有訂單
            } catch (error) {
                console.error('請求訂單時發生錯誤:', error); // 請求錯誤處理
            } finally {
                setLoading(false); // 結束加載
            }
        };

        fetchOrders();
    }, [userId]); // 當 userId 變動時重新請求訂單

    return (
        <OrderSection>
            <div className={styles.top}>
                <div className={`d-flex justify-content-between align-items-center ${styles.title}`}>
                    <div className={`${styles["title-left"]} h3 p-2`}>訂單查詢</div>
                    <div className={`d-flex align-items-center ${styles.search}`}>
                        <input
                            type="text"
                            placeholder="搜尋訂單編號或商品名稱"
                            className={`form-control`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // 即時更新搜尋內容
                        />
                        <button
                            className={`btn ms-2 ${styles.searchBtn}`}
                            onClick={handleSearch} // 搜索按鈕點擊時觸發過濾
                        >
                            <HiMiniMagnifyingGlass size={24} color='#90957a' />
                        </button>
                    </div>
                </div>

                <Nav
                    className={`justify-content-center align-items-center ${styles.navBar}`}
                    variant='underline'
                    activeKey={activeKey}
                    onSelect={handleSelect}
                >
                    <Nav.Item>
                        <Nav.Link className={`${styles.link}`} eventKey="全部">全部</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className={`${styles.link}`} eventKey="未付款">未付款</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className={`${styles.link}`} eventKey="已付款">已完成</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
            <div className={`${styles["order-list"]} d-flex flex-column nb-2`}>
                {loading ? (
                    <div>加載中...</div> // 顯示加載中的訊息
                ) : filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <Order
                            key={order.order_id}
                            orderId={order.order_id}
                            order_number={order.order_number}
                            totalAmount={order.total_amount}
                            status={order.status === "已付款" ? "已完成" : "未付款"} // 根據訂單狀態顯示對應的狀態
                            items={Array.isArray(order.items) ? order.items : []} // 確保 items 是數組
                        />
                    ))
                ) : (
                    <>
                        <div className={`row ${styles.line}`}>
                            <div
                                className={`col-12 ${styles['favorite-area']} d-flex justify-content-center align-items-center`}
                            >
                                <h5 className="h5">目前沒有訂單資料</h5>
                            </div>
                            <div className="col-12 d-flex justify-content-center align-items-center mt-5">
                                <h5 className="p">您在本商城沒有訂單，快去購買喜愛的商品吧</h5>
                            </div>
                            <div className="col-12 d-flex justify-content-center align-items-center my-5">
                                <Link href="/product/product-list" passHref>
                                    <button className="btn-primary h6">前往選購</button>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </OrderSection>
    );
}
