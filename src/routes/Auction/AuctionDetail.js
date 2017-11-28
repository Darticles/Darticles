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

export default class AuctionDetail extends Component {

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

        const _bid = await darticlesInstance
            .getCurrentBidForAuctionWithID
            .call(auction.auctionID, {from: defaultAccount})

        const bid = {
            from: _bid[0],
            value: web3.fromWei(_bid[1])
        }

        return bid
    }

    async loadArtwork(auction) {
        const defaultAccount = this.props.defaultAccount
        const darticlesInstance = this.props.darticlesInstance
        const {web3} = this.props
        //Load artworks for auctions

        const _artwork = await darticlesInstance
            .getArtworkWithID
            .call(auction.artworkID, {from: defaultAccount})
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
        const {web3, darticlesInstance} = this.props

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
            ready: true,
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

        const darticlesInstance = this.props.darticlesInstance
        
        const filter = darticlesInstance.LogNewBid({}, {
            fromBlock: 0,
            toBlock: 'latest'
        })

        const self = this;
        var newBidEvent = filter.watch((error, result) => {
            if (!error) {
                //address sender, uint256 value
                const current_bid = {
                    from: result[0],
                    value: result[1],
                }
                self.setState({
                    ...self.state,
                    current_bid
                })    
            }
                console.log('NEW BID EVENT')
                console.log(error)
                console.log(result)
        })

        this.initialize()        

    }

    onBidValueChanged(event) {
        const value = event.target.value
        this.setState({
            ...this.state,
            myBid: value
        })
    }

    closeAuction() {
        const defaultAccount = this.props.defaultAccount
        const darticlesInstance = this.props.darticlesInstance
        const auction = this.state.auction

        darticlesInstance
        .endAuction(auction.auctionID, {
            from: defaultAccount,
        })
        .then(function (response) {
            console.log(response)
            document.location = "/portfolio"
        }.bind(this))
        .catch(function (error) {
            console.log(error)
        })

    }

    postBid() {
        const defaultAccount = this.props.defaultAccount
        const darticlesInstance = this.props.darticlesInstance
        const {web3} = this.props
        const auction = this.state.auction

        if (this.state.myBid) {
            const weiValue = web3.toWei(this.state.myBid, 'ether')
            darticlesInstance
                .makeBid(auction.auctionID, {
                    from: defaultAccount,
                    value: weiValue
                })
                .then(function (response) {
                    console.log(response)
                }.bind(this))
                .catch(function (error) {
                    console.log(error)
                })
        }
    }

    getEditingFields() {
        return (
            <Row>
                <Input
                    label="Bid (Ether)"
                    type="number"
                    s={6}
                    onChange={this
                    .onBidValueChanged
                    .bind(this)}/>
                <Button
                    onClick={this
                    .postBid
                    .bind(this)}>Make Bid</Button>
            </Row>
        )
    }

    winningMessage() {
        return (
            <div style={{
                color: "red"
            }}>
                You are Winning! <br/>
                <Button onClick={this
                    .closeAuction
                    .bind(this)}>Close Auction</Button>
            </div>
        )
    }

    getBidComponent() {
        return (this.state.current_bid.from.toLowerCase() == this.props.defaultAccount.toLowerCase()
            ? this.winningMessage()
            : this.getEditingFields())
    }

    getDetail() {
        const {auction} = this.state
        const {title, description, imageLink} = this.state.artwork

        return (
            <Row>
                <Col s={2}></Col>
                <Col s={8}>
                    <Card
                        header={< CardTitle reveal image = {
                        imageLink
                    }
                    waves = 'light' />}
                        title={`${title.toUpperCase()} - ${description}`}>

                        {"Current Bid: " + this.state.current_bid.value + ' ETH'}
                        {this.getBidComponent()}
                    </Card>

                </Col>
                <Col s={2}></Col>
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