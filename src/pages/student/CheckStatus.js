import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

function CheckStatus() {
  const [teamCode, setTeamCode] = useState('');
  const [application, setApplication] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!teamCode.trim()) {
      setError("팀 코드를 입력하세요.");
      return;
    }
    setLoading(true);
    setError('');
    setApplication(null);

    const { data, error } = await supabase
      .from('teams')
      .select(`
        team_code,
        project_topic,
        region,
        class_number,
        applications (
          status,
          created_at,
          rejection_reason,
          requested_items (
            id,
            item_name,
            isbn,
            item_type,
            quantity,
            price,
            currency,
            reason,
            team_members ( name )
          )
        )
      `)
      .eq('team_code', teamCode)
      .limit(1); // As requested, get the first one if multiple exist
      
    if (error) {
      console.error("Error fetching application status:", error);
      setError("신청 내역을 조회하는 중 오류가 발생했습니다.");
    } else if (data && data.length > 0) {
      const result = data[0];
      console.log(result.applications);////////////////////
      console.log(result.applications.length);////////////////////
    // The query returns an array for applications, we expect only one
    const appDetails = result.applications.length > 0 ? result.applications[0] : result.applications;
    if (appDetails) {
      setApplication({ ...result, application: appDetails });
    } else {
      setError("해당 팀의 신청서가 존재하지 않습니다.");
    }
    } else {
      setError("신청 내역이 없습니다. 팀 코드를 확인해 주세요.");
    }
    setLoading(false);
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'submitted': return '제출됨';
      case 'approved': return '승인됨';
      case 'rejected': return '반려됨';
      case 'partially_approved': return '부분 승인됨';
      default: return status;
    }
  }

  return (
    <div className="operator-page-container">
      <div className="header">
        <h1>신청 내역 확인</h1>
        <form onSubmit={handleSearch} className="status-search-form">
          <input 
            type="text"
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
            placeholder="팀 코드 (e.g., A101)"
            disabled={loading}
            />
          <button type="submit" disabled={loading}>
            {loading ? '조회 중...' : '조회'}
          </button>
        </form>
      </div>
      {!application && (<p>팀 코드를 입력하면 신청 내역을 확인할 수 있습니다.</p>)}

      {error && <p className="error-message">{error}</p>}
      
      {application && (
        <div className="card result-display">
          <h3>{application.team_code}팀 신청 내역</h3>
          <p><strong>PJT 주제:</strong> {application.project_topic}</p>
          <p><strong>지역:</strong> {application.region}</p>
          <p><strong>반:</strong> {application.class_number}반</p>
          <p><strong>신청 상태:</strong> {renderStatus(application.application.status)}</p>
          {application.application.rejection_reason && <p><strong>반려 사유:</strong> {application.application.rejection_reason}</p>}

          <div className="app-row-details">
            <h4>신청 교보재 목록</h4>
            <table>
              <thead>
                <tr>
                  <th>사용자</th>
                  <th>항목</th>
                  <th>교보재명</th>
                  <th>교보재 코드(ISBN)</th>
                  <th>수량</th>
                  <th>금액</th>
                  <th>신청 사유</th>
                </tr>
              </thead>
              <tbody>
                {application.application.requested_items.map(item => (
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
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckStatus;