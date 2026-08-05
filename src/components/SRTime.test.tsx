import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SRTime from './SRTime';

describe('<SRTime />', () => {
  it('renders a <time> element with the correct dateTime attribute', () => {
    const testDate = new Date('2024-08-10T14:30:00.000Z');
    render(<SRTime time={testDate} />);

    const timeElement = screen.getByRole('time');
    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveAttribute('dateTime', testDate.toISOString());
  });

  it('renders the time in the local time string format', () => {
    const testDate = new Date('2024-08-10T22:05:15.000Z');
    render(<SRTime time={testDate} />);

    // toLocaleTimeString() is dependent on the test runner's environment locale.
    // We check for the presence of the core parts.
    const expectedTime = testDate.toLocaleTimeString();
    const timeElement = screen.getByText(expectedTime);
    expect(timeElement).toBeInTheDocument();
  });

  it('applies the srOnly class for visual hiding', () => {
    const testDate = new Date();
    const { container } = render(<SRTime time={testDate} />);
    // The className will be mangled by CSS Modules, so we check for its presence.
    expect(container.querySelector('time')?.className).toContain('srOnly');
  });
});