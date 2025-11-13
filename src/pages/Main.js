import React from 'react';
import { Link } from 'react-router-dom';

function Main() {
  return (
    <div>
      <h1>교보재 신청 사이트</h1>
      <nav>
        <Link to="/student">
          <button>교육생</button>
        </Link>
        <Link to="/operator">
          <button>운영자</button>
        </Link>
      </nav>
    </div>
  );
}

export default Main;
