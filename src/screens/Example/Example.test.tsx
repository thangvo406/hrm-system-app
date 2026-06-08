import { fireEvent, render, screen } from '@testing-library/react-native';
import TestAppWrapper from '@tests/TestAppWrapper';

import Example from './Example';

describe('Example counter screen', () => {
  it('renders the initial count of 0', () => {
    render(<Example />, { wrapper: TestAppWrapper });
    expect(screen.getByTestId('counter-value').props.children).toBe(0);
  });

  it('increments the count when pressing the plus button', () => {
    render(<Example />, { wrapper: TestAppWrapper });

    fireEvent.press(screen.getByTestId('increment-button'));
    fireEvent.press(screen.getByTestId('increment-button'));

    expect(screen.getByTestId('counter-value').props.children).toBe(2);
  });

  it('decrements the count when pressing the minus button', () => {
    render(<Example />, { wrapper: TestAppWrapper });

    fireEvent.press(screen.getByTestId('increment-button'));
    fireEvent.press(screen.getByTestId('decrement-button'));

    expect(screen.getByTestId('counter-value').props.children).toBe(0);
  });
});
