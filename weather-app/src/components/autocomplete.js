import React, { Component, Fragment } from "react";
import axios from "axios";

const API_URL = 'https://www.metaweather.com/api/location/';

class Autocomplete extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // The active selection's index
            activeSuggestion: 0,
            // The suggestions that match the user's input
            Suggestions: [],
            // Whether or not the suggestion list is shown
            showSuggestions: false,
            // What the user has entered
            userInput: "",
            woeid: '',
            results: []
        };
    }

    getWeather = () => {
        if (this.state.woeid) {
            axios.get(`${API_URL}${this.state.woeid}/`)
                .then(data => {
                    this.setState({results: data.data.consolidated_weather})
                })
        }
    };

    // Event fired when the input value is changed
    onChange = e => {
        this.setState({userInput: e.target.value}, () => {
            axios.get(`${API_URL}search/?query=${this.state.userInput}`)
                .then(data => {
                    this.setState({
                        activeSuggestion: 0,
                        Suggestions: data.data.slice(0,7),
                        showSuggestions: true
                    })
                });
        })

    };

    // Event fired when the user clicks on a suggestion
    onClick = e => {
        // Update the user input and reset the rest of the state
        this.setState({
            activeSuggestion: 0,
            Suggestions: [],
            showSuggestions: false,
            userInput: e.currentTarget.innerText
        });
    };

    // Event fired when the user presses a key down
    onKeyDown = e => {
        const { activeSuggestion, Suggestions } = this.state;

        // User pressed the enter key, update the input and close the
        // suggestions
        if (e.keyCode === 13) {
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: Suggestions[activeSuggestion].title,
                woeid: Suggestions[activeSuggestion].woeid
            },
                this.getWeather);
        }
        // User pressed the up arrow, decrement the index
        else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
                return;
            }

            this.setState({ activeSuggestion: activeSuggestion - 1 });
        }
        // User pressed the down arrow, increment the index
        else if (e.keyCode === 40) {
            if (activeSuggestion - 1 === Suggestions.length) {
                return;
            }

            this.setState({ activeSuggestion: activeSuggestion + 1 });
        }
    };

    render() {
        const {
            onChange,
            onClick,
            onKeyDown,
            state: {
                activeSuggestion,
                Suggestions,
                showSuggestions,
                userInput,
                results
            }
        } = this;

        let suggestionsListComponent;

        if (showSuggestions && userInput) {
            if (Suggestions.length) {
                suggestionsListComponent = (
                    <ul className="suggestions">
                        {Suggestions.map((suggestion, index) => {
                            let className;

                            // Flag the active suggestion with a class
                            if (index === activeSuggestion) {
                                className = "suggestion-active";
                            }

                            return (
                                <li
                                    className={className}
                                    key={suggestion.woeid}
                                    onClick={onClick}
                                >
                                    {suggestion.title}
                                </li>
                            );
                        })}
                    </ul>
                );
            } else {
                suggestionsListComponent = (
                    <div className="no-suggestions">
                        <em>No suggestions, you're on your own!</em>
                    </div>
                );
            }
        }

        let resultsListComponent;

        if (results) {
            resultsListComponent = (
                <ul>
                    {results.map (weat => (
                        <li>{weat.applicable_date}: {weat.weather_state_name}</li>
                    ))}
                </ul>
            )
        }

        return (
            <Fragment>
                <input
                    type="text"
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={userInput}
                />
                {suggestionsListComponent}
                {resultsListComponent}
            </Fragment>
        );
    }
}

export default Autocomplete;