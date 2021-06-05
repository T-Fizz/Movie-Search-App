import React from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import PlaceholderImage from './img-placeholder.png';
import ExampleMovies from './example-movies.json'
import './style1.css';

const EXAMPLE_MOVIES = ExampleMovies.movies;
const BASE_API_URI = 'https://www.omdbapi.com/?apikey=dc24cbd7&type=movie';

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchBarContainerClassName: 'search-bar-container',
            isEmpty: true,
            queryURI: '',
            isSubmitted: false
        };

        let randomMovieIndex = Math.floor(Math.random() * EXAMPLE_MOVIES.length);

        this.exampleMovie = EXAMPLE_MOVIES[randomMovieIndex];

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <div className={this.state.searchBarContainerClassName}>
                <div className='search-bar'>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor='search-query'>
                            Movie Search
                        </label>
                        <br>
                        </br>
                        <input
                            placeholder={this.exampleMovie}
                            onChange={this.handleChange}
                            value={this.state.query}
                        />
                        <button>
                            Search
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    //user typing updates query params for api
    handleChange(event) {
        let quri = BASE_API_URI
            + '&s=' + event.target.value.trim().split(' ').join('+')
            + "&page=1";

        this.setState({
            isEmpty: event.target.value.trim().length === 0,
            queryURI: quri
        });
    }

    //request on submit
    handleSubmit(event) {
        event.preventDefault();
        const searchURI = this.state.queryURI;

        //get JSON from api using searchURI, parse and fill
        if (!this.state.isEmpty && this.props.onSubmit) {
            this.props.onSubmit(searchURI);
            console.log('passed uri using props function');
            this.setState({
                searchBarContainerClassName: 'search-bar-container-with-results'
            });
        }
        console.log(searchURI);
    }
}

class Result extends React.Component {
    constructor(props) {
        super(props);
        this.titleStyles = ["result-title-no-details", "result-title-no-details-hovering"]

        this.state = {
            wasClicked: false,
            titleStyle: 0  //for tracking style of title when hovering
        };
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
        this.handleOnMouseOut = this.handleOnMouseOut.bind(this);
    }

    handleOnClick(event) {
        event.preventDefault();
        this.setState({
            wasClicked: true
        });
    }

    handleOnMouseOver(event) {
        this.setState({
            titleStyle: 1
        });
    }

    handleOnMouseOut(event) {
        this.setState({
            titleStyle: 0
        });
    }

    render() {
        let resultHTML = (
            <div className="result-no-details-container">
                <div
                    className="result-no-details"
                    onClick={this.handleOnClick}
                >
                    <div className="result-title-no-details-container">
                        <button
                            className={this.titleStyles[this.state.titleStyle]}
                            onMouseOver={this.handleOnMouseOver}
                            onMouseOut={this.handleOnMouseOut}
                        >
                            {this.props.title}
                        </button>
                    </div>
                    <div className="result-info-no-details-container">
                        <p className="result-info-no-details">
                            ({this.props.year})
                        </p>
                    </div>
                </div>
            </div>
        );

        if (this.state.wasClicked === true) {
            //was clicked, create details component and show details
            resultHTML = (
                <div className='result' onClick={this.handleOnClick}>
                    <div className='result-info'>
                        <div className='result-title-container'>
                            <div className='result-title'>
                                <p>{this.props.title}</p>
                            </div>
                            <div className='result-year'>
                                <p>({this.props.year})</p>
                            </div>
                        </div>
                        {
                            //create Details Component once clicked
                            this.state.wasClicked
                            &&
                            <Details
                                img={this.props.img}
                                title={this.props.title}
                                type={this.props.type}
                                year={this.props.year}
                                imdbID={this.props.imdbID}
                            />
                        }
                    </div>
                    <div className='result-img-container'>
                        {(this.props.img === 'N/A') ? (
                            <img
                                className='result-img'
                                src={PlaceholderImage}
                                alt='Movie Poster PlaceHolder'
                            />
                        ) : (
                            <img
                                className='result-img'
                                src={this.props.img}
                                alt='Movie Poster'
                            />
                        )}
                    </div>
                </div>
            );
        }

        return (
            resultHTML
        );
    }
}

class ResultsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultsURI: '',
            currentPage: 1,
            showMorePageIterator: 0, //page offset from initial after showing 
            fulfilled: false,                                   //more results
            status: null,  // 'true' or 'false' for results of api fetch
            results: [],
            totalResults: 0
        }
    }

    goToPage(data) {
        console.log(data);
        let selected = data.selected + 1;
        console.log('gotopage' + this.state.resultsURI);

        let baseURI = this.state.resultsURI.split('&page=')[0];
        let pageParam = `&page=${selected}`;
        let pageURI = baseURI + pageParam;
        console.log('pageURI' + pageURI);

        this.setState({
            currentPage: selected,
            results: []     //result list (show as new page)
        });

        console.log(pageURI);
        this.getResults(pageURI);
    }

    getResults(URI) {
        console.log('getting results for list');
        console.log(URI);
        fetch(URI)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (data.Response === 'False') {
                    this.setState({
                        fulfilled: false,
                        status: data.Error,
                        totalResults: 0,
                    });
                } else {
                    this.setState({
                        fulfilled: true,
                        status: 'Showing Results:',
                        results: this.state.results.concat(data.Search),
                        totalResults: data.totalResults,
                        resultsURI: URI
                    });
                }
            },
                (error) => {
                    console.log(error)
                }
            );
    }

    onResults() {
        if (this.state.fulfilled && this.props.onResults) {
            this.props.onResults(this.state.fulfilled);
            console.log('Changed CSS file!');
        }
    }

    showMore() {
        console.log("Showing more");
        console.log(this.state);
        //will concatenate results list without resetting like this.goToPage()
        console.log(this.state.resultsURI);


        let pagesFromCurrent = this.state.showMorePageIterator + 1
        this.setState({
            showMorePageIterator: pagesFromCurrent
        })

        console.log(pagesFromCurrent + ":" + this.state.showMorePageIterator);

        let baseURI = this.state.resultsURI.split('&page=')[0];
        let pageParam = "&page=" + this.state.currentPage + this.state.showMorePageIterator;
        let pageURI = baseURI + pageParam;
        console.log(pageURI);
        this.getResults(pageURI);
    }

    render() {
        return (
            <div>
                <div className='search-header'>
                    <Search
                        onSubmit={queryURI => this.getResults(queryURI)}
                    />
                    {this.state.fulfilled === true &&
                        <div className='paginate-container'>
                            <ReactPaginate
                                containerClassName='pagination'
                                pageCount={Math.ceil(this.state.totalResults / 10)}
                                pageRangeDisplayed={5}
                                marginPagesDisplayed={2}
                                onPageChange={this.goToPage}
                            />
                        </div>}
                </div>
                <div className='results-status-container'>
                    {this.state.fulfilled !== true && <h3 className='results-status'>{this.state.status}</h3>}
                </div>
                {(this.state.fulfilled === true) && (
                    this.state.results.map((result) => (
                        <div key={result.imdbID}>
                            <Result
                                img={result.Poster}
                                title={result.Title}
                                type={result.Type}
                                year={result.Year}
                                imdbID={result.imdbID}
                            />
                        </div>
                    ))
                )}
                {(this.state.fulfilled === true) && (
                    <ShowMore
                        onClick={this.showMore.bind(this)}
                        pagesRemaining={
                            Math.ceil(this.state.totalResults / 10) - this.state.currentPage
                        }
                    />
                )}
                {this.state.fulfilled === true &&
                    <div className='paginate-container'>
                        <ReactPaginate
                            containerClassName='pagination'
                            pageCount={Math.ceil(this.state.totalResults / 10)}
                            pageRangeDisplayed={5}
                            marginPagesDisplayed={2}
                            onPageChange={this.goToPage}
                        />
                    </div>}

            </div>
        );
    }
}

