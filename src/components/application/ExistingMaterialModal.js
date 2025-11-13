import React, { useState, useEffect } from 'react';
import './ExistingMaterialModal.css';

const ExistingMaterialModal = ({ isOpen, onClose, onSelect }) => {
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMaterials, setFilteredMaterials] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch('/existing_materials.json')
        .then(response => response.json())
        .then(data => {
          setMaterials(data);
          setFilteredMaterials(data);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    const results = materials.filter(material =>
      material.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.item_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMaterials(results);
  }, [searchTerm, materials]);

  if (!isOpen) {
    return null;
  }

  const handleSelect = (material) => {
    onSelect(material);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>보유 교보재 선택</h2>
        <input
          type="text"
          placeholder="교보재명 또는 항목으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="material-list">
          {filteredMaterials.map((material, index) => (
            <li key={index} onClick={() => handleSelect(material)}>
              <strong>{material.item_name}</strong> ({material.item_type})
            </li>
          ))}
        </ul>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default ExistingMaterialModal;
