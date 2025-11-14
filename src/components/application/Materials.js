import React, { useState } from 'react';
import ItemRow from './ItemRow';
import ExistingMaterialModal from './ExistingMaterialModal';

const Materials = ({ materials, setMaterials, teamMembers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      ...selectedMaterial, // This includes item_type and item_name
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={addExistingItem}
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
        <button onClick={() => setIsModalOpen(true)}>+ 보유 교보재</button>
        <button onClick={addPurchaseItem}>+ 구매 교보재</button>
      </div>

      <button>서버 스펙 산정 도우미</button>
      <button>API 사용량 산정 도우미</button>

      <button disabled={materials.length === 0}>제출</button>
    </div>
  );
};

export default Materials;
