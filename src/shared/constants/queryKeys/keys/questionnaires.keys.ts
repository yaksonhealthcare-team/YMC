import { createQueryKeyFactory } from '../queryKeyFactory';

const questionnairesKeys = createQueryKeyFactory('questionnaires');

export const questionnaires = {
  all: questionnairesKeys.all(),
  questions: (type: 'common' | 'reservation') => [...questionnaires.all, 'questions', type] as const,
  userResult: (type: 'general' | 'reservation') => [...questionnaires.all, 'user_result', type] as const
} as const;
