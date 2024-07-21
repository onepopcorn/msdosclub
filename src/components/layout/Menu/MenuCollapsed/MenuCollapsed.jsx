import { useContext } from 'react';
import PropTypes from 'prop-types';
import { SlIcon, SlDrawer } from '@shoelace-style/shoelace/dist/react';

// Providers
import { MenuStore } from 'providers/MenuStore';

// Hooks
import useMatchMedia from 'hooks/useMatchMedia';

// Styles
import classNames from 'classnames/bind';
import style from './MenuCollapsed.module.css';
let cx = classNames.bind(style);

export default function MenuCollapsed({ menuItems = [], onItemClick }) {
  const { menuOpen, setMenuOpen } = useContext(MenuStore);
  const matches = useMatchMedia(600);

  // Prevent component rendering on wide screens
  if (matches) return null;

  const onItemClicked = (value) => {
    setMenuOpen(false);
    onItemClick(value);
  };

  return (
    <SlDrawer
      label="MS-DOS Club"
      data-testid="drawer"
      open={menuOpen}
      style={{ '--size': '65vw' }}
      onSlRequestClose={() => setMenuOpen(false)}
    >
      <nav className={cx('nav')}>
        {menuItems.map(({ icon, label, value }) => (
          <button className={cx('menuButton')} key={value} onClick={() => onItemClicked(value)}>
            {icon && <SlIcon className={cx('icon')} name={icon} />}
            {label}
          </button>
        ))}
      </nav>
    </SlDrawer>
  );
}

MenuCollapsed.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
    }),
  ),
  onItemClick: PropTypes.func.isRequired,
};
