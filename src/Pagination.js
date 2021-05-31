import React from 'react';
import PropTypes from 'prop-types';

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            totalRecords: 0
        };
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    fetchPageResults(pageNum) {

    }

    handleOnClick(event) {

    }

    render() {
        return (
            <div>

            </div>
        );
    }
}

Pagination.propTypes = {
    totalRecords: PropTypes.number,
    pageLimit: PropTypes.number,
    pageNeighbors: PropTypes.number,
    onPageChanged: PropTypes.func
};

export default Pagination;