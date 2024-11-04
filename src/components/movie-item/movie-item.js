import { Card, Space, Typography, Badge } from 'antd';
import React from 'react';
import './movie-item.css';
import { format } from 'date-fns';
import { nanoid } from 'nanoid';

import Rating from '../rated';

const { Title, Text } = Typography;

export default class MovieItem extends React.Component {
  stylesCard = {
    body: {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      padding: 0,
      overflow: 'hidden',
    },
  };

  stylesSpace = {
    item: {
      width: '100%',
      height: '100%',
      padding: '0px',
      margin: '0px',
    },
  };

  rateStyles = {
    base: 'movie-item__rate',
    lowest: 'movie-item__rate--lowest',
    low: 'movie-item__rate--low',
    middle: 'movie-item__rate--middle',
    high: 'movie-item__rate--high',
    highest: 'movie-item__rate--highest',
  };

  getDateFormat = () => {
    const { item } = this.props;
    const numberedDatesArr = item.release_date
      .split('-')
      .map((date) => Number(date))
      .join(' ');
    const formatDate = format(new Date(numberedDatesArr), 'MMMM dd, uuuu');
    return formatDate;
  };

  getGenresNames = () => {
    const { item, genres } = this.props;
    const genreNames = item.genre_ids.map((id) => genres[id]);
    return genreNames;
  };

  getClasses = () => {
    const { item } = this.props;
    let rateClass = '';
    if (item.vote_average < 3) {
      rateClass = `${this.rateStyles.base} ${this.rateStyles.lowest}`;
    } else if (item.vote_average >= 3 && item.vote_average < 5) {
      rateClass = `${this.rateStyles.base} ${this.rateStyles.low}`;
    } else if (item.vote_average >= 5 && item.vote_average < 7) {
      rateClass = `${this.rateStyles.base} ${this.rateStyles.middle}`;
    } else if (item.vote_average >= 7 && item.vote_average < 10) {
      rateClass = `${this.rateStyles.base} ${this.rateStyles.high}`;
    } else {
      rateClass = `${this.rateStyles.base} ${this.rateStyles.highest}`;
    }
    return rateClass;
  };

  getCuttedDescription = () => {
    const { item } = this.props;
    const cuttedOverview = item.overview.split('');
    if (item.overview.length >= 100) {
      const newOverview = `${cuttedOverview.slice(0, 100).join('')}...`;
      return newOverview;
    }
    return item.overview;
  };

  render() {
    const { item, onRate, ratedMovies } = this.props;
    const formatDate = this.getDateFormat();
    const genresCollection = this.getGenresNames().map((genre) => (
      <Badge key={nanoid()} count={genre} color="#D3D3D3" />
    ));
    const { vote_average, id } = item;
    const overview = this.getCuttedDescription();
    const myRaiting = ratedMovies[item.id] ?? 0;
    const rateClass = this.getClasses();
    return (
      <Card hoverable className="movie-item" styles={this.stylesCard}>
        <Space direction="horizontal" styles={this.stylesSpace}>
          <img
            className="movie-item__poster"
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt="movie net"
          />
          <Space direction="vertical" className="movie-item__second-space" styles={this.stylesSpace}>
            <section className="movie-item__main-info">
              <div className="movie-item__title">
                <Title level={4} className="movie-item__name">
                  {item.title}
                </Title>
                <div className={rateClass}>
                  {vote_average === 10 ? vote_average.toFixed(0) : vote_average.toFixed(1)}
                </div>
              </div>
              <Text type="secondary" className="movie-item__date">
                <strong />
                {formatDate}
              </Text>
              <p className="movie-item__genre">{genresCollection}</p>
              <Text className="movie-item__description">{overview}</Text>
              <Rating id={id} onRate={onRate} rate={myRaiting} />
            </section>
          </Space>
        </Space>
      </Card>
    );
  }
}
