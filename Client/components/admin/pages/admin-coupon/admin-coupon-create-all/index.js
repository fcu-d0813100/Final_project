import React, { useEffect } from 'react';
import styles from './index.module.scss';
import AdminSection from '@/components/admin/common/admin-section';

export default function Index() {

    return (
        <>
            <AdminSection titleCN="建立優惠券">

                <div className={`${styles["msg-group"]} d-flex flex-column align-items-center`}>
                    <div className={`${styles["msg-title"]} h5 my-4`}>基本資料</div>

                    <div className="d-flex flex-column align-items-end ">
                        <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>優惠券名稱</div>
                            <input type="text" placeholder="請輸入" />
                        </div>


                        <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>優惠代碼</div>
                            <div className="d-flex flex-column">
                                <div className={`d-flex ${styles.dscode}`}>
                                    <input type="text" placeholder="請輸入" />
                                    <button className={`${styles.success} btn-success ms-2`}>隨機生成</button>
                                </div>
                                <div className={styles.ps}>請輸入A-Z、a-z、0-9，最多輸入8個字元。</div>
                            </div>
                        </div>


                        <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>可使用期限</div>
                            <div className={`${styles.exdate} d-flex align-items-center justify-content-between`}>
                                <input type="date" name="" id="" />
                                <div className={styles.line}></div>
                                <input type="date" name="" id="" />
                            </div>
                        </div>



                        <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>活動類型 | 折扣額度限制</div>
                            <div className={`input-group d-flex ${styles.discount}`}>
                                <button id="dropdownButton" class={`${styles["btn-dp"]} dropdown-toggle`} type="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">折扣金額</button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#" onclick="changeButtonText('折扣金額')">折扣金額</a></li>
                                    <li><a className="dropdown-item" href="#" onclick="changeButtonText('折扣折數')">折扣折數</a></li>
                                </ul>
                                <input type="text" className="form-control" aria-label="Text input with dropdown button"/>
                            </div>
                        </div>


                        <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>最低消費額度</div>
                            <input type="text" placeholder="NT$ ｜請輸入" />
                        </div>

                        <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>可使用數量</div>
                            <input type="text" placeholder="請輸入" />
                        </div>

                        <div className={`${styles["input-gp"]} d-flex justify-content-between align-self-stretch align-items-center`}>
                            <div className={styles.name}>每個買家最大配額</div>
                            <input type="text" placeholder="請輸入" />
                        </div>
                        <hr className="align-self-stretch" />
                    </div>
                    <div className={`${styles["btn-gp"]} d-flex`}>
                        <button className={`h6 btn-secondary me-5 ${styles.btn}`}>儲存</button>
                        <button className={`h6 btn-primary ${styles.btn}`}>取消</button>
                    </div>
                </div>

            </AdminSection>
        </>
    )
}