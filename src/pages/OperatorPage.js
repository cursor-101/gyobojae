import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function escapeCSV(value) {
    // 문자열에 쉼표, 줄바꿈, 큰따옴표가 포함되어 있는지 확인
    if (typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('"'))) {
        // 큰따옴표를 이중 큰따옴표로 변환
        value = value.replace(/"/g, '""');
        // 문자열을 큰따옴표로 감싸기
        return `"${value}"`;
    }
    return value;
}

// --- Sub-component for each application row ---
const ApplicationRow = ({ app, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const totalPrice = app.requested_items.reduce((acc, item) => {
    if (item.currency === 'KRW') {
      return acc + item.quantity * item.price;
    } else {
      return acc + 1500 * item.quantity * item.price;
    }
  }, 0);

  return (
    <div className="app-row-container">
      <div className="app-row-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="app-region">{app.teams.region}</span>
        <span className="app-class">{app.teams.class_number}반</span>
        <span className="app-team-code">{app.teams.team_code}</span>
        <span className="app-project-topic">{app.teams.project_topic}</span>
        <span className="app-total-price">₩ {totalPrice.toLocaleString()}</span>
        {/* <span className="app-created-date">{new Date(app.created_at).toLocaleDateString()}</span> */}
      </div>
      {isOpen && (
        <div className="app-row-details">
          <h4>신청 교보재 목록</h4>
          <table>
            <thead>
              <tr>
                <th>사용자</th>
                <th>항목</th>
                <th>교보재명</th>
                <th>ISBN(교보재 코드)</th>
                <th>수량</th>
                <th>금액(원)</th>
                <th>신청 사유</th>
              </tr>
            </thead>
            <tbody>
              {app.requested_items.map(item => (
                <tr key={item.id}>
                  <td>{item.team_members ? item.team_members.name : 'N/A'}</td>
                  <td>{item.item_type}</td>
                  <td>{item.item_name}</td>
                  <td>{item.isbn}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toLocaleString()} {item.currency}</td>
                  <td>{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pass the team's ID to the delete function */}
          <button className="delete-btn" onClick={() => onDelete(app.teams.id)}>신청 내역 삭제</button>
        </div>
      )}
    </div>
  );
};


function OperatorPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select(
        `
        id,
        status,
        created_at,
        teams (
          id,
          team_code,
          region,
          class_number,
          project_topic,
          team_members ( student_id, name ) 
        ),
        requested_items (
          *,
          team_members ( student_id, name )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      setError("신청 내역을 불러오는 중 오류가 발생했습니다.");
    } else {
      setApplications(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (teamId) => {
    if (window.confirm("정말로 이 신청 내역을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      const { error } = await supabase.from('teams').delete().eq('id', teamId);
      if (error) {
        console.error('Error deleting application:', error);
        alert(`삭제 실패: ${error.message}`);
      } else {
        // Remove the deleted application from the local state to update the UI
        setApplications(prev => prev.filter(app => app.teams.id !== teamId));
      }
    }
  };
  
  const handleDownloadCsv = () => {
    const header = "지역,반,학번,사용자,팀코드,PJT주제,항목,교보재명,교보재코드(도서의 경우 ISBN),구매처명,구매URL,외화,원화,수량,금액,신청사유,선/후불";

    const rows = applications.flatMap(app => 
      app.requested_items.map(item => {
        const foreignCurrency = item.currency !== 'KRW' ? item.price : '';
        const koreanCurrency = item.currency === 'KRW' ? item.price : '';
        const totalAmount = (foreignCurrency * 1500 + koreanCurrency) * item.quantity; // USD 1500원

        return [
          app.teams.region,
          app.teams.class_number,
          item.team_members.student_id,
          item.team_members.name,
          app.teams.team_code,
          escapeCSV(app.teams.project_topic),
          item.item_type,
          escapeCSV(item.item_name),
          item.isbn,
          escapeCSV(item.vendor_name),
          escapeCSV(item.purchase_url),
          foreignCurrency,
          koreanCurrency,
          item.quantity,
          totalAmount,
          escapeCSV(item.reason),
          item.payment_type
        ].join(',');
      })
    );

    
    const csvContent = "\uFEFF" + [header, ...rows].join('\n'); // Add BOM for Excel compatibility with UTF-8 
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '교보재_신청_내역.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  if (loading) {
    return <div><h2>운영자 페이지</h2><p>신청 내역을 불러오는 중...</p></div>;
  }
  
  if (error) {
    return <div><h2>운영자 페이지</h2><p style={{color: 'red'}}>{error}</p></div>;
  }

  return (
    <div className="operator-page-container">
      <div className="header">
        <h1>운영자 페이지</h1>
        <button onClick={handleDownloadCsv} className="download-csv-btn">
          파일 다운로드
        </button>
      </div>
      <p>전체 신청 팀의 교보재 목록을 확인하고 관리합니다.</p>
      
      <div className="applications-list">
        <div className="app-list-header">
          <span>지역</span>
          <span>반</span>
          <span>팀 코드</span>
          <span>PJT 주제</span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span>총액</span>
          {/* <span>신청일</span> */}
        </div>
        {applications.map(app => (
          <ApplicationRow key={app.id} app={app} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default OperatorPage;
