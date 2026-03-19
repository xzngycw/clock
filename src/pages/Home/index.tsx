import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock3, Gamepad2, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Layout } from '@/components/layout';
import { MVP_LESSONS, ROUTES } from '@/constants';
import { useProgressStore } from '@/store';

export function HomePage() {
  const { getLessonStatus, getNextLessonId, getParentSummary } = useProgressStore();
  const summary = getParentSummary();
  const nextLessonId = getNextLessonId() ?? MVP_LESSONS[0].id;
  const nextLesson = MVP_LESSONS.find((lesson) => lesson.id === nextLessonId) ?? MVP_LESSONS[0];

  return (
    <Layout showBack={false} showFooter>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:gap-6 py-2 sm:py-4">
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-5 py-6 text-white shadow-2xl shadow-indigo-500/20 sm:px-7 sm:py-8">
          <div className="absolute right-4 top-4 text-5xl opacity-20 sm:text-7xl">⏰</div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              时间启蒙学习计划
            </div>
            <h1 className="mt-4 font-display text-3xl sm:text-5xl">认识时间</h1>
            <p className="mt-3 text-sm leading-6 text-white/90 sm:text-base">
              用课程、互动和练习，帮助孩子一步步学会看时间。
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                to={ROUTES.LESSON_DETAIL.replace(':lessonId', nextLesson.id)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-display text-indigo-600 shadow-lg"
              >
                <BookOpen className="h-4 w-4" />
                开始今日学习
              </Link>
              <Link
                to={ROUTES.PRACTICE}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-display text-white backdrop-blur"
              >
                <Gamepad2 className="h-4 w-4" />
                去做练习
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-base-content/50">今日学习</p>
                <h2 className="mt-1 font-display text-2xl text-base-content">{nextLesson.title}</h2>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                {nextLesson.duration} 分钟
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-base-content/70">{nextLesson.goal}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {nextLesson.steps.map((step) => (
                <span key={step.id} className="rounded-full bg-base-100 px-3 py-1 text-xs text-base-content/60">
                  {step.title}
                </span>
              ))}
            </div>
            <Link
              to={ROUTES.LESSON_DETAIL.replace(':lessonId', nextLesson.id)}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 font-display text-white shadow-lg shadow-indigo-500/25"
            >
              继续学习
            </Link>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-xl">
            <div className="flex items-center gap-2 text-base-content/60">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium">家长摘要</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-base-100/80 p-4">
                <p className="text-xs text-base-content/50">课程进度</p>
                <p className="mt-2 font-display text-2xl text-base-content">
                  {summary ? `${summary.completedLessons}/${summary.totalLessons}` : '0/6'}
                </p>
              </div>
              <div className="rounded-2xl bg-base-100/80 p-4">
                <p className="text-xs text-base-content/50">正确率</p>
                <p className="mt-2 font-display text-2xl text-base-content">{summary?.accuracy ?? 0}%</p>
              </div>
              <div className="rounded-2xl bg-base-100/80 p-4">
                <p className="text-xs text-base-content/50">练习时长</p>
                <p className="mt-2 font-display text-2xl text-base-content">{summary?.totalPracticeTime ?? 0}分</p>
              </div>
              <div className="rounded-2xl bg-base-100/80 p-4">
                <p className="text-xs text-base-content/50">错题数</p>
                <p className="mt-2 font-display text-2xl text-base-content">{summary?.wrongQuestionCount ?? 0}</p>
              </div>
            </div>
            <Link
              to={ROUTES.PARENT_SUMMARY}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-amber-300 bg-white px-5 py-3 font-display text-base-content shadow-md"
            >
              <Target className="h-4 w-4 text-amber-500" />
              查看家长摘要
            </Link>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-base-content/50">课程地图</p>
              <h2 className="mt-1 font-display text-2xl text-base-content">按顺序学会认识时间</h2>
            </div>
            <Link to={ROUTES.LESSONS} className="text-sm font-medium text-indigo-600">
              查看全部
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {MVP_LESSONS.map((lesson) => {
              const status = getLessonStatus(lesson.id);
              return (
                <motion.div key={lesson.id} whileHover={{ y: -4 }}>
                  <Link
                    to={ROUTES.LESSON_DETAIL.replace(':lessonId', lesson.id)}
                    className="block rounded-3xl bg-base-100/80 p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-base-content/45">第 {lesson.order} 课</span>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        status === 'completed'
                          ? 'bg-emerald-50 text-emerald-600'
                          : status === 'in_progress'
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'bg-amber-50 text-amber-600'
                      }`}>
                        {status === 'completed' ? '已完成' : status === 'in_progress' ? '学习中' : '未开始'}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-lg text-base-content">{lesson.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-base-content/65">{lesson.description}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { title: '认识时间', desc: '从概念动画开始', icon: <Clock3 className="h-5 w-5 text-indigo-500" />, path: ROUTES.LEARN_TIME },
            { title: '模拟时钟', desc: '拖动指针练习', icon: <BookOpen className="h-5 w-5 text-amber-500" />, path: ROUTES.ANALOG_CLOCK },
            { title: '错题本', desc: '看看哪里还要复习', icon: <Target className="h-5 w-5 text-rose-500" />, path: ROUTES.WRONG_QUESTIONS },
          ].map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-lg transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-2 text-base-content/60">
                {item.icon}
                <span className="text-sm font-medium">快捷入口</span>
              </div>
              <h3 className="mt-3 font-display text-xl text-base-content">{item.title}</h3>
              <p className="mt-2 text-sm text-base-content/65">{item.desc}</p>
            </Link>
          ))}
        </section>
      </div>
    </Layout>
  );
}
