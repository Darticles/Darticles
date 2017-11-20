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
            document.location="/portfolio"
        }
    }

    render() {
        const { image } = this.state

        return (
            <div className="App">
                <NavigationBar/>
                <main className="container">
                    <h1>Add new artwork</h1>
                    <ImageDropzone onImageSelected={this.onImageSelected.bind(this)} image={image}/>
                    <button style={{marginTop: "1.2em"}} onClick={this.onSubmitPressed.bind(this)}>Submit</button>
                </main>
            </div>
        )
    }

}