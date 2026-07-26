export interface Word {
  id: string;
  word: string;
  definition: string;
  example: string;
}

export const WORD_BANK: Word[] = [
  { id: 'w001', word: 'mitigate', definition: 'To lessen the severity or impact of something', example: 'We can mitigate the risk by testing early.' },
  { id: 'w002', word: 'articulate', definition: 'To express clearly and precisely', example: 'She articulated the tradeoffs without over-explaining.' },
  { id: 'w003', word: 'distinguish', definition: 'To recognize or show a difference between things', example: 'It helps to distinguish the symptom from the cause.' },
  { id: 'w004', word: 'iterate', definition: 'To repeat a process with improvements each time', example: 'We iterate on the design based on what we learn.' },
  { id: 'w005', word: 'calibrate', definition: 'To adjust carefully so something is accurate or appropriate', example: 'I had to calibrate my expectations after seeing the data.' },
  { id: 'w006', word: 'premise', definition: 'An underlying assumption that a conclusion rests on', example: 'The whole argument depends on that premise being true.' },
  { id: 'w007', word: 'substantive', definition: 'Meaningful, having real depth or importance', example: 'That was the first substantive conversation we had about it.' },
  { id: 'w008', word: 'coherent', definition: 'Logically connected and easy to follow', example: 'The plan wasn\'t coherent — the steps didn\'t connect.' },
  { id: 'w009', word: 'viable', definition: 'Capable of working successfully', example: 'That\'s only viable if the timeline shifts.' },
  { id: 'w010', word: 'reconcile', definition: 'To make two conflicting things compatible', example: 'It\'s hard to reconcile what they want with what we can deliver.' },
  { id: 'w011', word: 'granular', definition: 'Detailed at a fine level', example: 'We need granular data to understand what\'s actually happening.' },
  { id: 'w012', word: 'tangible', definition: 'Concrete and measurable, not abstract', example: 'I need tangible progress before the next review.' },
  { id: 'w013', word: 'threshold', definition: 'The point at which something changes or begins', example: 'Once you cross that threshold, the cost model changes completely.' },
  { id: 'w014', word: 'explicit', definition: 'Stated clearly and directly, leaving no ambiguity', example: 'Be explicit about what you need or you won\'t get it.' },
  { id: 'w015', word: 'implicit', definition: 'Understood without being directly stated', example: 'There\'s an implicit expectation that everyone reads the doc first.' },
  { id: 'w016', word: 'robust', definition: 'Strong, reliable, and able to handle variation', example: 'The system needs to be robust before we scale it.' },
  { id: 'w017', word: 'arbitrary', definition: 'Based on random choice rather than a clear reason', example: 'The cutoff feels arbitrary — no one can explain the logic.' },
  { id: 'w018', word: 'marginal', definition: 'Small in degree, at or near a boundary', example: 'The gain is marginal compared to the added complexity.' },
  { id: 'w019', word: 'precedent', definition: 'An earlier decision or case that informs later ones', example: 'This sets a precedent that\'s hard to walk back.' },
  { id: 'w020', word: 'friction', definition: 'Resistance or difficulty in a process or relationship', example: 'Adding a step there introduces friction for the user.' },
  { id: 'w021', word: 'leverage', definition: 'To use something to maximum advantage', example: 'We can leverage the existing infrastructure instead of rebuilding.' },
  { id: 'w022', word: 'deliberate', definition: 'Done consciously and intentionally, not by accident', example: 'That was a deliberate choice, not an oversight.' },
  { id: 'w023', word: 'constraint', definition: 'A limitation that shapes what is possible', example: 'Time is the binding constraint on this project.' },
  { id: 'w024', word: 'trajectory', definition: 'The path or direction something is moving in over time', example: 'The trajectory looks good even if the current numbers don\'t.' },
  { id: 'w025', word: 'inherent', definition: 'Existing as a natural and permanent part of something', example: 'There\'s inherent risk in any approach we take.' },
  { id: 'w026', word: 'infer', definition: 'To draw a conclusion from evidence without being told directly', example: 'From the silence, I inferred they were not happy with it.' },
  { id: 'w027', word: 'nuance', definition: 'A subtle but important difference', example: 'The nuance is that one is opt-in and the other is default.' },
  { id: 'w028', word: 'contend', definition: 'To argue or maintain a position', example: 'I contend that the problem starts earlier in the process.' },
  { id: 'w029', word: 'empirical', definition: 'Based on observation or evidence rather than theory', example: 'We have empirical evidence that the pattern holds.' },
  { id: 'w030', word: 'redundant', definition: 'Unnecessarily repeated or no longer serving a purpose', example: 'That approval step is redundant given the new process.' },
  { id: 'w031', word: 'delineate', definition: 'To describe or draw the boundaries of something precisely', example: 'We need to delineate who owns what before the project starts.' },
  { id: 'w032', word: 'systematic', definition: 'Done according to a fixed plan or system, methodically', example: 'A systematic review would catch things ad hoc testing misses.' },
  { id: 'w033', word: 'anticipate', definition: 'To expect and prepare for something before it happens', example: 'We should anticipate objections before the presentation.' },
  { id: 'w034', word: 'synthesize', definition: 'To combine different elements into a coherent whole', example: 'The report synthesizes input from six different teams.' },
  { id: 'w035', word: 'validate', definition: 'To confirm something is correct or sound', example: 'We need to validate the assumption before building on it.' },
  { id: 'w036', word: 'scrutinize', definition: 'To examine very carefully and critically', example: 'Every assumption in the model should be scrutinized.' },
  { id: 'w037', word: 'proportionate', definition: 'Appropriate in size or degree relative to something else', example: 'The response needs to be proportionate to the actual risk.' },
  { id: 'w038', word: 'consolidate', definition: 'To combine into a single, more effective unit', example: 'We can consolidate the three reports into one weekly summary.' },
  { id: 'w039', word: 'bottleneck', definition: 'A point where progress is slowed down by limited capacity', example: 'The bottleneck is review, not development.' },
  { id: 'w040', word: 'iterative', definition: 'Characterized by repeated cycles of improvement', example: 'It\'s an iterative process — you won\'t get it right the first time.' },
  { id: 'w041', word: 'alignment', definition: 'Agreement or correspondence between people or things', example: 'Get alignment before you build or you will rebuild.' },
  { id: 'w042', word: 'implication', definition: 'A conclusion that follows logically from something', example: 'The implication is that we\'d need to rewrite the whole layer.' },
  { id: 'w043', word: 'mechanism', definition: 'The process by which something happens or is brought about', example: 'What\'s the mechanism that makes this work in practice?' },
  { id: 'w044', word: 'magnitude', definition: 'The size or scale of something', example: 'I wasn\'t expecting the magnitude of the reaction.' },
  { id: 'w045', word: 'caveat', definition: 'An important qualification or warning about a statement', example: 'The caveat is that this only applies when the data is clean.' },
  { id: 'w046', word: 'assess', definition: 'To evaluate or estimate the nature of something', example: 'Take a moment to assess the situation before responding.' },
  { id: 'w047', word: 'attribute', definition: 'To regard something as caused by or belonging to something', example: 'I would attribute most of the improvement to the new process.' },
  { id: 'w048', word: 'gauge', definition: 'To estimate or determine the extent of something', example: 'It\'s hard to gauge how much time this will actually take.' },
  { id: 'w049', word: 'pivotal', definition: 'Of crucial importance, at a turning point', example: 'That conversation was pivotal in changing how we approached it.' },
  { id: 'w050', word: 'concise', definition: 'Giving a lot of information clearly in few words', example: 'A concise summary serves people better than a full report.' },
];

export function getTodaysWord(): Word {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return WORD_BANK[dayOfYear % WORD_BANK.length];
}
