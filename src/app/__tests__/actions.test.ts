import { getBurnoutScore, evaluateStudyBalance } from '../actions';

// Mock the Gemini AI
jest.mock('@/lib/gemini', () => ({
  ai: {
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: '{"score": 85, "feedback": "Great balance", "recommendation": "Keep it up"}'
      })
    }
  }
}));

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  db: {}
}));

jest.mock('firebase/firestore/lite', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({
    empty: false,
    docs: [
      { data: () => ({ analysis: { burnoutRisk: 60 } }) },
      { data: () => ({ analysis: { burnoutRisk: 70 } }) },
    ]
  }),
  addDoc: jest.fn(),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
}));

describe('Server Actions', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project';
  });

  it('getBurnoutScore calculates average properly', async () => {
    const result = await getBurnoutScore('user123');
    // Avg of 60 and 70 is 65
    expect(result.score).toBe(65);
    expect(result.explanation).toBe('{"score": 85, "feedback": "Great balance", "recommendation": "Keep it up"}');
  });

  it('evaluateStudyBalance parses AI JSON', async () => {
    const result = await evaluateStudyBalance(8, 8, 30);
    expect(result.score).toBe(85);
    expect(result.feedback).toBe('Great balance');
  });

  it('evaluateStudyBalance rejects out-of-bound or invalid values', async () => {
    const resultInvalidHours = await evaluateStudyBalance(25, 8, 30);
    expect(resultInvalidHours.score).toBe(0);
    expect(resultInvalidHours.feedback).toBe("Invalid daily routine duration input.");

    const resultInvalidExercise = await evaluateStudyBalance(8, 8, -5);
    expect(resultInvalidExercise.score).toBe(0);
    expect(resultInvalidExercise.recommendation).toContain("exercise is [0-1440] minutes");
  });
});
