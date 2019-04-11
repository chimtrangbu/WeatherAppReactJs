import React, { Component } from 'react'
import axios from "axios"
import Suggestions from './suggestions'

const API_URL = 'https://www.metaweather.com/api/location/search/';

class Search extends Component {

    constructor(props){
        super(props);

        this.state = {
            query: '',
            results: []
        }
    }

    getInfo = () => {
        axios.get(`${API_URL}?query=${this.state.query}`)
            .then((data) => {
                this.setState({
                    results: data.data.slice(0,7)
                })
            })
    };

    handleInputChange = (event) => {
        this.setState({query: event.target.value}, () => {
            if (this.state.query.length >= 1) {
                this.getInfo();
            } else {
                this.setState({results: []})
            }
        })
    };

    render() {
        return (
            <form>
                <input
                    placeholder="Search for..."
                    value={this.state.query}
                    onChange={(event) => this.handleInputChange(event)}
                />
                <Suggestions results={this.state.results}/>
            </form>
        )
    }
}

export default Search
