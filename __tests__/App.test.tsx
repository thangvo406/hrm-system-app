/**
 * @format
 */

import { render, screen } from '@testing-library/react-native';

import App from '../src/App';

test('renders correctly', () => {
  render(<App />);

  expect(screen.toJSON()).toBeTruthy();
});
