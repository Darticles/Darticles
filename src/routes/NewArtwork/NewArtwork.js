// Libraries
import React, { Component } from 'react'
import classnames from 'classnames'

// Components
import NavigationBar from '../NavigationBar/NavigationBar'
import ImageDropzone from '../../Components/ImageDropzone'

// CSS Styles
import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import '../css/root.css'
import './css/NewArtwork.css'

var axios = require('axios');

export default class NewArtwork extends Component {

    constructor(props) {
        super(props)

        this.state = {
            image: undefined
        }
    }

    componentWillMount() {

    }

    onImageSelected(image) {
        this.setState({
            ...this.state,
            image
        })
    }

    onSubmitPressed() {
        // TODO: Add logic to upload image
        // And then go back to porfolio
        if(this.state.image) {
            // document.location="/portfolio"
            // axios.post('http://localhost:3000/files', {
            //     file: this.state.image
            //   })
            //   .then(function (response) {
            //     console.log(response);
            //   })
            //   .catch(function (error) {
            //     console.log(error);
            //   });      
        }
    }

    render() {
        const { image } = this.state

        return (
            <div className="App">
                <NavigationBar/>
                <main className="container">
                <h1>Add new artwork</h1>
                <div className="pure-g">
                    <div className="pure-u-1-5"></div>
                    <div className="pure-u-3-5 pure-form">
                                {/* <legend>A compact inline form</legend> */}

                                <p><input className="full-width" placeholder="Title"/></p>
                                <p><ImageDropzone onImageSelected={this.onImageSelected.bind(this)} image={image}/></p>
                                <textarea className="full-width" rows="4" cols="50" placeholder="Description">
                                </textarea> 
                                {/* <p><input className="full-width" placeholder="Description"/></p> */}

                                <p><button className="pure-button pure-button-primary" style={{marginTop: "1.2em"}} onClick={this.onSubmitPressed.bind(this)}>Submit</button></p>
                    </div>
                    <div className="pure-u-1-5"></div>
                </div>

                </main>
            </div>
        )
    }

}