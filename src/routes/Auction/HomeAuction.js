// Libraries
import React, {Component} from 'react'
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

class App extends Component {
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
            .catch(function (error) {
                console.log(error)
            })
    }

    getAuctionsDetails(auctions) {
        const defaultAccount = this.props.defaultAccount
        const darticlesInstance = this.props.darticlesInstance

        //Get Auction Details
        return Promise.all(auctions.map((id) => {
            darticlesInstance
                .getAuctionWithID
                .call(id, {from: defaultAccount})
        }))
    }

    parseAuctionsResponse(response) {
        //Parse Contract Response
        const auctions = response.map((r) => {
            // auction.owner, auction.artworkID, auction.initialPrice, auction.endTimestamp,
            // auctionState
            return {owner: r[0], artworkID: r[1], initialPrice: r[2], endTimestamp: r[3], auctionState: r[4]}
        })

        console.log(auctions)
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
        console.log(`Voting instance address: ${darticlesInstance.address}`)

        //Get Active Auctions
        return darticlesInstance
            .getActiveAuctions
            .call({from: defaultAccount})
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

        const cells = auctions.map(this.createAuctionCell)

        return (
            <div>
                {/* <div className="pure-g">
                    { cells }
                </div> */}
            </div>
        )
    }

    createAuctionCell(auction) {
        return (<AuctionCell/>)
    }

}

export default App;