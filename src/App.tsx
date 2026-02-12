import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Sessions from './pages/Sessions.tsx'
import Chat from './pages/Chat.tsx'
import Assignments from './pages/Assignments.tsx'
import AssignmentPractice from './pages/AssignmentPractice.tsx'
import Progress from './pages/Progress.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="chat" element={<Chat />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="assignments/:id/practice" element={<AssignmentPractice />} />
          <Route path="progress" element={<Progress />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
