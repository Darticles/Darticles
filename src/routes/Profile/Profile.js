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
        // const { image, firstName, lastName, nickName } = this.state
        // if (! (image && firstName && lastName)) { return }

        // var formData = new FormData();
        // formData.append("file", this.state.image)

        // axios
        //     .post('http://localhost:3000/files', formData, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data'
        //         }
        //     })
        //     .then((response) => {
        //     const fileID = response.data[0]
        //     if (fileID) {
        //         console.log(fileID) 
        //         return this.state.darticlesInstance.addArtwork(fileID, "titulo1", "description1", { from : this.state.defaultAccount }) 
        //     }
        //     })
        //     .then((algo) => {
        //     document.location="/portfolio"                        
        //     })    
        //     .catch(function (error) {
        //     console.log(error);
        //     });    
    }

    onTextChanged(key) {
        return ((event) => {
            this.setState({
                ...this.state,
                [key]: event.target.value
            })
        })
    }

    render() {
        const { image, firstName, lastName, nickName } = this.state
        const title = this.props.title


        return (
            <div className="App">
                <NavigationBar/>
                <main className="container">
                    <div className="pure-u-1-5"></div>
                    <div className="pure-u-3-5 pure-form">
                        <h1>{title || "Profile"} for {firstName} {lastName}</h1>
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