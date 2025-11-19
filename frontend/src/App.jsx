import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import SignUpPage from './pages/signupPage';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home route has Header */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <HomePage />
            </>
          }
        />

        {/* Login route without Header */}
        <Route path="/login" element={<LoginPage />} />

        {/* Signup route without Header */}
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;
