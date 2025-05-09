import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Score from './components/Score';
import TeamDetails from './components/TeamDetails';
import SquadDetails from './components/SquadDetails';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/fifa-score" element={<Score />} />
        <Route path="/fifa-score/team/:competitionId" element={<TeamDetails />} />
        <Route path="/fifa-score/team/:teamId/squad" element={<SquadDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
