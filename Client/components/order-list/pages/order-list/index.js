import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Order from '@/components/order-list/common/order';
import styles from './index.module.scss'; // 确保引入正确的样式
import OrderSection from '@/components/order-list/common/order-section';
import Nav from 'react-bootstrap/Nav';

export default function OrderList() {
    const [activeKey, setActiveKey] = useState("全部"); // 设置默认选中的项目
    const [orders, setOrders] = useState([]); // 保存订单列表
    const [filteredOrders, setFilteredOrders] = useState([]); // 保存过滤后的订单
    const [loading, setLoading] = useState(false); // 加载状态
    const router = useRouter();
    const { userId } = router.query; // 从路由中获取 userId

    const handleSelect = (key) => {
        setActiveKey(key); // 点击时更新 activeKey
        filterOrders(key); // 根据选择的状态过滤订单
    };

    const filterOrders = (status) => {
        const filtered = status === "全部" ? orders : orders.filter(order => order.status === status);
        setFilteredOrders(filtered);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) return; // 确保 userId 已加载
            setLoading(true); // 设置加载状态为 true
            try {
                const response = await fetch(`http://localhost:3005/api/order/${userId}`); // 修正 URL
                const data = await response.json();

                const processedData = data.map(order => {
                    let items = [];
                    try {
                        items = JSON.parse(order.items); // 确保 items 是有效的 JSON 数组
                        console.log(items);
                    } catch (error) {
                        console.error('Error parsing items:', error);
                    }
                    return {
                        ...order,
                        items,
                    };
                });

                setOrders(processedData); // 更新订单列表状态
                setFilteredOrders(processedData); // 初始时显示所有订单
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false); // 设置加载状态为 false
            }
        };

        fetchOrders();
    }, [userId]); // 在 userId 变化时重新获取订单

    useEffect(() => {
        filterOrders(activeKey); // 在 orders 更新时也进行过滤
    }, [orders, activeKey]);

    return (
        <OrderSection titleCN="購物清單">
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
                    <Nav.Link className={`${styles.link}`} eventKey="處理中">處理中</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link className={`${styles.link}`} eventKey="已完成">已完成</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className={`${styles["order-list"]} d-flex flex-column nb-2`}>
                {loading ? (
                    <div>加載中...</div>
                ) : filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <Order
                            key={order.order_id}
                            orderId={order.order_id}
                            // orderDate={order.order_date}
                            totalAmount={order.total_amount}
                            status={order.status}
                            items={Array.isArray(order.items) ? order.items : []} // 确保是数组
                        />
                    ))
                ) : (
                    <div>沒有訂單</div>
                )}
            </div>
        </OrderSection>
    );
}
