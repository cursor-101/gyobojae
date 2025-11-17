import React, { useState } from 'react';
import ItemRow from './ItemRow';
import ExistingMaterialModal from './ExistingMaterialModal';
import ServerSpecModal from './ServerSpecModal';
import ApiUsageModal from './ApiUsageModal';
import SubmissionModal from './SubmissionModal';
import { reviewApplicationReasons } from '../../services/geminiService';
import './ServerSpecModal.css';

const Materials = ({ materials, setMaterials, teamMembers }) => {
  const [isExistingModalOpen, setIsExistingModalOpen] = useState(false);
  const [isServerSpecModalOpen, setIsServerSpecModalOpen] = useState(false);
  const [isApiUsageModalOpen, setIsApiUsageModalOpen] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({ isOpen: false, status: '', message: '' });
  const [validationError, setValidationError] = useState('');

  const addPurchaseItem = () => {
    const newItem = {
      id: Date.now(), // temporary unique id
      type: 'purchase',
      user: '',
      item_type: '서버',
      item_name: '',
      isbn: '',
      vendor_name: '',
      purchase_url: '',
      price: 0,
      currency: 'KRW',
      quantity: 1,
      reason: '',
      payment_type: '선불',
    };
    setMaterials(prev => [...prev, newItem]);
  };

  const addExistingItem = (selectedMaterial) => {
    const newItem = {
      id: Date.now(),
      type: 'existing',
      ...selectedMaterial,
      user: '',
      vendor_name: '',
      purchase_url: '',
      price: 0,
      currency: 'KRW',
      quantity: 1,
      reason: '',
      payment_type: '선불',
    };
    setMaterials(prev => [...prev, newItem]);
  };

  const addSpecItem = (spec) => {
    const newItem = {
      id: Date.now(),
      type: 'purchase',
      ...spec,
      user: '',
      vendor_name: 'Cloud Provider',
      purchase_url: '',
    };
    setMaterials(prev => [...prev, newItem]);
  };

  const addApiUsageItem = (usage) => {
    const newItem = {
      id: Date.now(),
      type: 'purchase',
      ...usage,
      user: '',
      vendor_name: 'API Provider',
      purchase_url: '',
    };
    setMaterials(prev => [...prev, newItem]);
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMaterials = [...materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [name]: value };
    setMaterials(updatedMaterials);
  };

  const removeItem = (index) => {
    const updatedMaterials = [...materials];
    updatedMaterials.splice(index, 1);
    setMaterials(updatedMaterials);
  };

  const handleSubmit = async () => {
    setValidationError('');

    // 2. Validate Materials
    for (let i = 0; i < materials.length; i++) {
      const item = materials[i];
      const itemNum = i + 1;

      if (!item.user) {
        setValidationError(`${itemNum}번 교보재의 사용자를 선택하세요.`);
        return;
      }
      if (!item.reason.trim()) {
        setValidationError(`${itemNum}번 교보재의 신청 사유를 입력하세요.`);
        return;
      }

      if (item.type === 'purchase') {
        if (!item.item_name.trim()) {
          setValidationError(`${itemNum}번 교보재의 교보재명을 입력하세요.`);
          return;
        }
        if (!item.vendor_name.trim()) {
          setValidationError(`${itemNum}번 교보재의 구매처명을 입력하세요.`);
          return;
        }
        if (!item.purchase_url.trim()) {
          setValidationError(`${itemNum}번 교보재의 구매URL을 입력하세요.`);
          return;
        }
        if (item.price <= 0) {
          setValidationError(`${itemNum}번 교보재의 금액은 0보다 커야 합니다.`);
          return;
        }
        if (item.quantity <= 0) {
          setValidationError(`${itemNum}번 교보재의 수량은 0보다 커야 합니다.`);
          return;
        }
      }

      if (item.item_type === '도서' || item.item_type === '도서(이북)') {
        if (!item.isbn.trim()) {
          setValidationError(`도서의 ISBN을 입력하세요.`);
          return;
        }
      }
    }

    setSubmissionStatus({ isOpen: true, status: 'submitting', message: '' });
    
    const reviewResult = await reviewApplicationReasons(materials);

    if (reviewResult.status === 'approved') {
      setSubmissionStatus({ isOpen: true, status: 'success', message: reviewResult.message });
      // In a real app, you would now save the application to the database.
    } else if (reviewResult.status === 'rejected') {
      const detailedMessage = reviewResult.rejectedItems 
        ? reviewResult.rejectedItems.map(item => `${item.itemNumber}번 (${item.itemName}): ${item.reason}`).join('\n')
        : reviewResult.message;
      setSubmissionStatus({ isOpen: true, status: 'error', message: detailedMessage });
    } else if (reviewResult.status === 'error') {
      if (reviewResult.code === 503) {
        setSubmissionStatus({ isOpen: true, status: 'error', message: "API 호출에 실패했습니다. 나중에 다시 시도해주세요." });
      } else {
        setSubmissionStatus({ isOpen: true, status: 'error', message: reviewResult.message || "신청 검토 중 오류가 발생했습니다." });
      }
    } else {
      setSubmissionStatus({ isOpen: true, status: 'error', message: "AI 응답의 형식이 올바르지 않습니다." });
    }
  };

  const closeSubmissionModal = () => {
    if (submissionStatus.status === 'success') {
      // Reset form state or handle navigation
      setMaterials([]); 
    }
    setSubmissionStatus({ isOpen: false, status: '', message: '' });
  };

  return (
    <div className="card">
      <h2>교보재 항목</h2>
      
      <ExistingMaterialModal 
        isOpen={isExistingModalOpen}
        onClose={() => setIsExistingModalOpen(false)}
        onSelect={addExistingItem}
      />

      <ServerSpecModal
        isOpen={isServerSpecModalOpen}
        onClose={() => setIsServerSpecModalOpen(false)}
        onAddSpec={addSpecItem}
      />

      <ApiUsageModal
        isOpen={isApiUsageModalOpen}
        onClose={() => setIsApiUsageModalOpen(false)}
        onAddUsage={addApiUsageItem}
      />

      <SubmissionModal
        isOpen={submissionStatus.isOpen}
        status={submissionStatus.status}
        message={submissionStatus.message}
        onClose={closeSubmissionModal}
      />

      {materials.length === 0 && <p>아직 추가된 교보재가 없습니다.</p>}

      {materials.map((item, index) => (
        <ItemRow 
          key={item.id}
          item={item}
          index={index}
          onItemChange={handleItemChange}
          onRemove={removeItem}
          teamMembers={teamMembers}
        />
      ))}

      <div className="add-container">
        <button onClick={() => setIsExistingModalOpen(true)}>+ 보유 교보재</button>
        <button onClick={addPurchaseItem}>+ 구매 교보재</button>
      </div>

      <button onClick={() => setIsServerSpecModalOpen(true)}>서버 스펙 산정 도우미</button>
      <button onClick={() => setIsApiUsageModalOpen(true)}>API 사용량 산정 도우미</button>

      {validationError && <p style={{ color: 'red', marginTop: '10px' }}>{validationError}</p>}
      <button onClick={handleSubmit} disabled={materials.length === 0}>제출</button>
    </div>
  );
};

export default Materials;
