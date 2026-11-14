import React from 'react';
import { render, screen } from '@testing-library/react';
import ClockPageNav from '../components/ClockPageNav';

describe('ClockPageNav', () => {
  it('renders previous and next items', () => {
    const prevItem = { title: 'Previous Item' };
    const nextItem = { title: 'Next Item' };
    const currentItem = { title: 'Current Item' };

    render(<ClockPageNav prevItem={prevItem} nextItem={nextItem} currentItem={currentItem} formatTitle={(title) => title} formatDate={(date) => date} />);

    expect(screen.getByText('Previous Item')).toBeInTheDocument();
    expect(screen.getByText('Next Item')).toBeInTheDocument();
  });
});
