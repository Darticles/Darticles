import React, { Component } from 'react'
import NavigationBar from '../NavigationBar/NavigationBar'
import ImageDropzone from '../../Components/ImageDropzone'

// CSS Styles
import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import '../css/root.css'

export default class Profile extends Component {

    constructor(props) {
        super(props)

        this.state = {
            image: undefined
        }
    }

    onImageSelected(image) {
        this.setState({
            ...this.state,
            image
        })
    }

    onSubmitPressed() {

    }

    render() {
        const { image } = this.state

        return (
            <div className="App">
                <NavigationBar/>
                <main className="container">
                    <div className="pure-u-1-5"></div>
                    <div className="pure-u-3-5 pure-form">
                        <h1>Profile</h1>
                        <ImageDropzone onImageSelected={this.onImageSelected.bind(this)} image={image}/>
                        <input style={{marginTop: "10px"}}className="full-width" placeholder="First Name"/>
                        <input style={{marginTop: "10px"}} className="full-width" placeholder="Last Name"/>
                        <input style={{marginTop: "10px"}} className="full-width" placeholder="Nickname"/>
                        <button className="pure-button pure-button-primary" style={{marginTop: "1.2em"}} onClick={this.onSubmitPressed.bind(this)}>Submit</button>
                    </div>
                    <div className="pure-u-1-5"></div>
                </main>
            </div>
        )    
    }
}