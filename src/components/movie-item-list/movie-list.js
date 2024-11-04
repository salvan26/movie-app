import React from 'react';
import { List } from 'antd';

import MovieItem from '../movie-item/movie-item';
import MovieItemMob from '../movie-item-mob';
import ErrorEmpty from '../error-empty';
import { MovieConsumer } from '../context';
import './movie-list.css';

export default class MovieList extends React.Component {
  render() {
    const { movieList, ratedMovies, isInitial, onRate, innerWidth } = this.props;
    const emptyAlert = isInitial || movieList.length !== 0 ? null : <ErrorEmpty />;
    const movies =
      movieList.length !== 0 && innerWidth <= 980 ? (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 1,
            lg: 1,
            xl: 1,
            xxl: 1,
          }}
          dataSource={movieList}
          renderItem={(item) => (
            <List.Item>
              <MovieConsumer>
                {(genresList) => (
                  <MovieItemMob item={item} ratedMovies={ratedMovies} genres={genresList} onRate={onRate} />
                )}
              </MovieConsumer>
            </List.Item>
          )}
          empty={<div />}
        />
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 2,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2,
            xxl: 2,
          }}
          dataSource={movieList}
          renderItem={(item) => (
            <List.Item>
              <MovieConsumer>
                {(genresList) => (
                  <MovieItem item={item} ratedMovies={ratedMovies} genres={genresList} onRate={onRate} />
                )}
              </MovieConsumer>
            </List.Item>
          )}
        />
      );
    return (
      <div className="movie-list-container">
        {movies}
        {emptyAlert}
      </div>
    );
  }
}
