// Libraries
import React, {Component} from 'react'
import {Row, Col, Button, CardPanel, Icon} from 'react-materialize'
import Contract from 'truffle-contract'
import classnames from 'classnames'

// Components
import NavigationBar from '../NavigationBar/NavigationBar'
import AuctionCell from './AuctionCell'

// Contract Abis
import Darticles from '../../../build/contracts/Darticles.json'

// Utils
import getWeb3 from '../../utils/getWeb3'
import promisify from '../../utils/promisify'

export default class HomeAuction extends Component {
    constructor(props) {
        super(props)

        // Set default state
        this.state = {
            auctions: [],
            defaultAccount: undefined,
            darticlesInstance: undefined,
            errorMessage: undefined,
            web3: undefined
        }
    }

    componentWillMount() {
        this
            .initialize()
            .catch(function (error) {
                console.log(error)
            })
    }

    initialize() {
        return this
            .loadAuctions()
            .then((auctions) => this.setState({...this.state, auctions}))
            .catch(function (error) {
                console.log(error)
            })
    }

    getAuctionsDetails(auctions) {
        const defaultAccount = this.props.defaultAccount
        const darticlesInstance = this.props.darticlesInstance
        //Get Auction Details
        return Promise.all(auctions.map((id) => {
            return darticlesInstance.getAuctionWithID.call(id, {from: defaultAccount})
        }))
    }

    parseAuctionsResponse(response) {
        //Parse Contract Response
        console.log(`in parseAuctionsResponse, response is => ${response}`)
        
        const auctions = response.map((r) => {
            // auction.owner, auction.artworkID, auction.initialPrice, auction.endTimestamp,
            // auctionState
            return {owner: r[0], artworkID: r[1], initialPrice: r[2], endTimestamp: r[3], auctionState: r[4]}
        })

        return Promise.resolve(auctions)
    }

    loadArtworks(auctions) {
        const defaultAccount = this.props.defaultAccount
        const darticlesInstance = this.props.darticlesInstance
        //Load artworks for auctions
        return Promise.all(auctions.map((auction) => darticlesInstance.getArtworkWithID.call(auction.artworkID, {from: defaultAccount})))
    }

    loadAuctions() {
        const {darticlesInstance, defaultAccount} = this.props

        console.log(`It's about to load proposals from account ${defaultAccount}`)
        console.log(`Darticles instance address: ${darticlesInstance.address}`)

        //Get Active Auctions
        return darticlesInstance.getActiveAuctions.call({from: defaultAccount})
            .then(this.getAuctionsDetails.bind(this))
            .then(this.parseAuctionsResponse.bind(this))
            .then(this.loadArtworks.bind(this))
    }

    render() {
        const {
            className,
            ...props
        } = this.props
        const {auctions} = this.state

        console.log(`Auctions => ${auctions}`)

        const cells = auctions.map((auction, index) => this.createAuctionCell(auction, index))

        console.log(`Cells => ${cells}`)

        return (
            <Row>
                { cells }
            </Row>
        )
    }

    createAuctionCell(auction, index) {
        return (<AuctionCell auction={auction} key={index} />)
    }

}