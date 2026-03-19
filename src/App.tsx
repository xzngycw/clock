import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  AnalogClockPage,
  DigitalClockPage,
  HomePage,
  LessonDetailPage,
  LessonsPage,
  LearnTimePage,
  ParentSummaryPage,
  PracticePage,
  WrongQuestionsPage,
} from '@/pages';
import { ROUTES } from '@/constants';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LESSONS} element={<LessonsPage />} />
        <Route path={ROUTES.LESSON_DETAIL} element={<LessonDetailPage />} />
        <Route path={ROUTES.LEARN_TIME} element={<LearnTimePage />} />
        <Route path={ROUTES.ANALOG_CLOCK} element={<AnalogClockPage />} />
        <Route path={ROUTES.DIGITAL_CLOCK} element={<DigitalClockPage />} />
        <Route path={ROUTES.PRACTICE} element={<PracticePage />} />
        <Route path={ROUTES.WRONG_QUESTIONS} element={<WrongQuestionsPage />} />
        <Route path={ROUTES.PARENT_SUMMARY} element={<ParentSummaryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
