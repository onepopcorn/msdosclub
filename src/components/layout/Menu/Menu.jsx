import PropTypes from 'prop-types';
import { SlIcon } from '@shoelace-style/shoelace/dist/react';

// Styles
import classNames from 'classnames/bind';
import style from './Menu.module.css';
import useMatchMedia from 'hooks/useMatchMedia';
let cx = classNames.bind(style);

export default function Menu({ menuItems = [], onItemClick }) {
  const matches = useMatchMedia(600);
  if (!matches) return null;
  return (
    <aside className={cx('container')}>
      <menu className={cx('menu')}>
        <h1 className={cx('title')}>MS-DOS Club</h1>
        <nav className={cx('nav')}>
          {menuItems.map(({ icon, label, value }) => (
            <button className={cx('menuButton')} key={value} onClick={() => onItemClick(value)}>
              {icon && <SlIcon className={cx('icon')} name={icon} />}
              {label}
            </button>
          ))}
        </nav>
      </menu>
    </aside>
  );
}

Menu.propTypes = {
  /**
   * Menu item element
   */
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Optional icon name
       */
      icon: PropTypes.string,
      /**
       * Label to print on the menu
       */
      label: PropTypes.string.isRequired,
      /**
       * Value or array of values to be passed to onItemClicked function
       */
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
    }),
  ),
  /**
   * Function that will be trigger when item is clicked.
   * item value will be passed as a param to this function
   */
  onItemClick: PropTypes.func.isRequired,
};
