import React, { useEffect } from 'react';
import styles from './index.module.scss';
import AdminSection from '@/components/admin/common/admin-section';
import Link from 'next/link';
import { LuPackagePlus,LuShoppingBag } from "react-icons/lu";


export default function Index() {

    return (
        <>
            <AdminSection titleCN="優惠券管理" titleENG="New Coupon">
                <aside className="right">

                    <div className="cart-group d-flex flex-wrap justify-content-evenly align-self-stretch mt-5">
                        <div className={`${styles.cart} p-3 mb-3`}>
                            <div className={styles.text}>
                                <div className="d-flex align-items-start pb-2">
                                <LuShoppingBag size={23} className='text-center'/> 
                                    <div className="h6 ps-2"> 賣場優惠券<br />
                                        <div className="p pt-2"> 適用賣場所有商品，可有效提升全店銷售額</div>
                                    </div>
                                </div>

                            </div>
                            <Link href="/admin/coupon/create/content"><div className={`${styles.btn} text-center`}>建立</div></Link>
                        </div>

                        <div className={`${styles.cart} p-3 mb-3`}>
                            <div className={styles.text}>
                                <div className="d-flex align-items-start pb-2">
                                    <LuPackagePlus size={23} className='text-center'/> 
                                    <div className="h6 ps-2"> 商品優惠券<br />
                                        <div className="p pt-2"> 適用指定商品，可設置特定商品獨家優惠</div>
                                    </div>
                                </div>
                            </div>
                            <Link href="/admin/coupon/create/content">
                                <div className={`${styles.btn} text-center`}>建立</div>
                            </Link>
                        </div>
                    </div>
                </aside>
            </AdminSection>

        </>
    )
}