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
  const [materials, setMaterials] = useState([]);

  const handleTeamInfoConfirm = () => {
    // Add validation logic here later
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
