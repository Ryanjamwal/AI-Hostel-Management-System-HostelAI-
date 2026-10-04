import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { StudentsPage } from './pages/StudentsPage';
import { RoomsPage } from './pages/RoomsPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { GateAccessPage } from './pages/GateAccessPage';
import { ProfilePage } from './pages/ProfilePage';

// Advanced 25 Future Modules
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { PredictiveMaintenancePage } from './pages/PredictiveMaintenancePage';
import { SmartEnergyWaterPage } from './pages/SmartEnergyWaterPage';
import { CctvSecurityPage } from './pages/CctvSecurityPage';
import { MealOptimizationPage } from './pages/MealOptimizationPage';
import { RoomMatcherPage } from './pages/RoomMatcherPage';
import { WelfareSupportPage } from './pages/WelfareSupportPage';
import { ParentPortalPage } from './pages/ParentPortalPage';
import { DocumentVerificationPage } from './pages/DocumentVerificationPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { CommunityPage } from './pages/CommunityPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { MultiCampusPage } from './pages/MultiCampusPage';
import { EmergencyResponsePage } from './pages/EmergencyResponsePage';
import { BlockchainPage } from './pages/BlockchainPage';
import { AutonomousOpsPage } from './pages/AutonomousOpsPage';
import { ResearchLabPage } from './pages/ResearchLabPage';
import { AIEvalDashboardPage } from './pages/AIEvalDashboardPage';

import './App.css';
import './styles/Sidebar.css';
import './styles/Animations.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app-with-sidebar">
                  <Sidebar />
                  <main className="app-main-content">
                    <Routes>
                      {/* Operations */}
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/digital-twin" element={<DigitalTwinPage />} />
                      <Route path="/students" element={<StudentsPage />} />
                      <Route path="/rooms" element={<RoomsPage />} />
                      <Route path="/complaints" element={<ComplaintsPage />} />
                      <Route path="/payments" element={<PaymentsPage />} />
                      <Route path="/expenses" element={<PaymentsPage />} />
                      <Route path="/reports" element={<PaymentsPage />} />
                      <Route path="/gate-access" element={<GateAccessPage />} />
                      <Route path="/incidents" element={<ComplaintsPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/settings" element={<ProfilePage />} />

                      {/* Smart Campus & IoT */}
                      <Route path="/predictive-maintenance" element={<PredictiveMaintenancePage />} />
                      <Route path="/energy-water" element={<SmartEnergyWaterPage />} />
                      <Route path="/cctv-security" element={<CctvSecurityPage />} />
                      <Route path="/emergency-response" element={<EmergencyResponsePage />} />
                      <Route path="/autonomous-ops" element={<AutonomousOpsPage />} />

                      {/* Student Life & Community */}
                      <Route path="/room-matcher" element={<RoomMatcherPage />} />
                      <Route path="/meal-optimization" element={<MealOptimizationPage />} />
                      <Route path="/marketplace" element={<MarketplacePage />} />
                      <Route path="/community" element={<CommunityPage />} />
                      <Route path="/parent-portal" element={<ParentPortalPage />} />
                      <Route path="/welfare-support" element={<WelfareSupportPage />} />

                      {/* Advanced & AI Research */}
                      <Route path="/doc-verification" element={<DocumentVerificationPage />} />
                      <Route path="/blockchain" element={<BlockchainPage />} />
                      <Route path="/sustainability" element={<SustainabilityPage />} />
                      <Route path="/multi-campus" element={<MultiCampusPage />} />
                      <Route path="/research-lab" element={<ResearchLabPage />} />
                      <Route path="/ai-eval" element={<AIEvalDashboardPage />} />

                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
