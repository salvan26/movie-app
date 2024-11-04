import React from 'react';
import { debounce } from 'lodash';

import MovieList from '../movie-item-list';
import InputSearch from '../input-search';
import Loader from '../loader';
import ErrorCheck from '../error-check';
import MovieApiServices from '../../services/movie-api';
import PaginationList from '../pagination';
import { MovieProvider } from '../context/context';
import Tab from '../tab';
import './app.css';

class App extends React.Component {
  movieApiServices = new MovieApiServices();

  state = {
    movieList: [],
    genresList: [],
    ratedMovies: {},
    inputValue: '',
    isLoading: false,
    isError: false,
    totalMovies: null,
    isInitialLoad: true,
    guestSessionId: null,
    isSearching: true,
    currentPage: undefined,
    windowWidth: window.innerWidth,
  };

  componentDidMount() {
    this.getGuestSessionId();
    this.getMoviesGenres();
  }

  handleResize = debounce(() => {
    this.setState(() => ({
      windowWidth: window.innerWidth,
    }));
  }, 100);

  componentDidUpdate(prevProps, prevState) {
    const { inputValue } = this.state;
    if (inputValue !== prevState.inputValue) {
      this.setState({ isLoading: true });
      this.getMovieInfo();
    }
    window.addEventListener('resize', this.handleResize);
  }

  getGuestSessionId = () => {
    const url = 'authentication/guest_session/new';
    this.movieApiServices.createGuestSession(url).then((data) => {
      const { guest_session_id } = data;
      this.setState({
        guestSessionId: guest_session_id,
      });
    });
  };

  getInputValue = (e) => {
    this.setState(() => ({
      inputValue: e.trim(),
    }));
  };

  onError = () => {
    this.setState({
      isLoading: false,
      isError: true,
    });
  };

  getMovieInfo = (page = 1) => {
    const { inputValue } = this.state;
    const url = `search/movie?query=${inputValue}&include_adult=false&language=en-US&page=${page}`;
    this.movieApiServices
      .getMovie(url)
      .then((movies) => {
        const { results, total_results } = movies;
        this.setState(() => ({
          movieList: results,
          isLoading: false,
          isError: false,
          totalMovies: total_results,
          isInitialLoad: false,
          isSearching: true,
          currentPage: page,
        }));
      })
      .catch(() => this.onError());
  };

  getMoviesGenres = () => {
    this.movieApiServices
      .getGenres()
      .then((genre) => {
        const { genres } = genre;
        const transformedGenres = {};
        genres.forEach((item) => {
          transformedGenres[item.id] = item.name;
        });
        this.setState(() => ({
          genresList: transformedGenres,
        }));
      })
      .catch(() => this.onError());
  };

  rateMovie = (value, id) => {
    const { guestSessionId } = this.state;
    this.movieApiServices.postRate(value, id, guestSessionId);
    this.setState(({ movieList, ratedMovies }) => {
      const filteredMovie = movieList.filter((movie) => movie.id === id);
      const [currentMovie] = filteredMovie;
      const movie = {
        ...ratedMovies,
        [currentMovie.id]: value,
      };
      return {
        ratedMovies: movie,
      };
    });
  };

  getRatedMovieList = (page = 1) => {
    const { guestSessionId } = this.state;
    const url = `guest_session/${guestSessionId}/rated/movies?language=en-US&page=${page}&sort_by=created_at.asc`;
    this.movieApiServices
      .getRatedMovies(url)
      .then((movies) => {
        const { results, total_results } = movies;
        this.setState(() => ({
          movieList: results,
          isLoading: false,
          isError: false,
          totalMovies: total_results,
          isInitialLoad: false,
          isSearching: false,
          currentPage: page,
        }));
      })
      .catch(() => this.onError());
  };

  render() {
    const {
      movieList,
      genresList,
      ratedMovies,
      isLoading,
      isError,
      inputValue,
      totalMovies,
      isInitialLoad,
      isSearching,
      currentPage,
      windowWidth,
    } = this.state;
    const errorAlert = isError && !isLoading ? <ErrorCheck /> : null;
    const searching = isSearching ? <InputSearch value={inputValue} onChange={this.getInputValue} /> : null;
    const pages =
      !isLoading && !isError && totalMovies ? (
        <PaginationList
          currentPage={currentPage}
          isSearching={isSearching}
          totalMovies={totalMovies}
          getPageSearch={this.getMovieInfo}
          getPageRated={this.getRatedMovieList}
        />
      ) : null;
    const movieItem =
      !isLoading && !isError ? (
        <MovieList
          movieList={movieList}
          genresList={genresList}
          ratedMovies={ratedMovies}
          value={inputValue}
          isInitial={isInitialLoad}
          onRate={this.rateMovie}
          innerWidth={windowWidth}
          isLoading={isLoading}
        />
      ) : null;
    return (
      <section className="app">
        <MovieProvider value={genresList}>
          <div>
            <section className="tab-section">
              <Tab getRated={this.getRatedMovieList} getSearch={this.getMovieInfo} />
            </section>
            <section className="input-search-section">{searching}</section>
            <section className="movie-list-section">
              {movieItem}
              {isLoading && <Loader />}
              {errorAlert}
            </section>
          </div>
          <section className="pagination-section">{pages}</section>
        </MovieProvider>
      </section>
    );
  }
}

export default App;
