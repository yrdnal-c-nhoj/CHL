import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MonthDropdown from '../components/MonthDropdown';

const items = [
  { date: '26-03-05', title: 'Test A', clockNumber: 1, path: '/26-03-05', tags: [] },
  { date: '26-03-04', title: 'Test B', clockNumber: 2, path: '/26-03-04', tags: ['tag1'] },
  { date: '26-03-03', title: 'Test C', clockNumber: 3, path: '/26-03-03', tags: ['tag1', 'tag2'] },
];

const formatDate = (dateStr: string | undefined) => dateStr ?? '';

const renderDropdown = (props = {}) =>
  render(
    <MemoryRouter>
      <MonthDropdown
        monthKey="26-03"
        monthName="MAR'26"
        items={items}
        formatDate={formatDate}
        {...props}
      />
    </MemoryRouter>,
  );

describe('MonthDropdown Snapshots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('matches snapshot when collapsed', () => {
    const { container } = renderDropdown({ isExpanded: false });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot when expanded', () => {
    const { container } = renderDropdown({ isExpanded: true });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with empty items array', () => {
    const { container } = renderDropdown({ items: [], isExpanded: true });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with single item', () => {
    const { container } = renderDropdown({
      items: [items[0]],
      isExpanded: true,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with items having tags', () => {
    const { container } = renderDropdown({
      items: [items[2]],
      isExpanded: true,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot when onToggle is provided', () => {
    const onToggle = vi.fn();
    const { container } = renderDropdown({
      onToggle,
      isExpanded: false,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with default sort (date-desc)', () => {
    const { container } = renderDropdown({ isExpanded: true });
    expect(container.firstChild).toMatchSnapshot();
  });
});