class Details extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            status: 'false',    // 'false', 'loading', or 'true'
            data: {}
        });

        //get details upon construction (when parent is clicked)
        this.fetchAdditionalDetails();
    }

    fetchAdditionalDetails() {
        console.log('getting details for ' + this.props.title);
        fetch(BASE_API_URI + '&i=' + this.props.imdbID)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (data.Response === 'false') {
                    this.setState({
                        status: 'error',
                        details: {}
                    })
                } else {
                    this.setState({
                        status: 'loading',
                        details: data
                    })
                    //format values to user friendly formats
                    this.updateValuesToDisplay();
                    console.log('Details Obtained ' + Date.now());
                }
            },
                (error) => {
                    console.log(error)
                }
            );
    }

    updateValuesToDisplay() {
        //setup date fetched from api for locale of user 
        let data = this.state.details;

        console.log(this.state.details);
        if (this.state.details === undefined) {
            console.error('DETAILS IS UNDEFINED!');
        } else {
            if (this.state.details.Released !== 'N/A') {
                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                var dateSplit = this.state.details.Released.split(' ');
                var day = dateSplit[0];
                console.log(dateSplit);
                var month = (months.indexOf(dateSplit[1]) + 1 >= 10) ? (months.indexOf(dateSplit[1])) : ('0' + months.indexOf(dateSplit[1]));
                var year = dateSplit[2];
                var date = new Date(`${year}-${month}-${day}`);
            }

            //handle any missing info from api "N/A"
            console.log('r: ' + this.state.details.Released);
            data.Plot = this.state.details.Plot !== 'N/A' ? this.state.details.Plot : '';
            data.Actors = this.state.details.Actors !== 'N/A' ? this.state.details.Actors : '--';
            data.Production = this.state.details.Production !== 'N/A' ? this.state.details.Production : '--';
            data.imdbRating = this.state.details.imdbRating !== 'N/A' ? this.state.details.imdbRating : '--';
            data.Genre = this.state.details.Genre !== 'N/A' ? this.state.details.Genre : '--';
            data.Rated = this.state.details.Rated !== 'N/A' ? this.state.details.Rated : '--';
            data.Runtime = this.state.details.Runtime !== 'N/A' ? this.state.details.Runtime : '--';
            data.Country = this.state.details.Country !== 'N/A' ? this.state.details.Country : '--';
            data.Language = this.state.details.Language !== 'N/A' ? this.state.details.Language : '--';
            data.Released = this.state.details.Released !== 'N/A' ? date.toLocaleDateString() : '--';

            this.setState({
                status: 'true',
                details: data
            });
        }
    }

    render() {
        console.log('details render');
        let detailHTML;

        //successful fetch of details, show them
        if (this.state.status === 'true') {
            detailHTML = (
                <div className='details-container'>
                    <div className='details-top'>
                        <p className='plot' id='plot'>
                            {this.state.details.Plot}
                        </p>
                    </div>
                    <div className='details-bottom'>
                        <ul className='details-list'>
                            <li><p className='detail-label'>Actors: </p><p>{this.state.details.Actors}</p></li>
                            <li><p className='detail-label'>Studios: </p><p>{this.state.details.Production}</p></li>
                            <li><p className='detail-label'>Premiered: </p><p>{this.state.details.Released}</p></li>
                            <li><p className='detail-label'>IMDB Rating: </p><p>{this.state.details.imdbRating}</p></li>
                            <li><p className='detail-label'>Genre: </p><p>{this.state.details.Genre}</p></li>
                            <li><p className='detail-label'>Rating: </p><p>{this.state.details.Rated}</p></li>
                            <li><p className='detail-label'>Length: </p><p>{this.state.details.Runtime}</p></li>
                            <li><p className='detail-label'>Country: </p><p>{this.state.details.Country}</p></li>
                            <li><p className='detail-label'>Language: </p><p>{this.state.details.Language}</p></li>
                        </ul>
                    </div>
                </div>
            );
        } else if ('loading') {
            detailHTML = (
                <div className='details-container'>
                    <p className='details-loading'>
                        Fetching details...
                    </p>
                </div>
            );
        } else {    //error
            detailHTML = (
                <div className='details-container'>
                    <p className='details-error'>
                        Something went wrong!
                    </p>
                </div>
            );
        }

        return detailHTML;
    }
}

class ShowMore extends React.Component {
    constructor(props) {
        super(props);
        this.buttonStyles = ["show-more", "show-more-hovering"];

        this.state = {
            pagesRemaining: this.props.pagesRemaining,
            buttonStyle: 0
        };
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
        this.handleOnMouseOut = this.handleOnMouseOut.bind(this);
    }

    handleOnClick(event) {
        if (this.props.onClick) {
            this.props.onClick(event);
        }
    }

    handleOnMouseOver(event) {
        this.setState({
            buttonStyle: 1
        });
    }

    handleOnMouseOut(event) {
        this.setState({
            buttonStyle: 0
        });
    }


    render() {
        return (
            <div className="show-more-container">
                <button className={this.buttonStyles[this.state.buttonStyle]} id="show-more"
                    onClick={this.handleOnClick}
                    onMouseOver={this.handleOnMouseOver}
                    onMouseOut={this.handleOnMouseOut}
                >
                    🠗 Show More Results 🠗
                </button>
            </div>
        )
    }
}

function SearchApp() {
    return (
        <div>
            <ResultsList >
            </ResultsList>
        </div>
    );
}


ReactDOM.render(<SearchApp />, document.getElementById('root'));
