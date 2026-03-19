import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, CircleDashed, PlayCircle } from 'lucide-react';
import { Layout } from '@/components/layout';
import { MVP_LESSONS, ROUTES } from '@/constants';
import { useProgressStore } from '@/store';

export function LessonsPage() {
  const { getLessonStatus } = useProgressStore();

  return (
    <Layout title="学习课程" showBack>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-6 py-2 sm:py-4">
        <div className="text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-md">
            <BookOpen className="h-4 w-4 text-indigo-500" />
            <span className="font-display text-base text-gradient">课程地图</span>
          </div>
          <p className="text-sm text-base-content/70">
            按顺序学习 6 节启蒙课程，打好认识时间的基础。
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {MVP_LESSONS.map((lesson) => {
            const status = getLessonStatus(lesson.id);
            const statusConfig =
              status === 'completed'
                ? { label: '已完成', icon: <CheckCircle2 className="h-4 w-4" />, style: 'text-emerald-600 bg-emerald-50' }
                : status === 'in_progress'
                  ? { label: '学习中', icon: <PlayCircle className="h-4 w-4" />, style: 'text-indigo-600 bg-indigo-50' }
                  : { label: '未开始', icon: <CircleDashed className="h-4 w-4" />, style: 'text-amber-600 bg-amber-50' };

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link
                  to={ROUTES.LESSON_DETAIL.replace(':lessonId', lesson.id)}
                  className="block rounded-3xl border border-white/70 bg-white/90 p-5 shadow-lg transition-transform hover:-translate-y-1"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-base-content/50">第 {lesson.order} 课 · {lesson.tag}</p>
                      <h2 className="mt-1 font-display text-xl text-base-content">{lesson.title}</h2>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusConfig.style}`}>
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-base-content/70">{lesson.description}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-base-content/55">
                    <span>目标：{lesson.goal}</span>
                    <span>{lesson.duration} 分钟</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
