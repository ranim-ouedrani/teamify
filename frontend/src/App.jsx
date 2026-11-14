import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import ActivateAccount from './pages/ActivateAccount';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

import TeacherDashboard from './pages/TeacherDashboard';
import TeacherProfiles from './pages/TeacherProfiles';

import AdminDashboard from './pages/AdminDashboard';
import AdminImport from './pages/AdminImport';
import AdminQuality from './pages/AdminQuality';
import AdminMlPrep from './pages/AdminMlPrep';
import AdminHistory from './pages/AdminHistory';

import SkillExchange from './pages/SkillExchange';
import Gamification from './pages/Gamification';
import GamificationAdmin from './pages/GamificationAdmin';
import ModulePage from './pages/ModulePage';
import StudentGroups from './pages/StudentGroups';
import TeacherTeams from './pages/TeacherTeams';
import TeacherProfile from './pages/TeacherProfile';
import TeacherProjects from './pages/TeacherProjects';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/activate" element={<ActivateAccount />} />

      {/* Étudiant : les compétences sont maintenant dans /profile */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />

      {/* Modules à intégrer : remplacez chaque ModulePage par la vraie page */}
      <Route path="/skill-exchange" element={<SkillExchange />} />
      <Route path="/gamification" element={<Gamification />} />
      <Route path="/admin/gamification" element={<GamificationAdmin />} />
      <Route path="/groups" element={<StudentGroups />} />
      <Route path="/ml" element={<ModulePage title="ML" subtitle="Constitution automatique des groupes." description="Interface du microservice ML." />} />
      <Route path="/feedback" element={<ModulePage title="Feedback" subtitle="Retours et évaluations." description="Interface du microservice Feedback." />} />

      {/* Enseignant */}
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/profile" element={<TeacherProfile />} />
      <Route path="/teacher/projects" element={<TeacherProjects />} />
      <Route path="/teacher/teams" element={<TeacherTeams />} />
      <Route path="/teacher/profiles" element={<TeacherProfiles />} />

      {/* Administrateur */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/import" element={<AdminImport />} />
      <Route path="/admin/quality" element={<AdminQuality />} />
      <Route path="/admin/ml" element={<AdminMlPrep />} />
      <Route path="/admin/history" element={<AdminHistory />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
