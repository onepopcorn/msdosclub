import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorFallback from './ErrorFallback';

test('Error fallback should show the error message', () => {
  render(<ErrorFallback resetErrorBoundary={vi.fn()} />);

  screen.getByText(/vaya...la hemos cagado/i);
});

test('Error fallback should show a retry button', () => {
  const resetFunc = vi.fn();
  render(<ErrorFallback resetErrorBoundary={resetFunc} />);

  userEvent.click(screen.getByTestId('retryBtn'));
  expect(resetFunc).toBeCalledTimes(1);
});
