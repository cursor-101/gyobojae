import React, { useState } from 'react';
import ItemRow from './ItemRow';
import ExistingMaterialModal from './ExistingMaterialModal';
import ServerSpecModal from './ServerSpecModal';
import ApiUsageModal from './ApiUsageModal';
import './Modal.css';
import existingMaterialsData from '../../data/existing_materials.json';

const Materials = ({ materials, setMaterials, teamMembers, onSubmit, validationError }) => {
  const [isExistingModalOpen, setIsExistingModalOpen] = useState(false);
  const [isServerSpecModalOpen, setIsServerSpecModalOpen] = useState(false);
  const [isApiUsageModalOpen, setIsApiUsageModalOpen] = useState(false);

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
      code: '',
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
    console.log(spec); ////////////////////////
    if (spec.is_existing) {
      // 보유 교보재 등록
      const selectedMaterial = existingMaterialsData.find(item => item.item_name === spec.item_name);

      const newItem = {
        id: Date.now(),
        type: 'existing',
        ...selectedMaterial,
        ...spec,
        user: '',
        vendor_name: '',
        purchase_url: '',
        payment_type: '선불',
      };
      console.log("보유 추가") ///////////////////
      console.log(newItem); ////////////////////////
      setMaterials(prev => [...prev, newItem]);
    } else {
      const newItem = {
        id: Date.now(),
        type: 'purchase',
        ...spec,
        user: '',
        vendor_name: '',
        purchase_url: '',
      };
      console.log("구매 추가") ///////////////////
      console.log(newItem); ////////////////////////
      setMaterials(prev => [...prev, newItem]);
    }
  };

  const addApiUsageItem = (usage) => {
    console.log(usage); /////////////////////////////
    if (usage.is_existing) {
      // 보유 교보재 등록
      const selectedMaterial = existingMaterialsData.find(item => item.item_name === usage.item_name);

      const newItem = {
        id: Date.now(),
        type: 'existing',
        ...selectedMaterial,
        ...usage,
        user: '',
        vendor_name: '',
        purchase_url: '',
        payment_type: '선불',
      };
      console.log("보유 추가") ///////////////////
      console.log(newItem); ////////////////////////
      setMaterials(prev => [...prev, newItem]);
    } else {
      const newItem = {
        id: Date.now(),
        type: 'purchase',
        ...usage,
        user: '',
        vendor_name: '',
        purchase_url: '',
        payment_type: '선불',
      };
      console.log("구매 추가") ///////////////////
      console.log(newItem); ////////////////////////
      setMaterials(prev => [...prev, newItem]);
    }
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

      <div className="submit-container">
        <button onClick={() => setIsServerSpecModalOpen(true)}>서버 스펙 산정 도우미</button>
        <button onClick={() => setIsApiUsageModalOpen(true)}>API 사용량 산정 도우미</button>
      </div>

      <hr/>

      <div className="submit-container">
        {validationError && <p style={{ color: 'red', marginTop: '10px' }}>{validationError}</p>}
        <button onClick={onSubmit} disabled={materials.length === 0}>제출</button>

        <button onClick={() => onSubmit(false)} disabled={materials.length === 0}>제출 (AI검토 우회)</button>
      </div>
    </div>
  );
};

export default Materials;
