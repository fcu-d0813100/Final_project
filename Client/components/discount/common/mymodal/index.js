import React, { useState } from 'react';
import ExModal from '@/components/discount/common/exmodal'; // 確保路徑正確
import styles from './index.module.scss'; // 確保引入正確的樣式
import Button from 'react-bootstrap/Button';
import { IoFunnel } from "react-icons/io5";

function App() {
    const [modalShow, setModalShow] = useState(false);

    const modalBody = {
        title: "篩選",
        content: (
            <>
                <div className="h6 my-2">類型</div>
                <div className={`${styles["selection-group"]} d-flex`}>
                    <label>
                        <input type="checkbox" name="variety" value="全部" /><span class={`round ${styles.button}`}>全部</span>
                    </label>
                    <label>
                        <input type="checkbox" name="variety" value="現金券" /><span class={`round ${styles.button}`}>現金券</span>
                    </label>
                    <label>
                        <input type="checkbox" name="variety" value="折扣券" /><span class={`round ${styles.button}`}>折扣券</span>
                    </label>
                    <label>
                        <input type="checkbox" name="variety" value="VIP券" /><span class={`round ${styles.button}`}>VIP券</span>
                    </label>
                </div>
                <div className="h6 my-2">品牌</div>
                <div className={`${styles["selection-group"]} d-flex flex-wrap`}>
                    <label>
                        <input type="checkbox" name="variety" value="BOBBI BROWN" /><span class={`round ${styles.button}`}>BOBBI BROWN</span>
                    </label>
                    <label>
                        <input type="checkbox" name="variety" value="ESTEE LAUDER" /><span class={`round ${styles.button}`}>ESTEE LAUDER</span>
                    </label>
                    <label>
                        <input type="checkbox" name="variety" value="LANCOME" /><span class={`round ${styles.button}`}>LANCOME</span>
                    </label>
                    <label>
                        <input type="checkbox" name="variety" value="NARS" /><span class={`round ${styles.button}`}>NARS</span>
                    </label>
                    <label>
                        <input type="checkbox" name="variety" value="YSL" /><span class={`round ${styles.button}`}>YSL</span>
                    </label>
                </div>
                <div className="h6 my-2">排序</div>
                <div className={`${styles["selection-group"]} d-flex`}>
                    <label>
                        <input type="checkbox" name="variety" value="使用期限近至遠" /><span class={`round ${styles.button}`}>使用期限近至遠</span>
                    </label>
                    <label>
                        <input type="checkbox" name="variety" value="使用期限遠至近" /><span class={`round ${styles.button}`}>使用期限遠至近</span>
                    </label>
                </div>
            </>
        ),
    };

    return (
        <>
            <button className={styles.btn} onClick={() => setModalShow(true)}>
                <IoFunnel size={25} color='#90957a' />
            </button>

            <ExModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                title={modalBody.title}
                body={modalBody}
            />
        </>
    );
}

export default App;
