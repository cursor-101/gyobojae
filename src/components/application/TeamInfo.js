import React from 'react';

const TeamInfo = ({ teamInfo, setTeamInfo, onConfirm, isConfirmed }) => {
  const regions = ['서울', '대전', '광주', '구미', '부울경'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeamInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (index, e) => {
    const { name, value } = e.target;
    const members = [...teamInfo.members];
    members[index] = { ...members[index], [name]: value };
    setTeamInfo(prev => ({ ...prev, members }));
  };

  const addMember = () => {
    setTeamInfo(prev => ({
      ...prev,
      members: [...prev.members, { studentId: '', name: '' }]
    }));
  };

  const removeMember = (index) => {
    const members = [...teamInfo.members];
    members.splice(index, 1);
    setTeamInfo(prev => ({ ...prev, members }));
  };

  return (
    <div className="card">
      <h2>팀 정보</h2>
      <div className="team-form">
        <div style={{width: "5.5rem"}}>
          <label>지역</label>
          <select name="region" value={teamInfo.region} onChange={handleInputChange} disabled={isConfirmed}>
            {regions.map(region => <option key={region} value={region}>{region}</option>)}
          </select>
        </div>
        <div style={{width: "3.5rem"}}>
          <label>반</label>
          <input type="number" name="classNumber" value={teamInfo.classNumber} onChange={handleInputChange} min="1" disabled={isConfirmed} />
        </div>
        <div style={{width: "5.5rem"}}>
          <label>팀코드</label>
          <input type="text" name="teamCode" value={teamInfo.teamCode} onChange={handleInputChange} placeholder="A101" disabled={isConfirmed} />
        </div>
        <div style={{flex: 1}}>
          <label>PJT 주제</label>
          <input type="text" name="projectTopic" value={teamInfo.projectTopic} onChange={handleInputChange} disabled={isConfirmed} />
        </div>
      </div>

      <h3>팀원 정보</h3>
      <div className="team-member-form">
        {teamInfo.members.map((member, index) => (
          <div key={index} className="team-member-item">
            <label>팀원 {index+1}</label>
            <input type="text" name="name" value={member.name} onChange={(e) => handleMemberChange(index, e)} placeholder="이름" disabled={isConfirmed} />
            <input type="number" name="studentId" value={member.studentId} onChange={(e) => handleMemberChange(index, e)} placeholder="학번" disabled={isConfirmed} />
            <button onClick={() => removeMember(index)} disabled={isConfirmed}>X</button>
          </div>
        ))}
        <button onClick={addMember} disabled={isConfirmed}>+</button>
      </div>

      <button onClick={onConfirm} disabled={isConfirmed}>
        {isConfirmed ? '확인 완료' : '확인'}
      </button>
    </div>
  );
};

export default TeamInfo;
