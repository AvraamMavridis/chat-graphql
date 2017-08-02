import React from 'react';
import { mount } from 'enzyme';
import Main from './Main';
import SearchForm from '../../Components/SearchForm/SearchForm';
import MainMovie from '../../Components/MainMovie/MainMovie';
import Results from '../../Components/Results/Results';

jest.mock('../../Services/MovieAPIService', () => ({
  getNowPlaying: () =>
    Promise.resolve({
      results: [
        {
          id: 1,
          title: 'Nice Movie',
          poster_path: '/path.jpg',
          adult: false
        }
      ]
    }),
  mapGenres: () =>
    Promise.resolve([
      {
        id: 1,
        title: 'Nice Movie',
        poster_path: '/path.jpg',
        adult: false,
        genres: ['Fantasy']
      }
    ]),
  getGenresStrings: () => Promise.resolve(['Fantasy']),
  getHeroImage: () => Promise.resolve('/path.jpg')
}));

jest.mock('react-router-dom', () => ({
  Link: props => {
    return (
      <a>
        {props.children}
      </a>
    );
  }
}));

let wrapper;
describe('<MainMovie/> tests', () => {
  beforeEach(() => {
    wrapper = mount(<Main />);
  });

  it('should have MainMovie, SearchForm and Results components', () => {
    expect(wrapper.find(MainMovie).length).toBe(1);
    expect(wrapper.find(SearchForm).length).toBe(1);
    expect(wrapper.find(Results).length).toBe(1);
  });

  it('should fetch data and update the state', () => {
    expect(wrapper.state()).toEqual({
      nowPlaying: [
        {
          id: 1,
          title: 'Nice Movie',
          poster_path: '/path.jpg',
          adult: false,
          genres: ['Fantasy']
        }
      ],
      mainMovie: {
        id: 1,
        title: 'Nice Movie',
        poster_path: '/path.jpg',
        adult: false,
        genres: ['Fantasy'],
        heroImage: '/path.jpg'
      },
      searchResults: [],
      searchWord: ''
    });
  });

  it('should update the state when the user searches for a movie', done => {
    const res = wrapper
      .instance()
      .setSearchResults({ searchWord: 'Test', searchResults: [] });
    res.then(() => {
      expect(wrapper.state().searchWord).toEqual('Test');
      done();
    });
  });
});
