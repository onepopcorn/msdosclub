import { render, screen } from '@testing-library/react';
import App from '../App';

test('App can me mounted withouht issues', () => {
    render(<App />);
    const text = screen.getByText(/ms-dos/i);
    expect(text).toBeInTheDocument();
});
