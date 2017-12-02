// Libraries
import React, {Component} from 'react'
import Contract from 'truffle-contract'
import classnames from 'classnames'
import {Card, CardTitle, Container, Row, Col, Button, Input} from 'react-materialize'

// Components
import NavigationBar from '../NavigationBar/NavigationBar'
import ArtworkCell from './ArtworkCell'

// Contract Abis
import Darticles from '../../../build/contracts/Darticles.json'

// Utils
import promisify from '../../utils/promisify'
import BigNumber from 'bignumber.js'

// CSS Styles
import './css/ArtworkDetail.css'

export default class ArtworkDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            editing: false
        }
    }

    async initialize() {
        const { web3 } = this.props

        const response = await this.retrieveArtwork()    
        console.log(response)

        const artwork = {
            creator: response[0],
            owner: response[1],
            imageLink: "http://localhost:8080/ipfs/" + response[2],
            title: web3.toUtf8(response[3]),
            description: web3.toUtf8(response[4]),
            state: web3.toUtf8(response[5])
        }

        this.setState({
            ...this.state,
            artwork,
            ready: true
        })
    }

    retrieveArtwork() {
        const artworkID = this.props.router.match.params.id
        if (artworkID) {
            return this
                .props
                .darticlesInstance
                .getArtworkWithID
                .call(artworkID, {from: this.props.defaultAccount})
        } else {
            throw 'No Artwork ID'
        }
    }

    componentWillMount() {
        this.initialize()
    }

    startEditingAuction() {
        this.setState({
            ...this.state,
            editing: true
        })
    }

    async placeAuction() {
        const { basePrice, endTime } = this.state
        if (!basePrice || !endTime) return

        try {
            const { web3, router, defaultAccount, darticlesInstance } = this.props
            const artworkID = router.match.params.id

            await darticlesInstance.startAuction(
                artworkID, 
                web3.toWei(basePrice), 
                endTime.getTime(), 
                { from: defaultAccount }
            )

            console.log(`
                It has been created a new auction.

                artworkID => ${artworkID}
                basePrice => ${web3.toWei(basePrice)}
                endTime => ${endTime.getTime()} (raw: ${endTime})
                defaultAccount => ${defaultAccount}
            `)
            
            document.location.href = "/auctions"
        } catch (error) {
            console.log(`Error during place auction ${error}`)
        }
    }

    cancelAuctionPlace() {
        this.setState({
            ...this.state,
            editing: false
        })
    }

    basePriceChanged(event) {
        const basePrice = event.target.value
        console.log(`Base price => ${basePrice}`)
        this.setState({
            ...this.state,
            basePrice
        })
    }

    endTimeChanged(event) {
        const endTime = new Date(event.target.value)
        console.log(`End time => ${endTime}`)
        this.setState({
            ...this.state,
            endTime
        })

    }

    getButton() {
        return (
            this.state.artwork.state === "Available" ? <Button onClick={this.startEditingAuction.bind(this)} key="0">Start an auction</Button> : <div/>
        )
    }

    getDetail() {
        const { artwork, editing } = this.state
        const { imageLink, title, description, state } = artwork
        
        const placeAuctionAction = (<Button onClick={this.placeAuction.bind(this)} key="0">Place auction</Button>)
        const cancelAction = (<Button onClick={this.cancelAuctionPlace.bind(this)} className="red" key="1">Cancel</Button>)

        const editingFields = editing ? this.getEditingFields() : undefined

        return (
            <Row>
                <Col s={1}></Col>
                <Col s={10}>
                    <Card 
                        header={<CardTitle reveal 
                        image={ imageLink } waves='light'/>}
                        title={`${title.toUpperCase()} - ${description}`}
                        actions={editing ? [placeAuctionAction, cancelAction] : [this.getButton()]} >

                        { editingFields }
                    </Card>

                </Col>
                <Col s={1}></Col>
            </Row>
        )
    }

    getEditingFields() {
        return (
            <Row>
                <Input label="Base price (Ether)" type="number" s={6} onChange={this.basePriceChanged.bind(this)} />
                <Input label="End time" type="date" s={6} onChange={this.endTimeChanged.bind(this)} />
            </Row>
        )
    }

    render() {
        return (
            <Container>
                {this.state.ready
                    ? this.getDetail()
                    : <div/>}
            </Container>
        )
    }

}