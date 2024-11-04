import React from 'react';
import { Pagination } from 'antd';

class PaginationList extends React.Component {
  handleChangeSearch = (page) => {
    const { getPageSearch } = this.props;
    getPageSearch(page);
    window.scrollTo(0, 0);
  };

  handleChangeRated = (page) => {
    const { getPageRated } = this.props;
    getPageRated(page);
    window.scrollTo(0, 0);
  };

  render() {
    const { totalMovies, isSearching, currentPage } = this.props;
    return (
      <div className="pagination-section">
        <Pagination
          align="center"
          pageSize={20}
          current={currentPage}
          total={totalMovies}
          showSizeChanger={false}
          onChange={isSearching ? this.handleChangeSearch : this.handleChangeRated}
        />
      </div>
    );
  }
}

export default PaginationList;
