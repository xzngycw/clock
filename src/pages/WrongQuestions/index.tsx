import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, RotateCcw, Trash2 } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ROUTES } from '@/constants';
import { useProgressStore } from '@/store';
import type { Question, WrongQuestionRecord } from '@/types';
import { ClockTimeUtils, generateId, generateWrongOptions } from '@/utils';

const routeByQuestionType = {
  'analog-to-digital': ROUTES.ANALOG_CLOCK,
  'digital-to-analog': ROUTES.DIGITAL_CLOCK,
  'manual-input': ROUTES.PRACTICE,
} as const;

const labelByQuestionType = {
  'analog-to-digital': '模拟钟 → 数字钟',
  'digital-to-analog': '数字钟 → 模拟钟',
  'manual-input': '动手调时间',
} as const;

const buildRetryQuestion = (item: WrongQuestionRecord): Question => {
  const options = [
    item.correctAnswer,
    item.userAnswer,
    ...generateWrongOptions(item.correctAnswer, 2),
  ].slice(0, 4);

  return {
    id: generateId(),
    type: item.questionType,
    difficulty: item.difficulty,
    time: item.correctAnswer,
    options: item.questionType === 'manual-input' ? undefined : options,
    explanation: item.explanation,
    hint: '再观察一下时针和分针的位置。',
    createdAt: Date.now(),
  };
};

export function WrongQuestionsPage() {
  const { progress, clearWrongQuestions } = useProgressStore();
  const wrongQuestions = progress?.wrongQuestions ?? [];
  const retryQuestions = wrongQuestions.map(buildRetryQuestion);

  return (
    <Layout title="错题本" showBack>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-6 py-2 sm:py-4">
        <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-base-content">错题复盘</h2>
              <p className="mt-2 text-sm leading-6 text-base-content/70">
                先看懂自己错在哪里，再回到对应课程或练习页继续巩固。
              </p>
            </div>
            {wrongQuestions.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={ROUTES.PRACTICE}
                  state={{ mode: 'wrong-questions', questions: retryQuestions }}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600"
                >
                  <RotateCcw className="h-4 w-4" />
                  全部错题再练
                </Link>
                <button
                  type="button"
                  onClick={clearWrongQuestions}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                  清空错题
                </button>
              </div>
            )}
          </div>
        </div>

        {wrongQuestions.length === 0 ? (
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 text-center shadow-xl">
            <AlertCircle className="mx-auto h-10 w-10 text-emerald-500" />
            <h3 className="mt-3 font-display text-xl text-base-content">目前没有错题</h3>
            <p className="mt-2 text-sm text-base-content/65">继续保持，或者去练习页做几道题试试看。</p>
            <Link
              to={ROUTES.PRACTICE}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 font-display text-white"
            >
              <RotateCcw className="h-4 w-4" />
              去练习
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {wrongQuestions.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-lg"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-rose-50 px-3 py-1 font-medium text-rose-600">{item.difficulty}</span>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-600">{labelByQuestionType[item.questionType]}</span>
                  <span className="rounded-full bg-base-100 px-3 py-1 font-medium text-base-content/55">
                    {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs font-medium text-emerald-600">正确答案</p>
                    <p className="mt-2 font-display text-2xl text-emerald-700">
                      {ClockTimeUtils.format(item.correctAnswer, '12h')}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-rose-50 p-4">
                    <p className="text-xs font-medium text-rose-600">你的答案</p>
                    <p className="mt-2 font-display text-2xl text-rose-700">
                      {ClockTimeUtils.format(item.userAnswer, '12h')}
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-base-100/80 p-4 text-sm leading-6 text-base-content/70">
                  {item.explanation}
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={routeByQuestionType[item.questionType]}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 font-display text-white"
                  >
                    去相关学习页
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to={ROUTES.PRACTICE}
                    state={{ mode: 'wrong-questions', questions: [buildRetryQuestion(item)] }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-amber-300 bg-white px-5 py-3 font-display text-base-content"
                  >
                    只练这题
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
