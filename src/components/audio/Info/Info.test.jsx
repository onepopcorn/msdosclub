import { render, screen } from '@testing-library/react';
import Info from './Info';

test('Info should show passed title if needed', () => {
  render(<Info title={'text passed'} />);
  screen.getByText(/text passed/i);
});

// Text auto scroll when it doesn't fits on its container should be tested on e2e tests
