import React, { useState } from 'react';
import UserSection from '@/components/user/common/user-section';

export default function Index() {
    const [modalShow, setModalShow] = useState(false); // 使用狀態來控制模態框顯示

    return (
        <>
            {/* titleENG='Coupon' */}
            <UserSection titleCN="歷史紀錄"  >

            </UserSection>
        </>
    );
}
