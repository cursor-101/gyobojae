import React from 'react';
import { Link } from 'react-router-dom';

function Main() {
  return (
    <div className="landing">
      <img src="/logo.png" width="600" height="677.52" alt="gyobojae logo"/>
      <nav>
        <Link to="/student/apply">
          <button>교보재 신청</button>
        </Link>
        <Link to="/student/status">
          <button>신청 내역 확인</button>
        </Link>
        <Link to="/operator">
          <button>운영자 페이지</button>
        </Link>
      </nav>
    </div>
  );
}

export default Main;
