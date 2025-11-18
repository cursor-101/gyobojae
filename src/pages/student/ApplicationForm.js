import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamInfo from '../../components/application/TeamInfo';
import Materials from '../../components/application/Materials';
import SubmissionModal from '../../components/application/SubmissionModal';
import { supabase } from '../../supabaseClient';
import { reviewApplicationReasons } from '../../services/geminiService';

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
  const [submissionStatus, setSubmissionStatus] = useState({ isOpen: false, status: '', message: '' });
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

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

  const handleSubmit = async (useAI = false) => {
    setValidationError('');

    // Materials validation
    for (let i = 0; i < materials.length; i++) {
      const item = materials[i];
      const itemNum = i + 1;
      if (!item.user) { setValidationError(`${itemNum}번 교보재의 사용자를 선택하세요.`); return; }
      if (!item.reason.trim()) { setValidationError(`${itemNum}번 교보재의 신청 사유를 입력하세요.`); return; }
      if (item.type === 'purchase') {
        if (!item.item_name.trim()) { setValidationError(`${itemNum}번 교보재의 교보재명을 입력하세요.`); return; }
        if (!item.vendor_name.trim()) { setValidationError(`${itemNum}번 교보재의 구매처명을 입력하세요.`); return; }
        if (!item.purchase_url.trim()) { setValidationError(`${itemNum}번 교보재의 구매URL을 입력하세요.`); return; }
        if (item.price <= 0) { setValidationError(`${itemNum}번 교보재의 금액은 0보다 커야 합니다.`); return; }
        if (item.quantity <= 0) { setValidationError(`${itemNum}번 교보재의 수량은 0보다 커야 합니다.`); return; }
      }
    }

    setSubmissionStatus({ isOpen: true, status: 'submitting', message: '' });
    
    if (useAI) {
      const reviewResult = await reviewApplicationReasons(materials);
      if (reviewResult.status !== 'approved') {
        if (reviewResult.status === 'rejected') {
            const detailedMessage = reviewResult.rejectedItems 
              ? reviewResult.rejectedItems.map(item => `${item.itemNumber}번 (${item.itemName}): ${item.reason}`).join('\n')
              : reviewResult.message;
            setSubmissionStatus({ isOpen: true, status: 'error', message: detailedMessage });
        } else if (reviewResult.status === 'error') {
            if (reviewResult.code === 503) {
                setSubmissionStatus({ isOpen: true, status: 'error', message: "API 호출에 실패했습니다. 나중에 다시 시도해주세요." });
            } else {
                setSubmissionStatus({ isOpen: true, status: 'error', message: reviewResult.message || "신청 검토 중 오류가 발생했습니다." });
            }
        } else {
            setSubmissionStatus({ isOpen: true, status: 'error', message: "AI 응답의 형식이 올바르지 않습니다." });
        }
        return;
      }
    }

    const { team_data, members_data, materials_data } = {
      team_data: {
        region: teamInfo.region,
        classNumber: teamInfo.classNumber,
        teamCode: teamInfo.teamCode,
        projectTopic: teamInfo.projectTopic,
      },
      members_data: teamInfo.members,
      materials_data: materials.map(item => {
        if (item.code) {
          return {
            ...item,
            isbn: item.code,
          }
        } else {
          return item;
        }
      }),
    };

    const { error } = await supabase.rpc('submit_application', { team_data, members_data, materials_data });

    if (error) {
      setSubmissionStatus({ isOpen: true, status: 'error', message: `데이터베이스 저장 실패: ${error.message}` });
    } else {
      setSubmissionStatus({ isOpen: true, status: 'success', message: '신청이 성공적으로 데이터베이스에 저장되었습니다.' });
    }
  };

  const closeSubmissionModal = () => {
    if (submissionStatus.status === 'success') {
      navigate('/'); // Navigate to main page on success
    }
    setSubmissionStatus({ isOpen: false, status: '', message: '' });
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
          onSubmit={handleSubmit}
          validationError={validationError}
        />
      )}
      <SubmissionModal
        isOpen={submissionStatus.isOpen}
        status={submissionStatus.status}
        message={submissionStatus.message}
        onClose={closeSubmissionModal}
      />
    </div>
  );
}

export default ApplicationForm;
