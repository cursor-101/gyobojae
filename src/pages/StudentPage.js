import React from 'react';
import { Link } from 'react-router-dom';

// not used

function StudentPage() {
  return (
    <div>
      <h1>교육생 페이지</h1>
      <nav>
        <Link to="/student/apply">
          <button>교보재 신청</button>
        </Link>
        <Link to="/student/status">
          <button>신청 내역 확인</button>
        </Link>
      </nav>
    </div>
  );
}

export default StudentPage;
