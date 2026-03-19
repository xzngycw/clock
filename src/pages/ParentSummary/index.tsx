import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChartColumn, Clock3, Target, TriangleAlert } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ROUTES } from '@/constants';
import { useProgressStore } from '@/store';

export function ParentSummaryPage() {
  const { getParentSummary, progress } = useProgressStore();
  const summary = getParentSummary();
  const recentSessions = [...(progress?.practiceHistory ?? [])].slice(-3).reverse();
  const completedLessonCount = progress?.completedLessons.filter((item) => item.completed).length ?? 0;

  const weakType =
    progress?.wrongQuestions.reduce<Record<string, number>>((acc, item) => {
      acc[item.questionType] = (acc[item.questionType] ?? 0) + 1;
      return acc;
    }, {}) ?? {};

  const topWeakType = Object.entries(weakType).sort((a, b) => b[1] - a[1])[0]?.[0];
  const masteryLevel = summary
    ? summary.accuracy >= 85
      ? '掌握稳定'
      : summary.accuracy >= 60
        ? '持续进步中'
        : '需要更多引导'
    : '暂无数据';

  const cards = summary
    ? [
        { label: '已完成课程', value: `${summary.completedLessons}/${summary.totalLessons}`, icon: <BookOpen className="h-5 w-5 text-indigo-500" /> },
        { label: '累计练习时长', value: `${summary.totalPracticeTime} 分钟`, icon: <Clock3 className="h-5 w-5 text-amber-500" /> },
        { label: '总答题数', value: `${summary.totalQuestions} 题`, icon: <Target className="h-5 w-5 text-emerald-500" /> },
        { label: '正确率', value: `${summary.accuracy}%`, icon: <ChartColumn className="h-5 w-5 text-rose-500" /> },
      ]
    : [];

  return (
    <Layout title="家长摘要" showBack>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 sm:gap-6 py-2 sm:py-4">
        <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 sm:p-6 shadow-xl">
          <h2 className="font-display text-2xl text-base-content">孩子最近学得怎么样？</h2>
          <p className="mt-2 text-sm leading-6 text-base-content/70">
            这里展示课程进度、练习数据、薄弱点和下一步建议，方便家长快速了解学习情况。
          </p>
        </div>

        {summary ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {cards.map((card, index) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-lg"
                >
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    {card.icon}
                    {card.label}
                  </div>
                  <div className="mt-3 font-display text-3xl text-base-content">{card.value}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-lg">
                <h3 className="font-display text-xl text-base-content">学习建议</h3>
                <p className="mt-3 text-sm leading-6 text-base-content/70">{summary.suggestedNextAction}</p>
                <div className="mt-4 rounded-2xl bg-base-100/80 p-4 text-sm leading-6 text-base-content/70">
                  <p>已完成课程：{completedLessonCount} 节</p>
                  <p>连续学习：{progress?.streakDays ?? 0} 天</p>
                  <p>当前掌握等级：{masteryLevel}</p>
                  <p>最近活跃：{progress ? new Date(progress.lastActiveAt).toLocaleDateString('zh-CN') : '暂无'}</p>
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={ROUTES.LESSONS}
                    className="flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 font-display text-white"
                  >
                    去课程学习
                  </Link>
                  <Link
                    to={ROUTES.WRONG_QUESTIONS}
                    className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-amber-300 bg-white px-5 py-3 font-display text-base-content"
                  >
                    查看错题本
                  </Link>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-lg">
                <div className="flex items-center gap-2 text-base-content">
                  <TriangleAlert className="h-5 w-5 text-rose-500" />
                  <h3 className="font-display text-xl">当前薄弱点</h3>
                </div>
                <div className="mt-4 space-y-3 text-sm text-base-content/70">
                  <p>错题数量：{summary.wrongQuestionCount} 题</p>
                  <p>主要薄弱题型：{topWeakType ?? '暂无明显薄弱项'}</p>
                  <p>
                    建议动作：
                    {summary.wrongQuestionCount > 0 ? '先查看错题本，再回到课程页复习相关概念。' : '当前没有错题，可以继续学习下一节课程。'}
                  </p>
                  <p>掌握判断：{masteryLevel}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-lg">
              <h3 className="font-display text-xl text-base-content">最近练习记录</h3>
              {recentSessions.length === 0 ? (
                <p className="mt-3 text-sm text-base-content/65">还没有练习记录，先去做一次练习吧。</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {recentSessions.map((session) => {
                    const accuracy = session.totalQuestions > 0 ? Math.round((session.correctAnswers / session.totalQuestions) * 100) : 0;
                    return (
                      <div key={session.id} className="rounded-2xl bg-base-100/80 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                          <span className="font-medium text-base-content">{session.difficulty} 难度练习</span>
                          <span className="text-base-content/55">{new Date(session.startedAt).toLocaleDateString('zh-CN')}</span>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-base-content/65 sm:text-sm">
                          <span>题目：{session.totalQuestions}</span>
                          <span>答对：{session.correctAnswers}</span>
                          <span>正确率：{accuracy}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 text-center shadow-xl">
            <p className="font-display text-xl text-base-content">还没有学习数据</p>
            <p className="mt-2 text-sm text-base-content/65">先去课程或练习页体验一次，系统就会生成摘要。</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
