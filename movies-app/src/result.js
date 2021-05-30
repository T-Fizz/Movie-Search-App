class Result {
    //search result info
    Title;
    Year;
    imdbID;
    Poster;

    //more detailed info
    Released;
    Runtime;
    Genre;
    Director;

    constructor(jsonFromSearch) {
        //parse json and fill fields
        this.Title = jsonFromSearch.Title;
        this.Year = jsonFromSearch.Year;
        this.imdbID = jsonFromSearch.imdbID;
        this.Poster = jsonFromSearch.Poster;
    }

    // gets more details by making a different api call using imdbID
    getMoreDetailedInfo() {
        var jsonFromAPI = fetch(`http://www.omdbapi.com/?i=${this.imdbID}&apikey=dc24cbd7`);
        console.log(jsonFromAPI);
        this.Released = jsonFromAPI.Released;
        this.Runtime = jsonFromAPI.Runtime;
        this.Genre = jsonFromAPI.Genre;
        this.Director = jsonFromAPI.Director;
        return this;
    }
}