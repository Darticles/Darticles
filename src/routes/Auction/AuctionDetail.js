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
    
    async getCurrentBid(auction) {
        const defaultAccount = this.props.defaultAccount
        const darticlesInstance = this.props.darticlesInstance
        const {web3} = this.props

        const _bid = await darticlesInstance.getCurrentBidForAuctionWithID.call(auction.auctionID, {from: defaultAccount})
        const bid = {
            from : _bid[0],
            value : _bid[1]
        }

        return bid
    }

    async loadArtwork(auction) {
        const defaultAccount = this.props.defaultAccount
        const darticlesInstance = this.props.darticlesInstance
        const {web3} = this.props
        //Load artworks for auctions

        const _artwork = await darticlesInstance.getArtworkWithID.call(auction.artworkID, {from: defaultAccount})
        const artwork = {
            creator: _artwork[0],
            artworkOwner: _artwork[1],
            imageLink: "http://localhost:8080/ipfs/" + _artwork[2],
            title: web3.toUtf8(_artwork[3]),
            description: web3.toUtf8(_artwork[4]),
            state: web3.toUtf8(_artwork[5])
        }

        return artwork
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

        const artwork = await this.loadArtwork(auction)

        const current_bid = await this.getCurrentBid(auction)

        this.setState({
            ...this.state,
            auction, 
            artwork,
            current_bid,
            ready: true
        })
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

    onBidValueChanged(event) {
        const value = event.target.value
        this.setState({
            ...this.state,
            myBid : value
        })
    }

    postBid() {
        const defaultAccount = this.props.defaultAccount
        const darticlesInstance = this.props.darticlesInstance
        const {web3} = this.props
        const auction = this.state.auction

        if (this.state.myBid) {
            const weiValue = web3.toWei(this.state.myBid, 'ether')
            darticlesInstance.makeBid(auction.auctionID, {from: defaultAccount, value: weiValue}).then(function(response) {
                console.log(response)
            }.bind(this)).catch(function(error){
                console.log(error)
            })           
        }
    }

    getEditingFields() {
        return (
            <Row>
                <Input label="Bid (Ether)" type="number" s={6} onChange={this.onBidValueChanged.bind(this)}/>
                <Button onClick={this.postBid.bind(this)}>Make Bid</Button>
            </Row>
        )
    }

    getDetail() {
        const {auction} = this.state
        const {title, description, imageLink} = this.state.artwork

        const editingFields = this.getEditingFields()
        
        return (
            <Row>
                <Col s={1}></Col>
                <Col s={10}>
                    <Card
                        header={< CardTitle reveal image = {
                        imageLink
                    }
                    waves = 'light' />}
                        title={`${title.toUpperCase()} - ${description}`}>

                    {"Current Bid: " + this.state.current_bid.value}
                    { editingFields }

                    </Card>

                </Col>
                <Col s={1}></Col>
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