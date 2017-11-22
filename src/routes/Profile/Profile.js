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

    onTextChanged(key) {
        return ((event) => {
            console.log(`Key => ${key}. Text => ${event.target.value}`)
            this.setState({
                ...this.state,
                [key]: event.target.value
            });
        })
    }

    render() {
        const { image, firstName, lastName, nickName } = this.state

        return (
            <div className="App">
                <NavigationBar/>
                <main className="container">
                    <div className="pure-u-1-5"></div>
                    <div className="pure-u-3-5 pure-form">
                        <h1>Profile for {firstName} {lastName}</h1>
                        <ImageDropzone onImageSelected={this.onImageSelected.bind(this)} image={image}/>
                        <input style={{marginTop: "10px"}} className="full-width" placeholder="First Name" onChange={this.onTextChanged("firstName").bind(this)}/>
                        <input style={{marginTop: "10px"}} className="full-width" placeholder="Last Name" onChange={this.onTextChanged("lastName").bind(this)}/>
                        <input style={{marginTop: "10px"}} className="full-width" placeholder="Nickname" onChange={this.onTextChanged("nickName").bind(this)}/>
                        <button className="pure-button pure-button-primary" style={{marginTop: "1.2em"}} onClick={this.onSubmitPressed.bind(this)}>Submit</button>
                    </div>
                    <div className="pure-u-1-5"></div>
                </main>
            </div>
        )    
    }
}