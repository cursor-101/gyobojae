import React, { useState } from 'react';
import TeamInfo from '../../components/application/TeamInfo';
import Materials from '../../components/application/Materials';

function ApplicationForm() {
  const [teamInfo, setTeamInfo] = useState({
    region: '서울',
    classNumber: 1,
    teamCode: '',
    projectTopic: '',
    members: Array(6).fill({ studentId: '', name: '' }),
  });
  const [isTeamInfoConfirmed, setIsTeamInfoConfirmed] = useState(false);
  const [teamInfoError, setTeamInfoError] = useState('');
  const [materials, setMaterials] = useState([]);

  const handleTeamInfoConfirm = () => {
    setTeamInfoError('');
    if (!teamInfo.teamCode.trim() || !teamInfo.projectTopic.trim()) {
      setTeamInfoError('팀 코드와 PJT 주제를 모두 입력하세요.');
      return;
    }
    for (let i = 0; i < teamInfo.members.length; i++) {
      const member = teamInfo.members[i];
      if (!member.name.trim() || !member.studentId.trim()) {
        setTeamInfoError(`팀원 ${i + 1}의 학번, 이름을 모두 입력하세요.`);
        return;
      }
    }
    setIsTeamInfoConfirmed(true);
  };

  return (
    <div>
      <h1>교보재 신청</h1>
      <TeamInfo 
        teamInfo={teamInfo}
        setTeamInfo={setTeamInfo}
        onConfirm={handleTeamInfoConfirm}
        isConfirmed={isTeamInfoConfirmed}
        error={teamInfoError}
      />
      {isTeamInfoConfirmed && (
        <Materials 
          materials={materials}
          setMaterials={setMaterials}
          teamMembers={teamInfo.members}
        />
      )}
    </div>
  );
}

export default ApplicationForm;
