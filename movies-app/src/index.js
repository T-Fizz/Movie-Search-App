import React from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import Style from './index.css';
import PlaceholderImage from './img-placeholder.png';


const BASE_API_URI = "http://www.omdbapi.com/?apikey=dc24cbd7";

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isEmpty: true,
            queryURI: '',
            isSubmitted: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <div id="search-bar">
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="search-query">
                        What movie title are you looking for?
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

    fetchAdditionalDetails() {
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
                <div className="result-img">
                    {(this.props.img === "N/A") ? (
                        <img src={PlaceholderImage} alt="Movie Poster PlaceHolder" />
                    ) : (
                        <img src={this.props.img} alt="Movie Poster" />
                    )}
                </div>
                <div className="result-title">
                    <h3>Title: {this.props.title}</h3>
                </div>
                {(this.state.detailsFulfilled !== true) ? (
                    <div className="result-details">
                        <p>
                            Year: {this.props.year}
                            <br></br>
                            <button onClick={this.handleOnClick}>
                                (click to show more)
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
        );
    }
}

class ResultsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fulfilled: false,
            status: null,
            results: [],
        }
    }

    getResults(URI) {
        console.log("getting results for list");
        fetch(URI)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (data.Response === "False") {
                    this.setState({
                        fulfilled: false,
                        status: data.Error,
                        results: []
                    })
                } else {
                    this.setState({
                        fulfilled: true,
                        status: "Showing Results:",
                        results: data.Search
                    })
                }
            },
                (error) => {
                    console.log(error)
                }
            );
    }

    render() {
        return (
            <div>
                <Search
                    onSubmit={queryURI => this.getResults(queryURI)}
                />
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
                    )
                    )
                )}
            </div>
        );
    }
}

class SearchApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0,
            results: [{
                "0": [
                    "result1",
                    "result2",
                    "etc.",
                    "Search arr goes in place of this arr for a given page"
                ]
            }]
            //map page to results, "page#" : [arr of results on pg] 
        }
    }

    render() {
        return (
            <div>
                <ResultsList>
                </ResultsList>
            </div>
        );
    }
}

ReactDOM.render(<SearchApp />, document.getElementById("root"));
