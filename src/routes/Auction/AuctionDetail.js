// Libraries
import React, {Component} from 'react'
import Contract from 'truffle-contract'
import classnames from 'classnames'
import {
    Card,
    CardTitle,
    Container,
    Row,
    Col,
    Button,
    Input
} from 'react-materialize'

// Components
import NavigationBar from '../NavigationBar/NavigationBar'

// Contract Abis
import Darticles from '../../../build/contracts/Darticles.json'

// Utils
import promisify from '../../utils/promisify'
import BigNumber from 'bignumber.js'

export default class ArtworkDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            editing: false
        }
    }

    async loadArtwork(auction) {
        const defaultAccount = this.props.defaultAccount
        const darticlesInstance = this.props.darticlesInstance
        const {web3} = this.props
        //Load artworks for auctions

        return darticlesInstance
            .getArtworkWithID
            .call(auction.artworkID, {from: defaultAccount})
            .then(function (_artwork) {
                const artwork = {
                    creator: _artwork[0],
                    artworkOwner: _artwork[1],
                    imageLink: "http://localhost:8080/ipfs/" + _artwork[2],
                    title: web3.toUtf8(_artwork[3]),
                    description: web3.toUtf8(_artwork[4]),
                    state: web3.toUtf8(_artwork[5])
                }

                return artwork
            })
            .catch(function(error){
                console.log(error)
            })
    }

    async initialize() {
        const {web3} = this.props

        const r = await this.retrieveAuction()
        console.log(r)

        const auction = {
            owner: r[0],
            artworkID: r[1],
            initialPrice: r[2],
            endTimestamp: r[3],
            auctionState: web3.toUtf8(r[4]),
            auctionID: r[5]
        }

        // this.setState({
        //     ...this.state,
        //     auction,
        // })

        this.loadArtwork(auction).then(function(artwork){
            this.setState({
                ...this.state,
                artwork,
                ready: true
            })
        }.bind(this)) 
    }

    retrieveAuction() {
        const auctionID = this.props.router.match.params.id
        if (auctionID) {
            return this
                .props
                .darticlesInstance
                .getAuctionWithID
                .call(auctionID, {from: this.props.defaultAccount})
        } else {
            throw 'No Artwork ID'
        }
    }

    componentWillMount() {
        this.initialize()
    }

    getDetail() {
        const {auction} = this.state

        return (
            <Row>
                <Col s={1}></Col>
                <Col s={10}>
                    {/* <Card
                        header={< CardTitle reveal image = {
                        imageLink
                    }
                    waves = 'light' />}
                        title={`${title.toUpperCase()} - ${description}`}
                        actions={editing
                        ? [placeAuctionAction, cancelAction]
                        : [startAuctionAction]}>

                        {editingFields}
                    </Card> */}

                </Col>
                <Col s={1}></Col>
            </Row>
        )
    }

    render() {
        return (
            <Container>
                <h1>Auction Detail {this.state.auction
                        ? this.state.auction.auctionID
                        : ""}</h1>
                {this.state.ready
                    ? this.getDetail()
                    : <div/>}
            </Container>
        )
    }

}