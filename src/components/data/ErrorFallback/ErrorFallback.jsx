import PropTypes from 'prop-types';
import { SlIcon, SlIconButton } from '@shoelace-style/shoelace/dist/react';

export default function ErrorFallback({ resetErrorBoundary }) {
  return (
    <div role="alert" style={{ textAlign: 'center' }}>
      <SlIcon style={{ fontSize: '3em', paddingTop: '1em' }} name="emoji-dizzy" label="error" />
      <p>Vaya...la hemos cagado</p>
      <div>re-intentar</div>
      <SlIconButton name="arrow-clockwise" data-testid="retryBtn" label="reintentar" onClick={resetErrorBoundary} />
    </div>
  );
}

ErrorFallback.propTypes = {
  resetErrorBoundary: PropTypes.func.isRequired,
};
