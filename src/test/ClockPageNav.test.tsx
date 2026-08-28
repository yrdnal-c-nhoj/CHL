import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ClockPageNav from '../components/ClockPageNav';

const navItem = {
  date: '26-03-05',
  title: 'Retro Terminal',
  clockNumber: 1,
  tags: ['test', 'snapshot'],
};

const formatTitle = (title?: string | null) => title ?? '';
const formatDate = (d?: string | null) => d ?? '';

const renderNav = (props = {}) =>
  render(
    <MemoryRouter>
      <ClockPageNav
        prevItem={navItem}
        nextItem={navItem}
        currentItem={navItem}
        formatTitle={formatTitle}
        formatDate={formatDate}
        {...props}
      />
    </MemoryRouter>,
  );

describe('ClockPageNav Snapshots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('matches snapshot with prev and next items', () => {
    const { container } = renderNav();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot when current item is missing (returns null)', () => {
    const { container } = renderNav({ currentItem: null as any });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with no tags on current item', () => {
    const { container } = renderNav({
      currentItem: { ...navItem, tags: undefined },
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with no prev item', () => {
    const { container } = renderNav({ prevItem: null });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with no next item', () => {
    const { container } = renderNav({ nextItem: null });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with no prev and no next items', () => {
    const { container } = renderNav({ prevItem: null, nextItem: null });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with string clockNumber', () => {
    const { container } = renderNav({
      currentItem: { ...navItem, clockNumber: '42' },
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with undefined clockNumber', () => {
    const { container } = renderNav({
      currentItem: { ...navItem, clockNumber: undefined },
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with empty title', () => {
    const { container } = renderNav({
      currentItem: { ...navItem, title: '' },
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
