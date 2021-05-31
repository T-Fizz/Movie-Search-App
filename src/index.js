import React from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import PlaceholderImage from './img-placeholder.png';
import './style1.css';
import './style2.css';

const BASE_API_URI = "https://www.omdbapi.com/?apikey=dc24cbd7";

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchBarContainerClassName: "search-bar-container",
            isEmpty: true,
            queryURI: '',
            isSubmitted: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <div className={this.state.searchBarContainerClassName}>
                <div className="search-bar">
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="search-query">
                            Movie Search
                        </label>
                        <br>
                        </br>
                        <input
                            placeholder="The Wizard of Oz"
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

    handleChange(event) {
        this.setState({
            isEmpty: event.target.value.trim().length === 0,
            queryURI: BASE_API_URI + "&s=" + event.target.value.split(' ').join('+')
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const searchURI = this.state.queryURI;

        //get JSON from api using searchURI, parse and fill
        if (!this.state.isEmpty && this.props.onSubmit) {
            this.props.onSubmit(searchURI);
            console.log("passed uri using props function");
            this.setState({
                searchBarContainerClassName: "search-bar-container-with-results"
            })
        }
        console.log(searchURI);
    }
}

class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wasClicked: false,
            details: {},
            detailsFulfilled: false
        }
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    fetchAdditionalDetails = () => {
        console.log("getting details for " + this.props.title);
        fetch(BASE_API_URI + "&i=" + this.props.imdbID)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (data.Response === "False") {
                    this.setState({
                        detailsFulfilled: false,
                        details: {}
                    })
                } else {
                    this.setState({
                        detailsFulfilled: true,
                        details: data
                    })
                }
            },
                (error) => {
                    console.log(error)
                }
            );
    }

    handleOnClick(event) {
        event.preventDefault();
        this.fetchAdditionalDetails();
        this.setState({
            wasClicked: true
        })
    }

    render() {
        return (
            <div className="result">
                <div className="result-info">
                    <div className="result-title">
                        <p>{this.props.title}</p>
                    </div>
                    {(this.state.detailsFulfilled !== true) ? (
                        <div className="result-details">
                            <p>
                                Year: {this.props.year}
                                <br></br>
                                <button onClick={this.handleOnClick}>
                                    click for more info
                                </button>
                            </p>
                        </div>
                    ) : (
                        <div className="result-details">
                            <p>
                                Year: {this.props.year}
                                <br></br>
                                Released: {this.state.details.Released}
                                <br></br>
                                Rated: {this.state.details.Rated}
                                <br></br>
                                Genre: {this.state.details.Genre}
                            </p>
                        </div>
                    )}
                </div>
                <div className="result-img-container">
                    {(this.props.img === "N/A") ? (
                        <img className="result-img" src={PlaceholderImage} alt="Movie Poster PlaceHolder" />
                    ) : (
                        <img className="result-img" src={this.props.img} alt="Movie Poster" />
                    )}
                </div>
            </div>
        );
    }
}

class ResultsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultsURI: "",
            currentPage: 1,
            fulfilled: false,
            status: null,
            results: [],
            totalResults: 0
        }
    }



    goToPage = (data) => {
        console.log(data);
        var selected = data.selected + 1;

        var baseURI = JSON.parse(this.state.resultsURI).split("&page=")[0];
        var pageParam = `&page=${selected}`;
        var pageURI = baseURI + pageParam;

        this.setState({
            currentPage: selected
        })

        console.log(pageURI);
        this.getResults(pageURI);
    }

    getResults(URI) {
        console.log("getting results for list");
        console.log(URI);
        fetch(URI)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (data.Response === "False") {
                    this.setState({
                        fulfilled: false,
                        status: data.Error,
                        results: [],
                        totalResults: 0,
                    })
                } else {
                    this.setState({
                        fulfilled: true,
                        status: "Showing Results:",
                        results: data.Search,
                        totalResults: data.totalResults,
                        resultsURI: JSON.stringify(URI)
                    })
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
            console.log("Changed CSS file!");
        }
    }

    render() {
        return (
            <div>
                <div className="search-header">
                    <Search
                        onSubmit={queryURI => this.getResults(queryURI)}
                    />
                    {this.state.fulfilled === true &&
                        <div className="paginate-container">
                            <ReactPaginate
                                containerClassName="pagination"
                                pageCount={Math.ceil(this.state.totalResults / 10)}
                                pageRangeDisplayed={5}
                                marginPagesDisplayed={2}
                                onPageChange={this.goToPage}
                            />
                        </div>}
                </div>
                <h4>{this.state.status}</h4>
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
            </div>
        );
    }
}

class SearchApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stylePath: "./style1.css"
        }
        //map page to results, "page#" : [arr of results on pg] 
        this.handleStyleChange = this.handleStyleChange.bind(this);
    }

    //style changes when results are received
    handleStyleChange(hasReceivedResults) {
        if (hasReceivedResults === true) {
            this.setState({
                stylePath: "./style1.css"
            })
        } else {
            this.setState({
                stylePath: "./style2.css"
            })
        }
    }

    render() {
        return (
            <div>
                <link rel="stylesheet" href={this.state.stylePath} />
                <ResultsList onResults={isLandingPage => this.handleStyleChange(isLandingPage)}>
                </ResultsList>
            </div>
        );
    }
}

ReactDOM.render(<SearchApp />, document.getElementById("root"));
