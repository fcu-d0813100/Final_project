import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';
import styles from './index.module.scss';

const index = ({
    show,
    onHide,
    selectedTypes,
    setSelectedTypes,
    selectedBrands,
    setSelectedBrands,
    applyFilters,
    resetFilters,
}) => {

    // 類型篩選變更邏輯
    const handleTypeChange = (e) => {
        const value = e.target.value;
        if (value === '全部') {
            if (selectedTypes.length === 2) { 
                setSelectedTypes([]);
            } else {
                setSelectedTypes([1, 2]);
            }
        } else {
            setSelectedTypes((prevSelectedTypes) =>
                prevSelectedTypes.includes(value)
                    ? prevSelectedTypes.filter((type) => type !== value) // 取消選擇
                    : [...prevSelectedTypes, value] // 選擇
            );
        }
    };

    // 品牌篩選變更邏輯
    const handleBrandChange = (id) => {
        setSelectedBrands((prev) => 
            prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
        );
    };

    return (
        <BootstrapModal show={show} onHide={onHide} centered>
            <BootstrapModal.Header closeButton>
                <BootstrapModal.Title>篩選條件</BootstrapModal.Title>
            </BootstrapModal.Header>
            <BootstrapModal.Body>
                {/* 類型篩選 */}
                <div className="h6 my-2">類型</div>
                <div className={`${styles["selection-group"]} d-flex`}>
                    <label>
                        <input
                            type="checkbox"
                            value="全部"
                            checked={selectedTypes.length === 2}
                            onChange={handleTypeChange} // 全選/取消
                        />
                        <span className={`btn round ${styles.button}`}>全部</span>
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value={2}
                            checked={selectedTypes.includes(2)}
                            onChange={(e) => setSelectedTypes(prev => e.target.checked ? [...prev, 2] : prev.filter(type => type !== 2))}
                        />
                        <span className={`btn round ${styles.button}`}>現金券</span>
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value={1}
                            checked={selectedTypes.includes(1)}
                            onChange={(e) => setSelectedTypes(prev => e.target.checked ? [...prev, 1] : prev.filter(type => type !== 1))}
                        />
                        <span className={`btn round ${styles.button}`}>折扣券</span>
                    </label>
                    {/* <label>
                        <input
                            type="checkbox"
                            value={3}
                            checked={selectedTypes.includes(3)}
                            onChange={(e) => setSelectedTypes(prev => e.target.checked ? [...prev, 3] : prev.filter(type => type !== 3))}
                        />
                        <span className={`btn round ${styles.button}`}>VIP券</span>
                    </label> */}
                </div>

                {/* 品牌篩選 */}
                <div className="h6 my-2">品牌</div>
                <div className={`${styles["selection-group"]} d-flex flex-wrap`}>
                    <label>
                        <input
                            type="checkbox"
                            value="1"
                            checked={selectedBrands.includes(1)}
                            onChange={() => handleBrandChange(1)}
                        />
                        <span className={`btn round ${styles.button}`}>BOBBI BROWN</span>
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="2"
                            checked={selectedBrands.includes(2)}
                            onChange={() => handleBrandChange(2)}
                        />
                        <span className={`btn round ${styles.button}`}>ESTEE LAUDER</span>
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="3"
                            checked={selectedBrands.includes(3)}
                            onChange={() => handleBrandChange(3)}
                        />
                        <span className={`btn round ${styles.button}`}>LANCOME</span>
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="4"
                            checked={selectedBrands.includes(4)}
                            onChange={() => handleBrandChange(4)}
                        />
                        <span className={`btn round ${styles.button}`}>NARS</span>
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="5"
                            checked={selectedBrands.includes(5)}
                            onChange={() => handleBrandChange(5)}
                        />
                        <span className={`btn round ${styles.button}`}>YSL</span>
                    </label>
                </div>
            </BootstrapModal.Body>
            <BootstrapModal.Footer>
                <button className={`btn btn-secondary ${styles.re}`} onClick={resetFilters}>重設</button>
                <button className={`btn btn-secondary ${styles.re}`} onClick={applyFilters}>確認</button>
            </BootstrapModal.Footer>
        </BootstrapModal>
    );
};

export default index;
