import React from 'react';
import { Rate } from 'antd';

export default class Rating extends React.Component {
  handleChange = (value) => {
    const { onRate, id } = this.props;
    onRate(value, id);
  };

  render() {
    const { rate } = this.props;
    return <Rate count={10} allowHalf className="movie-card__stars" onChange={this.handleChange} value={rate} />;
  }
}
