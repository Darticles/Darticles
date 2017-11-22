// Libraries
import React, { Component } from 'react'
import classnames from 'classnames'
import Contract from 'truffle-contract'

import Darticles from '../../../build/contracts/Darticles.json'

// Components
import NavigationBar from '../NavigationBar/NavigationBar'
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

    async initialize() {
        const { web3 } = await getWeb3
    
        // Create voting entity from contract abi
        const darticles = Contract(Darticles)
        darticles.setProvider(web3.currentProvider)
    
        const accounts = await promisify(web3.eth.getAccounts)
        const defaultAccount = accounts[0]
    
        const darticlesInstance = await darticles.deployed()
    
        this.setState({
            ...this.state,
            web3,
            defaultAccount,
            darticlesInstance,
        })
    }

    componentWillMount() {
        this.initialize()
        .then(() => { 
            this.setState({
                ...this.state,
                ready : true,
            })
        })
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
                    return this.state.darticlesInstance.addArtwork(fileID, "titulo1", "description1", { from : this.state.defaultAccount }) 
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

    getUploadForm() {
        const { image } = this.state
        
        return (
            <div className="pure-g">
            <div className="pure-u-1-5"></div>
            <div className="pure-u-3-5 pure-form">
                        {/* <legend>A compact inline form</legend> */}

                        <input className="full-width" placeholder="Title"/>
                        <ImageDropzone onImageSelected={this.onImageSelected.bind(this)} image={image}/>
                        <textarea className="full-width" rows="4" cols="50" placeholder="Description">
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
            <div className="App">
                <NavigationBar/>
                <main className="container">
                    <h1>Add new artwork</h1>
                    { this.state.ready ? this.getUploadForm() : <h1>Loading</h1>}
                </main>
            </div>
        )

    }

}