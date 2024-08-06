import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Post from './Post';

const postTestData = {
  id: 42,
  title: 'title test stub',
  date: '22/22/22',
  caption: 'image caption stub',
  thumb: 'img-src-stub',
};

test('Post should show passed post data', () => {
  render(<Post post={postTestData}>children test stub</Post>);

  screen.getByText(/title test stub/i);
  screen.getByText(/22\/22\/22/i);
  screen.getByAltText(/image caption stub/i);
  screen.getByText(/children test stub/i);
  expect(screen.getByRole('img').src).toContain(postTestData.thumb);
});

test('Post should trigger callback when clicked', () => {
  const callback = vi.fn();
  render(<Post post={postTestData} onClick={callback} />);

  userEvent.click(screen.getByRole('button'));
  expect(callback).toBeCalledTimes(1);
  expect(callback).toBeCalledWith(42);
});

test('Post should not throw when clicked but no callback provided', () => {
  render(<Post post={postTestData} onClick={null} />);

  userEvent.click(screen.getByRole('button'));
});

test('Post should show a check sign when podcast is mark as viewed', () => {
  render(<Post post={postTestData} viewed />);

  screen.getAllByLabelText(/check/i);
});
