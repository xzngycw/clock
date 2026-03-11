import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, LearnTimePage, AnalogClockPage, DigitalClockPage, PracticePage } from '@/pages';
import { ROUTES } from '@/constants';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LEARN_TIME} element={<LearnTimePage />} />
        <Route path={ROUTES.ANALOG_CLOCK} element={<AnalogClockPage />} />
        <Route path={ROUTES.DIGITAL_CLOCK} element={<DigitalClockPage />} />
        <Route path={ROUTES.PRACTICE} element={<PracticePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
