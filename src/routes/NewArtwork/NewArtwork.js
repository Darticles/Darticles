// Libraries
import React, {Component} from 'react'
import classnames from 'classnames'
import Contract from 'truffle-contract'
import {Row, Col, Button, CardPanel} from 'react-materialize'

import Darticles from '../../../build/contracts/Darticles.json'

// Components
import ImageDropzone from '../../Components/ImageDropzone'

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
        // TODO: Add logic to upload image And then go back to porfolio
        if (this.state.image) {
            // document.location="/portfolio"

            if (this.state.title && this.state.description) {
                var formData = new FormData();
                formData.append("file", this.state.image)

                axios
                    .post('http://localhost:3000/files', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(function (response) {
                        const fileID = response.data[0]
                        if (fileID) {
                            console.log(fileID)
                            return this
                                .props
                                .darticlesInstance
                                .addArtwork(fileID, this.state.title, this.state.description, {from: this.props.defaultAccount})
                        }
                    }.bind(this))
                    .then(function (algo) {
                        document.location = "/portfolio"
                    }.bind(document))
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    }

    getUploadForm() {
        const {image} = this.state

        return (
            <Row>
                <Col s={2}></Col>
                <Col s={8}>
                    <CardPanel>
                    <ImageDropzone
                        onImageSelected={this
                        .onImageSelected
                        .bind(this)}
                        image={image}/>

                    <input
                        className="full-width"
                        placeholder="Title"
                        onChange={this
                        .onTextChanged("title")
                        .bind(this)}/>
                    <input
                        className="full-width"
                        rows="4"
                        cols="50"
                        placeholder="Description"
                        onChange={this
                        .onTextChanged("description")
                        .bind(this)}></input>
                    {/* <p><input className="full-width" placeholder="Description"/></p> */}

                    <Button onClick={this
                            .onSubmitPressed
                            .bind(this)}>
                            Submit
                    </Button>
                    </CardPanel>
                </Col>
                <Col s={2}></Col>

            </Row>

        )
    }

    render() {
        return (
            <div>
                {this.getUploadForm()}
            </div>
        )

    }

}