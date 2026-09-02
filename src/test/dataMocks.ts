import { vi } from 'vitest';

export const mockState = {
  data: [
    { path: '26-03-05', date: '26-03-05', title: 'Retro Terminal' },
    { path: '26-03-04', date: '26-03-04', title: 'Sun Clock' },
    { path: '26-03-03', date: '26-03-03', title: 'Moon Clock' },
  ],
  shouldThrow: false,
};

vi.mock('../context/clockpages.json', () => ({
  get default() {
    console.log('clockpages.json getter called, data length:', mockState.data?.length);
    if (mockState.shouldThrow) throw new Error('Network failure');
    return mockState.data;
  },
}));

vi.mock('../context/testclocks.json', () => ({
  get default() {
    console.log('testclocks.json getter called, data length:', mockState.data?.length);
    if (mockState.shouldThrow) throw new Error('Network failure');
    return mockState.data;
  },
}));
