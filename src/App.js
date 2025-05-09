import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Score from './components/Score';
import TeamDetails from './components/TeamDetails';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/fifa-score" element={<Score />} />
        <Route path="/fifa-score/team/:competitionId" element={<TeamDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
