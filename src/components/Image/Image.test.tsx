import images from '@assets/images';
import { render, screen } from '@testing-library/react-native';
import TestAppWrapper from '@tests/TestAppWrapper';

import Image from '.';

describe('Image', () => {
  it('resolves the registered image from its name', () => {
    render(<Image name="tom" testID="image" />, {
      wrapper: TestAppWrapper,
    });

    const image = screen.getByTestId('image');
    expect(image.props.source).toBe(images.tom);
  });

  it('forwards extra props to the underlying image', () => {
    render(<Image name="tom" resizeMode="contain" testID="image" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('image').props.resizeMode).toBe('contain');
  });
});
