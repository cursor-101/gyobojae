import React from 'react';
import './ServerSpecModal.css'; // Reusing the same CSS

const SubmissionModal = ({ isOpen, status, message, onClose }) => {
  if (!isOpen) {
    return null;
  }

  const renderContent = () => {
    switch (status) {
      case 'submitting':
        return (
          <>
            <h2>신청 검토 중...</h2>
            <p>AI가 신청 사유를 검토하고 있습니다. 잠시만 기다려주세요.</p>
            {/* Could add a spinner here */}
          </>
        );
      case 'success':
        return (
          <>
            <h2>신청 완료!</h2>
            <p>교보재 신청이 성공적으로 제출되었습니다.</p>
            <div className="modal-actions">
              <button onClick={onClose}>닫기</button>
            </div>
          </>
        );
      case 'error':
        return (
          <>
            <h2>신청 반려</h2>
            <p>AI 검토 결과, 신청이 반려되었습니다. 아래 사유를 확인하고 수정해주세요.</p>
            <div className="result-card" style={{borderColor: '#dc3545', backgroundColor: '#f8d7da'}}>
              <p className="rejection-message-text"><strong>반려 사유:</strong>{"\n" + message}</p>
            </div>
            <div className="modal-actions">
              <button onClick={onClose}>닫기</button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default SubmissionModal;
