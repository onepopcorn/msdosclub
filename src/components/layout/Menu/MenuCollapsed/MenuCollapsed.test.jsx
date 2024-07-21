import { screen, renderWithMenu as render } from 'test-utils';
import userEvent from '@testing-library/user-event';
import Menu from './MenuCollapsed';

test('MenuCollapsed should not be rendered if screen is bigger than 600px', () => {
  window.matchMedia.mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() });
  render(<Menu menuItems={[{ label: 'item-stub', value: 1 }]} onItemClick={vi.fn()} />);

  expect(screen.queryByText('item-stub')).not.toBeInTheDocument();
});

test('MenuCollapsed should render passed menu items', () => {
  window.matchMedia.mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() });
  const items = [
    { label: 'item-stub-one', value: 4 },
    { label: 'item-stub-two', value: [2, 5] },
  ];
  const callback = vi.fn();
  const menuOpenCallback = vi.fn();
  render(<Menu menuItems={items} onItemClick={callback} />, null, { menuOpen: true, setMenuOpen: menuOpenCallback });

  // Items are rendered correctly
  const buttons = screen.getAllByRole('button');
  expect(buttons.length).toBe(2);

  // Check buttons can be clicked
  userEvent.click(screen.getByRole('button', { name: /item-stub-one/i }));
  expect(callback).toBeCalledTimes(1);
  expect(callback).toBeCalledWith(4);

  // Clicking on a menu item forces the menu to be collapsed
  expect(menuOpenCallback).toBeCalledTimes(1);
});

test('Menu should not complain when an empty array of elements is passed', () => {
  window.matchMedia.mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() });
  render(<Menu menuItems={[]} onItemClick={vi.fn()} />);
  expect(screen.getByRole('navigation')).toBeEmptyDOMElement();
});
