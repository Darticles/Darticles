// Libraries
import React, { Component } from 'react'
import classnames from 'classnames'
import Contract from 'truffle-contract'

import Darticles from '../../../build/contracts/Darticles.json'

// Components
import ImageDropzone from '../../Components/ImageDropzone'

// CSS Styles
import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import '../css/root.css'
import './css/NewArtwork.css'

import getWeb3 from '../../utils/getWeb3'
import promisify from '../../utils/promisify'

var axios = require('axios');

export default class NewArtwork extends Component {

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

    onTextChanged(key) {
        return ((event) => {
            this.setState({
                ...this.state,
                [key]: event.target.value
            })
        })
    }

    onSubmitPressed() {
        // TODO: Add logic to upload image
        // And then go back to porfolio
        if(this.state.image) {
            // document.location="/portfolio"

            if (this.state.title && this.state.description) {
                var formData = new FormData();
                formData.append("file", this.state.image)
    
                axios.post('http://localhost:3000/files', formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                })
                  .then((response) => {
                    const fileID = response.data[0]
                    if (fileID) {
                        console.log(fileID) 
                        return this.props.darticlesInstance.addArtwork(fileID, this.state.title, this.state.description, { from : this.props.defaultAccount }) 
                    }
                  })
                  .then((algo) => {
                    document.location="/portfolio"                        
                  })    
                  .catch(function (error) {
                    console.log(error);
                  });          
            }
        }
    }

    getUploadForm() {
        const { image } = this.state
        
        return (
            <div className="pure-g">
            <div className="pure-u-1-5"></div>
            <div className="pure-u-3-5 pure-form">
                        {/* <legend>A compact inline form</legend> */}

                        <input className="full-width" placeholder="Title" onChange={this.onTextChanged("title").bind(this)}/>
                        <ImageDropzone onImageSelected={this.onImageSelected.bind(this)} image={image}/>
                        <textarea className="full-width" rows="4" cols="50" placeholder="Description" onChange={this.onTextChanged("description").bind(this)}>
                        </textarea> 
                        {/* <p><input className="full-width" placeholder="Description"/></p> */}

                        <p><button className="pure-button pure-button-primary" style={{marginTop: "1.2em"}} onClick={this.onSubmitPressed.bind(this)}>Submit</button></p>
            </div>
            <div className="pure-u-1-5"></div>
        </div>
        )
    }

    render() {
        return(
            <div>
                <h1>Add new artwork</h1>
                { this.getUploadForm() }
            </div>
        )

    }

}