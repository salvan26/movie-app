import React from 'react';
import { Input } from 'antd';
import debounce from 'lodash.debounce';

import './input-search.css';

class InputSearch extends React.Component {
  handleChange = debounce((event) => {
    const { onChange } = this.props;
    onChange(event.target.value);
  }, 800);

  render() {
    return <Input placeholder="Type to search..." size="large" onChange={this.handleChange} />;
  }
}

export default InputSearch;
