import React from 'react';

const ItemRow = ({ item, index, onItemChange, onRemove, teamMembers }) => {
  const itemTypes = ['서버', '라이선스', '장비', '도서', '도서(이북)', '강의', '기타'];
  const currencies = ['KRW', 'USD'];
  const paymentTypes = ['선불', '후불'];

  const handleChange = (e) => {
    onItemChange(index, e);
  };

  const isExisting = item.type === 'existing';
  // const title = isExisting ? '보유 교보재' : '구매 교보재';

  // Find the student ID for the selected user
  const selectedMember = teamMembers.find(member => member.name === item.user);
  const studentId = selectedMember ? selectedMember.studentId : '';

  return (
    <div className="item-row">
      <h4>{index + 1}.</h4>
      <div className="item-form">
        <div style={{width: "5.5rem"}}>
          <label>사용자</label>
          <select name="user" value={item.user} onChange={handleChange}>
            <option value="">선택</option>
            {teamMembers.filter(m => m.name).map(member => (
              <option key={member.studentId} value={member.name}>{member.name}</option>
            ))}
          </select>
        </div>
        <div style={{width: "5rem"}}>
          <label>학번</label>
          <input type="text" value={studentId} disabled />
        </div>
        <div style={{width: "5.5rem"}}>
          <label>항목</label>
          <select name="item_type" value={item.item_type} onChange={handleChange} disabled={isExisting}>
            {itemTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div style={{width: "10rem"}}>
          <label>교보재명</label>
          <input type="text" name="item_name" value={item.item_name} onChange={handleChange} disabled={isExisting} />
        </div>
        {/* {(item.item_type === '도서' || item.item_type === '도서(이북)') && (
          <div  style={{width: "10rem"}}>
            <label>ISBN</label>
            <input type="text" name="isbn" value={item.isbn} onChange={handleChange} />
          </div>
        )} */}
        <div  style={{width: "10rem"}}>
          <label>ISBN (도서만 해당)</label>
          <input type="text" name="isbn" value={item.isbn} onChange={handleChange} disabled={isExisting || (item.item_type !== '도서' && item.item_type !== '도서(이북)')}/>
        </div>
        <div style={{width: "10rem"}}>
          <label>구매처명</label>
          <input type="text" name="vendor_name" value={item.vendor_name} onChange={handleChange} />
        </div>
        <div>
          <label>구매URL</label>
          <input type="text" name="purchase_url" value={item.purchase_url} onChange={handleChange} />
        </div>
        <div style={{width: "4.5rem"}}>
          <label>금액</label>
          <input type="number" name="price" value={item.price} onChange={handleChange} />
        </div>
        <div style={{width: "4.5rem"}}>
          <label>단위</label>
          <select name="currency" value={item.currency} onChange={handleChange}>
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{width: "3.5rem"}}>
          <label>수량</label>
          <input type="number" name="quantity" value={item.quantity} onChange={handleChange} />
        </div>
        <div>
          <label>총 금액</label>
          <input type="text" value={`${(item.price * item.quantity).toLocaleString()} ${item.currency}`} disabled />
        </div>
        <div style={{width: "15rem"}}>
          <label>신청 사유</label>
          <textarea name="reason" value={item.reason} onChange={handleChange}></textarea>
        </div>
        <div style={{width: "4rem"}}>
          <label>선/후불</label>
          <select name="payment_type" value={item.payment_type} onChange={handleChange}>
            {paymentTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>
      <button onClick={() => onRemove(index)}>X</button>
    </div>
  );
};

export default ItemRow;
