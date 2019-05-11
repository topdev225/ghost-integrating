import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const STANDARD_WIDTH = 375;
export const CURRENT_WIDTH = width;
export const CURRENT_HEIGHT = height;
const K = CURRENT_WIDTH / STANDARD_WIDTH;

const USE_FOR_BIGGER_SIZE = true;

export function dySize(size) {
  return K * size;
}

export function getFontSize(size) {
  if (USE_FOR_BIGGER_SIZE || CURRENT_WIDTH < STANDARD_WIDTH) {
    const newSize = dySize(size);
    return newSize;
  }
  return size;
}
