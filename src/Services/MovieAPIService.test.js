import MovieAPIService from './MovieAPIService';

window.fetch = jest.fn(() => {
  return {
    json: () => ({
      credits: [
        {
          id: 1,
          name: 'Jolie'
        }
      ],
      genres: [
        {
          id: 1,
          name: 'Fantasy'
        }
      ],
      backdrops: [
        {
          width: 500,
          file_path: 'somewhere.jpg'
        }
      ]
    })
  };
});

describe('MovieAPIService tests', () => {
  beforeEach(() => {
    window.fetch.mockClear();
  });

  it('should throw an exception if we try to search with searchWord', () => {
    const toThrow = () => MovieAPIService.multiSearch(undefined, 2);
    expect(toThrow).toThrow();
  });

  it('should be able to search for a movie if a word is provided', () => {
    MovieAPIService.multiSearch('something');
    expect(window.fetch).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/search/multi?api_key=4b961a668279701f1f9b054ba679c799&language=en-US&query=something'
    );
  });

  it('should get the latest movies', () => {
    MovieAPIService.getNowPlaying();
    expect(window.fetch).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/movie/now_playing?api_key=4b961a668279701f1f9b054ba679c799&language=en-US&page=1'
    );
  });

  it('should get the latest by page', () => {
    MovieAPIService.getNowPlaying(2);
    expect(window.fetch).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/movie/now_playing?api_key=4b961a668279701f1f9b054ba679c799&language=en-US&page=2'
    );
  });

  it('should get the movie images', () => {
    MovieAPIService.getMovieImages(123);
    expect(window.fetch).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/movie/123/images?api_key=4b961a668279701f1f9b054ba679c799&language=en-US&include_image_language=en%2Cnull'
    );
  });

  it('should get the hero image', done => {
    window.innerWidth = 300;
    MovieAPIService.getMovieImages = jest.fn(() => ({
      backdrops: [
        {
          width: 500,
          file_path: '/somewhere.jpg'
        },
        {
          width: 700,
          file_path: '/somewhere.jpg'
        }
      ],
      posters: [
        {
          width: 700,
          file_path: '/poster.jpg'
        }
      ]
    }));
    const promise = MovieAPIService.getHeroImage(134);
    promise
      .then(path => {
        expect(MovieAPIService.getMovieImages).toHaveBeenCalledWith(134);
        expect(path).toBe('https://image.tmdb.org/t/p/w1280/somewhere.jpg');
        done();
      })
      .catch(done.fail);
  });

  it('should fetch genres', done => {
    const results = MovieAPIService.getGenres();
    expect(window.fetch).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=4b961a668279701f1f9b054ba679c799&language=en-US'
    );

    results
      .then(data => {
        expect(data).toBe(MovieAPIService.genres);
        done();
      })
      .catch(done.fail);
  });

  it('should the genre strings', done => {
    MovieAPIService.getGenres = jest.fn(() => ({ '5': 'Fantasy' }));
    const results = MovieAPIService.getGenresStrings(['5']);
    expect(MovieAPIService.getGenres).toHaveBeenCalled();

    results.then(data => {
      expect(data[0]).toBe('Fantasy');
      done();
    });
  });

  it('should map genres', done => {
    MovieAPIService.getGenresStrings = jest.fn(() => ['Fantasy', 'Sport']);
    const results = MovieAPIService.mapGenres([{ 1: 'Fantasy', 2: 'Sport' }]);
    expect(MovieAPIService.getGenresStrings).toHaveBeenCalled();
    results.then(done).catch(done.fail);
  });

  it('should get the credits for a movie', done => {
    const results = MovieAPIService.getMovieCredits(123);
    expect(window.fetch).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/movie/123/credits?api_key=4b961a668279701f1f9b054ba679c799'
    );

    results
      .then(data => {
        expect(data.credits[0].name).toBe('Jolie');
        done();
      })
      .catch(done.fail);
  });

  it('should get the movie details', () => {
    const results = MovieAPIService.getMovieDetails(123);
    expect(window.fetch).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/movie/123?api_key=4b961a668279701f1f9b054ba679c799'
    );
  });
});
