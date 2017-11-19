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


// CSS Styles
import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import '../css/root.css'

class App extends Component {
    constructor(props){
        super(props)

        // Set default state
        this.state = {
            auctions: [],
            defaultAccount: undefined,
            darticlesInstance: undefined,
            errorMessage: undefined,
            web3: undefined,
        }
    }
    
    componentWillMount() {
        this.initialize()
            .then(() => { 
                this.watchNewProposals() 
                this.watchNewVotes()
            })
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
    
        this.loadAuctions()
    }

    async loadAuctions() {
        const { web3, darticlesInstance, defaultAccount } = this.state
    
        console.log(`It's about to load proposals from account ${defaultAccount}`)
        console.log(`Voting instance address: ${darticlesInstance.address}`)
    
        try {
            const auctionIDs = await darticlesInstance.getAuctions.call(defaultAccount)
            const auctions = auctionIDs.map((auctionID) => darticlesInstance.auctionWithID(auctionID))
            this.setState({
                ...this.state,
                auctions,
            })
        } catch (error) {
            console.log(`Error loading auctions: ${error}`)
        }
    }

    render() {
        const { className, ...props } = this.props
        const { auctions } = this.state

        const cells = auctions.map(this.createAuctionCell)

        return(
            <div className="App">
                <NavigationBar/>
                <main className="container">
                    <h1>Auctions</h1>
                    <div className="pure-g">
                        { cells }
                    </div>
                </main>
            </div>
        )   
    }

    createAuctionCell (auction) {
        return (
            <AuctionCell />
        )
    }

}

export default App;