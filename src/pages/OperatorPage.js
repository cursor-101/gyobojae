import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
// All CSS is in App.css

// --- Sub-component for each application row ---
const ApplicationRow = ({ app, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="app-row-container">
      <div className="app-row-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="app-region">{app.teams.region}</span>
        <span className="app-class">{app.teams.class_number}반</span>
        <span className="app-team-code">{app.teams.team_code}</span>
        <span className="app-project-topic">{app.teams.project_topic}</span>
        <span className="app-created-date">{new Date(app.created_at).toLocaleDateString()}</span>
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
                <th>수량</th>
                <th>금액</th>
                <th>신청 사유</th>
              </tr>
            </thead>
            <tbody>
              {app.requested_items.map(item => (
                <tr key={item.id}>
                  <td>{item.team_members ? item.team_members.name : 'N/A'}</td>
                  <td>{item.item_type}</td>
                  <td>{item.item_name}</td>
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
      .select(`
        id,
        status,
        created_at,
        teams (
          id,
          team_code,
          region,
          class_number,
          project_topic
        ),
        requested_items (
          id,
          item_name,
          item_type,
          quantity,
          price,
          currency,
          reason,
          team_members ( name )
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
    console.log("CSV 다운로드 기능 구현 예정");
    // In a real implementation, you would generate and download a CSV file here.
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
          <span>신청일</span>
        </div>
        {applications.map(app => (
          <ApplicationRow key={app.id} app={app} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default OperatorPage;