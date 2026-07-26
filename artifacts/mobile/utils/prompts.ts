export const PROMPTS: string[] = [
  // Explanation
  'Explain your current project to someone who has never worked in your field.',
  'Walk me through how a decision gets made at your organization.',
  'Describe how your most-used tool or software actually works under the hood.',
  'Explain what you do for work as if I am a curious twelve-year-old.',
  'Explain a concept from your field that took you a long time to really understand.',
  'How does the internet actually deliver a webpage to your screen?',
  'Explain how a bank makes money.',
  'How does a recommendation algorithm decide what to show you next?',
  'Explain what your team\'s biggest current challenge is and why it\'s hard.',
  'Walk me through how you approach a problem you have never seen before.',
  'Explain what good judgment means in the context of your work.',
  'Describe how you learned the most important skill you use regularly.',
  'Explain why something that seems simple in your field is actually complex.',
  'How does compound interest actually work?',
  'Explain what makes a good meeting different from a bad one.',
  'Describe how the supply chain for something you buy regularly actually works.',
  'Explain how your industry has changed in the last five years.',
  'Walk me through how you prepare for an important conversation.',
  'Explain why most software projects take longer than expected.',
  'Describe what your organization\'s strategy is and whether you believe it.',
  'Explain what inflation actually does to purchasing power over time.',
  'Walk me through how insurance actually works as a business model.',
  'Explain the difference between correlation and causation with a real example.',
  'How does a search engine rank its results?',
  'Explain what makes a piece of writing clear versus unclear.',
  // Opinion
  'What is a belief you hold that most people in your field would disagree with?',
  'What common advice about work do you think is actually bad advice?',
  'What is something your organization does that you think is wrong?',
  'What skill do you think is underrated in your industry?',
  'What do you think most people misunderstand about your job?',
  'What is a decision you made that seemed risky but turned out to be right?',
  'What is the most overrated metric in your field?',
  'What is one thing you have changed your mind about in the last year?',
  'What do you think is the most important thing to get right in a first job?',
  'What is something you believe about how people learn that most people don\'t?',
  'What is a popular management practice you think doesn\'t work?',
  'What do you think is the biggest problem with how your industry hires people?',
  'What is something you have stopped worrying about that you used to?',
  'What is one thing you would change about your field if you could?',
  'What do you think is the biggest misconception about leadership?',
  'What advice would you give your younger self starting your career?',
  'What do you think most people get wrong about productivity?',
  'What is an opinion you have held longer than you thought you would?',
  'What do you think determines whether someone becomes excellent at something?',
  'What is a trade-off that your field accepts that you think is worth questioning?',
  'What is the most important thing you have learned from a failure?',
  'What do you think is overemphasized in most performance reviews?',
  'What is something you think technology cannot fix?',
  'What is one skill you wish you had developed ten years earlier?',
  'What is a conventional career decision you think is bad?',
  // Description
  'Describe the moment you realized you were actually good at something.',
  'Describe the most interesting project you have worked on and why.',
  'Describe how your relationship with work has changed over time.',
  'Describe the best team you have ever been part of.',
  'Describe a habit that has made a meaningful difference in your life.',
  'Describe how you make important decisions.',
  'Describe the last time you completely changed your approach to something.',
  'Describe what a good day at work looks like for you.',
  'Describe someone whose thinking you respect and what you have learned from them.',
  'Describe a skill you have recently tried to build and how it is going.',
  'Describe the most useful feedback you have ever received.',
  'Describe your relationship with uncertainty.',
  'Describe how you stay current in your field.',
  'Describe a moment when you had to change course on something important.',
  'Describe what your ideal working environment looks like.',
  'Describe a technology you think people underestimate.',
  'Describe how you approach things you are not naturally good at.',
  'Describe the last time you genuinely surprised yourself.',
  'Describe the person at work you have learned the most from.',
  'Describe how your thinking about success has evolved.',
];

/** First prompt for each onboarding context choice. */
export const CONTEXT_PROMPTS: Record<string, string> = {
  meetings: 'Walk me through a decision your team made recently and why it was the right call.',
  presentations: 'Explain the main idea of your current project as if you were opening a talk about it.',
  interviews: 'Tell me about a piece of work you are proud of and what made it hard.',
  everyday: 'Describe something interesting that happened to you this week.',
};

export function getTodaysPrompt(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return PROMPTS[dayOfYear % PROMPTS.length];
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function formatShortDate(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateStr = date.toDateString();
  if (dateStr === today.toDateString()) return 'Today';
  if (dateStr === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
