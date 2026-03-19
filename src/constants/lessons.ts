import type { LessonSummary } from '@/types';

export const MVP_LESSONS: LessonSummary[] = [
  {
    id: 'clock-face',
    title: '认识钟面',
    description: '先认识钟面数字、刻度和表盘结构。',
    goal: '知道钟面由数字、刻度和指针组成。',
    duration: 6,
    difficultyLabel: '启蒙',
    order: 1,
    linkedRoute: '/learn-time',
    tag: '基础概念',
    steps: [
      { id: 'intro', title: '看看钟面', description: '认识圆形表盘和 1 到 12 的数字。' },
      { id: 'observe', title: '观察刻度', description: '知道大格和小格帮助我们读时间。' },
      { id: 'practice', title: '找一找', description: '在互动内容里寻找数字和刻度。' },
    ],
  },
  {
    id: 'clock-hands',
    title: '认识时针分针秒针',
    description: '分清三根指针分别表示什么。',
    goal: '能说出时针、分针、秒针的区别。',
    duration: 8,
    difficultyLabel: '启蒙',
    order: 2,
    linkedRoute: '/analog-clock',
    tag: '模拟时钟',
    steps: [
      { id: 'know-hands', title: '分清指针', description: '知道短针是时针，长针是分针，细针是秒针。' },
      { id: 'watch-move', title: '观察运动', description: '看三根指针如何转动。' },
      { id: 'drag-hands', title: '拖动体验', description: '拖动指针，感受时间变化。' },
    ],
  },
  {
    id: 'whole-hours',
    title: '认识整点',
    description: '先从最简单的整点开始读时间。',
    goal: '能读出 1 点、2 点、3 点等整点时间。',
    duration: 8,
    difficultyLabel: '基础',
    order: 3,
    linkedRoute: '/analog-clock',
    tag: '整点',
    steps: [
      { id: 'whole-rule', title: '整点规律', description: '分针指向 12，就是整点。' },
      { id: 'read-time', title: '读整点', description: '根据时针位置读出几点。' },
      { id: 'whole-practice', title: '整点练习', description: '拖动指针或观察表盘读整点。' },
    ],
  },
  {
    id: 'half-hours',
    title: '认识半点',
    description: '学会看分针在 6 的半点时间。',
    goal: '知道半点是几点半。',
    duration: 8,
    difficultyLabel: '基础',
    order: 4,
    linkedRoute: '/analog-clock',
    tag: '半点',
    steps: [
      { id: 'half-rule', title: '半点规律', description: '分针指向 6，就是半点。' },
      { id: 'hour-position', title: '看时针位置', description: '半点时，时针在两个数字中间。' },
      { id: 'half-practice', title: '半点练习', description: '结合模拟钟练习读半点。' },
    ],
  },
  {
    id: 'digital-match',
    title: '数字钟和模拟钟对应',
    description: '把数字时间和指针时间连起来。',
    goal: '看到数字钟，也能知道模拟钟该怎么表示。',
    duration: 10,
    difficultyLabel: '进阶',
    order: 5,
    linkedRoute: '/digital-clock',
    tag: '数字时钟',
    steps: [
      { id: 'see-digits', title: '认识数字时间', description: '知道小时、分钟、秒在数字钟上的位置。' },
      { id: 'match-clock', title: '双钟对应', description: '把数字时间和模拟钟对应起来。' },
      { id: 'adjust-digits', title: '自己调整', description: '手动修改数字并观察模拟钟变化。' },
    ],
  },
  {
    id: 'daily-time',
    title: '生活中的时间',
    description: '把时间放进真实生活场景里。',
    goal: '知道起床、吃饭、上学、睡觉等常见时间。',
    duration: 10,
    difficultyLabel: '应用',
    order: 6,
    linkedRoute: '/learn-time',
    tag: '生活应用',
    steps: [
      { id: 'routine', title: '一天的时间', description: '认识早上、中午、下午和晚上。' },
      { id: 'scene-link', title: '生活配对', description: '把事件和对应时间联系起来。' },
      { id: 'review', title: '回顾总结', description: '巩固时间在生活中的实际用法。' },
    ],
  },
];

export const getLessonById = (lessonId: string) => {
  return MVP_LESSONS.find((lesson) => lesson.id === lessonId);
};
