import { err } from '../Helpers/Helpers';
import cfg from '../config';

/**
 * Search for a movie
 *
 * @class MovieAPIService
 */
export default class MovieAPIService {
  // memoize, its unlikely that genres will change though a user session
  static genres = {};

  /**
   * Search for movie, tv-series or person
   *
   * @static
   * @param {string} [name=err('search term is mandatory')]
   * @returns {promise}
   */
  static async multiSearch(name = err('search term is mandatory')) {
    const request = await fetch(
      `${cfg.endPointBase}search/multi?${cfg.apiKey}&language=en-US&query=${name}`
    );
    const data = await request.json();
    return data;
  }

  /**
   * Returns the movies that are now playing on the theaters
   *
   * @static
   * @returns {promise}
   */
  static async getNowPlaying(page = 1) {
    const request = await fetch(
      `${cfg.endPointBase}movie/now_playing?${cfg.apiKey}&language=en-US&page=${page}`
    );
    const data = await request.json();
    return data;
  }

  /**
   * Returns the images for a movie
   *
   * @static
   * @param {number} movieID
   * @returns {string}
   */
  static async getMovieImages(movieID) {
    const request = await fetch(
      `${cfg.endPointBase}movie/${movieID}/images?${cfg.apiKey}&language=en-US&include_image_language=en%2Cnull`
    );
    const data = await request.json();
    return data;
  }

  /**
   * Returns a hero image based on the window width
   *
   * @static
   * @param {number} movieID
   * @returns {string}
   */
  static async getHeroImage(movieID, width = 1280) {
    const images = await MovieAPIService.getMovieImages(movieID);
    /* istanbul ignore next */
    images.backdrops = images.backdrops || [];
    let backdrops = images.backdrops
      .sort((a, b) => a.width - b.width)
      .filter(img => img.width > window.innerWidth); // try to load the smallest t possible image

    // For old movies there are not backdrops of certain size or not at all
    /* istanbul ignore next */
    backdrops = backdrops.length ? backdrops : images.backdrops;
    /* istanbul ignore next */
    backdrops = backdrops.length ? backdrops : images.posters;

    return `${cfg.imageBaseUrl}w${width}${backdrops[0].file_path}`;
  }

  /**
   * Returns the a list of genres
   *
   * @static
   * @returns {array}
   */
  static async getGenres() {
    /* istanbul ignore if */
    if (MovieAPIService.genres.length) return MovieAPIService.genres;
    const request = await fetch(
      `${cfg.endPointBase}genre/movie/list?${cfg.apiKey}&language=en-US`
    );
    const data = await request.json();
    data.genres.forEach(value => {
      MovieAPIService.genres[value.id] = value.name;
    });
    return MovieAPIService.genres;
  }

  /**
   * Maps genre ids to strings
   *
   * @static
   * @param {array<number>} genres
   * @returns {array<string>}
   */
  static async getGenresStrings(genres) {
    const genresMapping = await MovieAPIService.getGenres();
    return genres.map(id => genresMapping[id]);
  }

  /**
   * Get Movie Details
   *
   * @static
   * @param {number} movieID
   * @returns {Promise<object>}
   */
  static async getMovieDetails(movieID) {
    const request = await fetch(
      `${cfg.endPointBase}movie/${movieID}?${cfg.apiKey}`
    );
    const data = await request.json();
    return data;
  }

  /**
   * Map genre_ids to genre strings
   *
   * @param {array} results
   * @returns {Promise<array>}
   */
  static async mapGenres(results) {
    // Map genre ids with genre strings for every movie
    results = await (() => {
      return Promise.all(
        results.map(async movie => {
          const genres = await MovieAPIService.getGenresStrings(
            movie.genre_ids
          );
          movie.genres = genres;
          return Promise.resolve(movie);
        })
      );
    })();

    return results;
  }

  /**
   * Get Movie Credits (actors etc)
   *
   * @static
   * @param {number} movieID
   * @returns {Promise<object>}
   */
  static async getMovieCredits(movieID) {
    const request = await fetch(
      `${cfg.endPointBase}movie/${movieID}/credits?${cfg.apiKey}`
    );
    const data = await request.json();
    return data;
  }
}

MovieAPIService.getMovieCredits(324852);
