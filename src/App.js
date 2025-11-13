import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import StudentPage from './pages/StudentPage';
import OperatorPage from './pages/OperatorPage';
import ApplicationForm from './pages/student/ApplicationForm';
import CheckStatus from './pages/student/CheckStatus';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/student/apply" element={<ApplicationForm />} />
          <Route path="/student/status" element={<CheckStatus />} />
          <Route path="/operator" element={<OperatorPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
