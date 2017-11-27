import React, {Component} from 'react'
import NavigationBar from '../NavigationBar/NavigationBar'
import ImageDropzone from '../../Components/ImageDropzone'
import axios from 'axios'

import {Row, Col, Button, CardPanel} from 'react-materialize'

// CSS Styles
import './Profile.css'

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

    componentWillMount() {
        this.initialize()
    }

    initialize() {
        this
            .getProfile()
            .then(function (profile) {
                const web3 = this.props.web3

                const profileImage = profile[0]
                const firstName = web3.toUtf8(profile[1])
                const lastName = web3.toUtf8(profile[2])
                const nickName = web3.toUtf8(profile[3])

                this.setState({
                    ...this.state,
                    ready: true,
                    profileImage,
                    firstName,
                    lastName,
                    nickName
                })

            }.bind(this))
            .catch(function (error) {
                console.log(error)
            })
    }

    getProfile() {
        return this
            .props
            .darticlesInstance
            .getProfile
            .call({from: this.props.defaultAccount})
    }

    onSubmitPressed() {
        // TODO: Add logic to upload image And then go back to porfolio
        if (this.state.image) {
            if (this.state.firstName && this.state.lastName && this.state.nickName) {
                var formData = new FormData();
                formData.append("file", this.state.image)

                axios
                    .post('/api/files', formData, {
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
                                .setProfile(fileID, this.state.firstName, this.state.lastName, this.state.nickName, {from: this.props.defaultAccount})
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

    onTextChanged(key) {
        return ((event) => {
            this.setState({
                ...this.state,
                [key]: event.target.value
            })
        })
    }

    getProfileForm() {
        const {image, firstName, lastName, nickName} = this.state

        return (
            <div className="">
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
                                style={{
                                marginTop: "10px"
                            }}
                                className="full-width"
                                placeholder="First Name"
                                value={this.state.firstName}
                                onChange={this
                                .onTextChanged("firstName")
                                .bind(this)}/>
                            <input
                                style={{
                                marginTop: "10px"
                            }}
                                className="full-width"
                                placeholder="Last Name"
                                value={this.state.lastName}
                                onChange={this
                                .onTextChanged("lastName")
                                .bind(this)}/>
                            <input
                                style={{
                                marginTop: "10px"
                            }}
                                className="full-width"
                                placeholder="Nickname"
                                value={this.state.nickName}
                                onChange={this
                                .onTextChanged("nickName")
                                .bind(this)}/>

                            <Button
                                waves='light'
                                onClick={this
                                .onSubmitPressed
                                .bind(this)}>Submit</Button>
                        </CardPanel>
                    </Col>
                    <Col s={2}></Col>
                </Row>
            </div>
        )
    }

    render() {
        const {image, firstName, lastName, nickName} = this.state
        const title = this.props.title

        return (
            <div>
                {this.state.ready
                    ? this.getProfileForm()
                    : <div/>}
            </div>
        )
    }
}