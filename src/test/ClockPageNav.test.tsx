import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ClockPageNav from '../components/ClockPageNav';

describe('ClockPageNav', () => {
  it('renders previous and next items', () => {
    const prevItem = { date: '26-01-01', title: 'Previous Item' };
    const nextItem = { date: '26-01-03', title: 'Next Item' };
    const currentItem = { date: '26-01-02', title: 'Current Item' };

    render(
      <MemoryRouter>
        <ClockPageNav
          prevItem={prevItem}
          nextItem={nextItem}
          currentItem={currentItem}
          formatTitle={(title) => title ?? ''}
          _formatDate={(date) => date ?? ''}
        />
      </MemoryRouter>,
    );

    // Check for prev/next navigation arrows
    expect(screen.getByText('⇽')).toBeInTheDocument();
    expect(screen.getByText('⇾')).toBeInTheDocument();
    // Check current item title
    expect(screen.getByText('Current Item')).toBeInTheDocument();
  });
});
