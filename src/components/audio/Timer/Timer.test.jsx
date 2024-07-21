import { screen, render, fireEvent } from '@testing-library/react';
import Timer from './Timer';

test('Timer should render default values when no time or invalid time data is passed', () => {
  const { rerender } = render(<Timer />);
  expect(screen.getAllByText(/--:--:--/i).length).toBe(2);

  rerender(<Timer elapsed={Infinity} total={NaN} />);
  expect(screen.getAllByText(/--:--:--/i).length).toBe(2);
});

test('Timer should format passed time correctly', () => {
  render(<Timer elapsed={10} total={56703} />);
  screen.getByText(/00:00:10/i);
  screen.getByText(/15:45:03/i);
});

test('Timer should show time left after clicking', () => {
  render(<Timer elapsed={30} total={120} />);
  const time = screen.getByText(/00:00:30/i);
  fireEvent.click(time);
  screen.getByText(/00:01:30/i);
});
