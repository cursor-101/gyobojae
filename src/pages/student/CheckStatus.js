import React, { useState } from 'react';

const mockApplication = {
  teamInfo: {
    region: '서울',
    classNumber: 3,
    teamCode: 'A101',
    projectTopic: 'AI 기반 교보재 추천 시스템',
    members: [
      { studentId: '12345', name: '홍길동' },
      { studentId: '67890', name: '김철수' },
    ],
  },
  materials: [
    { id: 1, type: 'purchase', item_name: 'NVIDIA RTX 4090', quantity: 1, price: 2500000, currency: 'KRW' },
    { id: 2, type: 'existing', item_name: 'Raspberry Pi 4', quantity: 2 },
    { id: 3, type: 'purchase', item_name: '전문가를 위한 파이썬', quantity: 1, price: 45000, currency: 'KRW' },
  ],
  applicationStatus: 'partially_approved', // or 'approved', 'rejected', 'submitted'
  rejectionReason: '일부 품목 반려됨. 내부 보유 도서로 신청 바랍니다.'
};


function CheckStatus() {
  const [teamCode, setTeamCode] = useState('');
  const [foundApplication, setFoundApplication] = useState(null);
  const [wasSearched, setWasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setWasSearched(true);
    if (teamCode === mockApplication.teamInfo.teamCode) {
      setFoundApplication(mockApplication);
    } else {
      setFoundApplication(null);
    }
  };

  return (
    <div>
      <h2>신청 내역 확인</h2>
      <form onSubmit={handleSearch}>
        <input 
          type="text"
          value={teamCode}
          onChange={(e) => setTeamCode(e.target.value)}
          placeholder="팀 코드를 입력하세요 (e.g., A101)"
        />
        <button type="submit">조회</button>
      </form>

      {wasSearched && (
        foundApplication ? (
          <div className="card result-display">
            <h3>{foundApplication.teamInfo.teamCode}팀 신청 내역</h3>
            <p><strong>PJT 주제:</strong> {foundApplication.teamInfo.projectTopic}</p>
            <p><strong>신청 상태:</strong> {foundApplication.applicationStatus}</p>
            {foundApplication.rejectionReason && <p><strong>반려 사유:</strong> {foundApplication.rejectionReason}</p>}
            
            <h4>신청 교보재 목록</h4>
            <ul>
              {foundApplication.materials.map(item => (
                <li key={item.id}>
                  {item.item_name} (수량: {item.quantity})
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>신청 내역이 없습니다. 팀 코드를 확인해 주세요.</p>
        )
      )}
    </div>
  );
}

export default CheckStatus;
