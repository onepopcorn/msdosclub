import { renderWithAudio as render, screen } from 'test-utils';
import AudioProgress from '.';

const providerData = {
  state: {
    id: 30,
    progress: {
      10: {
        elapsed: '10',
        duration: '100',
      },
    },
  },
};

test('AudioProgress should show the podcast listened progress when the podcast is not being played', () => {
  render(<AudioProgress id={10} />, null, providerData);

  screen.getByText(/10%/i);
  expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('10');
  expect(screen.getByRole('progressbar').getAttribute('aria-valuemax')).toBe('100');
});

test('AudioProgress should show a fake audio waveform animation when the podcast is being played', () => {
  render(<AudioProgress id={30} />, null, providerData);

  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  expect(screen.getByAltText('reproduciendo').src).toContain('soundwave.gif');
});
