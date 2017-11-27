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

    async onSubmitPressed() {
        const { image, title, description } = this.state
        const { darticlesInstance, defaultAccount } = this.props

        if (!(image && title && description)) return

        let formData = new FormData();
        formData.append("file", image)

        const headers = { 'Content-Type': 'multipart/form-data' }
        const options = { headers }
        const response = await axios.post('/api/files', formData, options)
        const fileID = response.data[0]
        if (!fileID) return
        console.log(fileID)
        await darticlesInstance.addArtwork(fileID, title, description, {from: defaultAccount})
        document.location = "/portfolio"
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
                            onChange={this.onTextChanged("title").bind(this)} />
                        <input
                            className="full-width"
                            rows="4"
                            cols="50"
                            placeholder="Description"
                            onChange={this.onTextChanged("description").bind(this)} />
                        <Button onClick={this.onSubmitPressed.bind(this)}>
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