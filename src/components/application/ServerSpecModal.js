import React, { useState } from 'react';
import { estimateServerSpec } from '../../services/geminiService';
import './Modal.css';

const ServerSpecModal = ({ isOpen, onClose, onAddSpec }) => {
  const [planText, setPlanText] = useState('');
  const [file, setFile] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCalculate = async () => {
    if (!planText && !file) {
      setError("계획을 텍스트로 입력하거나 파일을 업로드해주세요.");
      return;
    }
    setIsCalculating(true);
    setError('');
    
    const response = await estimateServerSpec(planText, file);
    setIsCalculating(false);

    if (response.itemName) {
      setResult({
        item_type: '서버',
        is_existing: response.isExisting,
        item_name: response.itemName,
        price: response.price,
        currency: response.currency,
        reason: response.reason,
        quantity: 1,
      });
    } else if (response.status === 'error') {
      if (response.code === 503) {
        setError("API 호출에 실패했습니다. 나중에 다시 시도해주세요.");
      } else {
        setError(response.message || "AI 응답의 형식이 올바르지 않습니다.");
      }
    } else {
      setError("AI 응답의 형식이 올바르지 않습니다.");
    }
  };

  const handleAddToList = () => {
    onAddSpec(result);
    handleClose();
  };

  const handleClose = () => {
    setPlanText('');
    setFile(null);
    setResult(null);
    setError('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {!result && (
          <>
            <h2>서버 스펙 산정 도우미</h2>
            <p>서버 사용 계획을 설명하거나 관련 파일을 업로드해주세요.</p>
            <textarea
              rows="10"
              placeholder="예: Python FastAPI 백엔드 서버, 동시 접속자 20명 예상, 이미지 처리 기능 포함..."
              value={planText}
              onChange={(e) => setPlanText(e.target.value)}
              disabled={isCalculating}
            ></textarea>
            <input type="file" onChange={handleFileChange} disabled={isCalculating} accept=".pdf" />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="modal-actions">
              <button onClick={handleCalculate} disabled={(!planText && !file) || isCalculating}>
                {isCalculating ? '산정 중...' : '산정하기'}
              </button>
              <button onClick={handleClose} className="cancel-btn">닫기</button>
            </div>
          </>
        )}
        {result && (
          <>
            <h2>서버 스펙 추천</h2>
            <div className="result-card">
              <p><strong>항목:</strong> {result.item_type}</p>
              <p><strong>교보재명:</strong> {result.item_name}</p>
              <p><strong>예상 금액:</strong> {result.price.toLocaleString()} {result.currency}</p>
              <p><strong>산정 사유:</strong> {result.reason}</p>
            </div>
            <div className="modal-actions">
              <button onClick={handleAddToList}>목록에 추가</button>
              <button onClick={handleClose} className="cancel-btn">닫기</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServerSpecModal;
