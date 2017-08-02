import { err, createImageUrl } from './Helpers';

describe('Helpers tests', () => {
  it('should throw when err() is called', () => {
    const toThrow = () => err('Mandatory parameter');
    expect(toThrow).toThrowError('Mandatory parameter');
  });

  it('should create an image url when createImageUrl() is called', () => {
    expect(createImageUrl('/path.png', 'w500')).toBe(
      'https://image.tmdb.org/t/p//w500/path.png'
    );
  });
});
