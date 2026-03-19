import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout';
import { getLessonById, MVP_LESSONS, ROUTES } from '@/constants';
import { useProgressStore } from '@/store';

export function LessonDetailPage() {
  const { lessonId = '' } = useParams();
  const lesson = getLessonById(lessonId);
  const { getLessonStatus, markLessonStarted, markLessonCompleted, getNextLessonId } = useProgressStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    setCurrentStepIndex(0);
  }, [lessonId]);

  useEffect(() => {
    if (lesson) {
      markLessonStarted(lesson.id);
    }
  }, [lesson, markLessonStarted]);

  const currentStep = useMemo(() => lesson?.steps[currentStepIndex], [lesson, currentStepIndex]);

  if (!lesson) {
    return <Navigate to={ROUTES.LESSONS} replace />;
  }

  const status = getLessonStatus(lesson.id);
  const isLastStep = currentStepIndex === lesson.steps.length - 1;
  const progressPercent = Math.round(((currentStepIndex + 1) / lesson.steps.length) * 100);
  const nextLessonId = getNextLessonId();
  const nextLesson = MVP_LESSONS.find((item) => item.id === nextLessonId && item.id !== lesson.id);

  return (
    <Layout title={lesson.title} showBack>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-6 py-2 sm:py-4">
        <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 sm:p-6 shadow-xl">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-600">{lesson.tag}</span>
            <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-600">{lesson.difficultyLabel}</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-600">预计 {lesson.duration} 分钟</span>
            <span
              className={`rounded-full px-3 py-1 font-medium ${
                status === 'completed'
                  ? 'bg-emerald-50 text-emerald-600'
                  : status === 'in_progress'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'bg-base-100 text-base-content/60'
              }`}
            >
              {status === 'completed' ? '已完成' : status === 'in_progress' ? '学习中' : '未开始'}
            </span>
          </div>

          <h2 className="font-display text-2xl text-base-content">{lesson.title}</h2>
          <p className="mt-2 text-sm leading-6 text-base-content/70">{lesson.description}</p>
          <div className="mt-4 rounded-2xl bg-base-100/80 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-base-content">
              <Sparkles className="h-4 w-4 text-amber-500" />
              本节目标
            </div>
            <p className="mt-2 text-sm leading-6 text-base-content/70">{lesson.goal}</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-base-content/50">学习进度</p>
              <h3 className="mt-1 font-display text-xl text-base-content">
                第 {currentStepIndex + 1} 步 / 共 {lesson.steps.length} 步
              </h3>
            </div>
            <span className="font-display text-xl text-indigo-600">{progressPercent}%</span>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-base-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {lesson.steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStepIndex(index)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  index === currentStepIndex
                    ? 'bg-indigo-500 text-white'
                    : index < currentStepIndex
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-base-100 text-base-content/60'
                }`}
              >
                {index + 1}. {step.title}
              </button>
            ))}
          </div>
        </div>

        {currentStep && (
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-white/70 bg-white/90 p-5 sm:p-6 shadow-xl"
          >
            <div className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
              学习步骤 {currentStepIndex + 1}
            </div>
            <h3 className="mt-3 font-display text-2xl text-base-content">{currentStep.title}</h3>
            <p className="mt-3 text-sm leading-7 text-base-content/70">{currentStep.description}</p>

            <div className="mt-5 rounded-2xl bg-base-100/80 p-4 text-sm leading-6 text-base-content/70">
              {currentStepIndex === 0 && '先理解概念，再去关联页面进行观察和体验。'}
              {currentStepIndex === 1 && '建议打开对应学习页，边看边操作，帮助孩子形成直观认识。'}
              {currentStepIndex >= 2 && '完成操作后，可以继续做练习或直接标记本课完成。'}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                to={lesson.linkedRoute}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 font-display text-white shadow-lg shadow-indigo-500/30"
              >
                <Play className="h-4 w-4" />
                去对应学习页
              </Link>

              {isLastStep ? (
                <button
                  type="button"
                  onClick={() => markLessonCompleted(lesson.id, 100)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-300 bg-white px-5 py-3 font-display text-base-content shadow-md"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  标记本课完成
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex((index) => Math.min(index + 1, lesson.steps.length - 1))}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-300 bg-white px-5 py-3 font-display text-base-content shadow-md"
                >
                  下一步
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setCurrentStepIndex((index) => Math.max(index - 1, 0))}
            disabled={currentStepIndex === 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-display text-base-content shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            上一步
          </button>
          <button
            type="button"
            onClick={() => setCurrentStepIndex((index) => Math.min(index + 1, lesson.steps.length - 1))}
            disabled={isLastStep}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-display text-base-content shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            下一步
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {nextLesson && (
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-lg">
            <p className="text-xs font-medium text-base-content/50">推荐下一课</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-lg text-base-content">{nextLesson.title}</p>
                <p className="text-sm text-base-content/65">{nextLesson.description}</p>
              </div>
              <Link
                to={ROUTES.LESSON_DETAIL.replace(':lessonId', nextLesson.id)}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600"
              >
                去下一课
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
