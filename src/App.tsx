import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MobileLayout } from './components/Layout/MobileLayout';
import { HomeView } from './components/Home/HomeView';
import { LoginView } from './components/Auth/LoginView';
import { LeaderboardView } from './components/Leaderboard/LeaderboardView';
import { MarketplaceView } from './components/LeadMarketplace/MarketplaceView';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <GamificationProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <MobileLayout showNav={false}>
                  <LoginView />
                </MobileLayout>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MobileLayout showNav={true}>
                    <HomeView />
                  </MobileLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <PrivateRoute>
                  <MobileLayout showNav={true}>
                    <LeaderboardView />
                  </MobileLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/pool"
              element={
                <PrivateRoute>
                  <MobileLayout showNav={true}>
                    <MarketplaceView />
                  </MobileLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={<Navigate to="/" />}
            />
          </Routes>
        </Router>
      </GamificationProvider>
    </AuthProvider>
  );
}

export default App;
