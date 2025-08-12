import React, { useState } from 'react';
import AlertModal from './components/AlertModal.jsx';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <h1>메인 페이지</h1>
            <button onClick={() => setIsModalOpen(true)}>알림 띄우기</button>

            <AlertModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="테스트 알림"
                message="이것은 테스트 메시지입니다."
                confirmText="닫기"
            />
        </div>
    );
}

export default App;
