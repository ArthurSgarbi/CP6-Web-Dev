import { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import SelectedWorks from './components/SelectedWorks.jsx';
import Exploration from './components/Exploration.jsx';
import Journal from './components/Journal.jsx';
import Footer from './components/Footer.jsx';
import StudyDialog from './components/StudyDialog.jsx';
import useReveal from './hooks/useReveal.js';
import useAnchorNavigation from './hooks/useAnchorNavigation.js';
import { studies } from './data/studies.js';

export default function App() {
  const revealRef = useReveal();
  const { activeSection, navigate } = useAnchorNavigation();
  const [selectedStudy, setSelectedStudy] = useState(null);

  const changeStudy = (direction) => setSelectedStudy((current) => {
    const index = studies.findIndex((study) => study.id === current?.id);
    return studies[(index + direction + studies.length) % studies.length];
  });

  return (
    <div id="top" tabIndex="-1" ref={revealRef}>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => navigate(event, 'main')}
      >
        Skip to content
      </a>

      <Header activeSection={activeSection} onNavigate={navigate} />

      <main id="main" tabIndex="-1">
        <Hero navigate={navigate} />
        <SelectedWorks onSelect={setSelectedStudy} />
        <Exploration navigate={navigate} />
        <Journal />
      </main>

      <Footer navigate={navigate} />
      <StudyDialog
        study={selectedStudy}
        totalCount={studies.length}
        onClose={() => setSelectedStudy(null)}
        onNext={() => changeStudy(1)}
        onPrevious={() => changeStudy(-1)}
      />
    </div>
  );
}
