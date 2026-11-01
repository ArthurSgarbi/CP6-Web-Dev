import { Suspense } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';

export function renderHome() {
  return renderToString(<MemoryRouter><Suspense>
    <HomePage projects={[]} projectsQuery={{ isPending: true, isFetching: false }}
      selectedProject={null} onSelect={() => {}} onClose={() => {}} onNext={() => {}} onPrevious={() => {}} />
  </Suspense></MemoryRouter>);
}
