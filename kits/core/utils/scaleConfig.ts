// scaleConfig.ts
import { Dimensions } from 'react-native';

const dimension = Dimensions.get('window');
let width =  Math.min(dimension.width, dimension.height);
let height = Math.max(dimension.width, dimension.height);
export const updateDimensions = () => {
  const dim = Dimensions.get('window');

  width = dim.width;
  height = dim.height;
};

export const getDimensions = () => ({
    width,
    height,
});
// export const getHeight = () => height;

// Tự động lắng nghe khi screen thay đổi
Dimensions.addEventListener('change', ({window}) => {
    width = Math.min(window.width, window.height);
    height =  Math.max(window.width, window.height);
  // updateDimensions();
});
