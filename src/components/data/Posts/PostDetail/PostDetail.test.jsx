import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostDetail from './PostDetail';

afterEach(() => vi.resetAllMocks());

const testPostData = {
  title: 'title-stub',
  author: 'author-stub',
  date: 'date-stub',
  close: vi.fn(),
  images: {
    srcset: 'srcset-stub',
    caption: 'caption-stub',
    sizes: 'sizes-stub',
    full: {
      width: 512,
      height: 512,
      source_url: 'image-full-stub',
    },
  },
};

test('PostDetail should print post data correctly', () => {
  render(<PostDetail {...testPostData}>test content</PostDetail>);

  screen.getByRole('img', { name: /caption-stub/i });
  screen.getByText(/title-stub/i);
  screen.getByText(/author-stub/i);
  screen.getByText(/date-stub/i);
  screen.getByText(/test content/i);
});

test('PostDetail should use post title if image caption is not provided', () => {
  render(
    <PostDetail {...testPostData} images={{ ...testPostData.images, caption: null }}>
      test content
    </PostDetail>,
  );

  screen.getByRole('img', { name: /title-stub/i });
});

test('PostDetail should print should print optional component before content if provided', () => {
  render(
    <PostDetail {...testPostData} beforeContent={<div>before content</div>}>
      test content
    </PostDetail>,
  );

  screen.getByText(/before content/i);
  screen.getByText(/test content/i);
});

test('PostDetail should have a callback to close the detail view', () => {
  render(<PostDetail {...testPostData} />);
  userEvent.click(screen.getByTestId('close-btn'));
  expect(testPostData.close).toBeCalledTimes(1);
});
