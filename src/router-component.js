import React, { Component } from 'react'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { Container, ProgressBar } from 'react-materialize'

import Home from './routes/HomeTruffle';
import Uploader from './routes/upload';
import AuctionHome from './routes/Auction/HomeAuction';
import AuctionDetail from './routes/Auction/AuctionDetail';
import Balance from './routes/Balance/Balance'
import PortfolioHome from './routes/Portfolio/Portfolio';
import ArtworkDetail from './routes/Portfolio/ArtworkDetail';

import NewArtwork from './routes/NewArtwork/NewArtwork';
import Profile from './routes/Profile/Profile'
import NavigationBar from './routes/NavigationBar/NavigationBar';

//Contracts
import getWeb3 from './utils/getWeb3'
import promisify from './utils/promisify'
import Contract from 'truffle-contract'
import Darticles from './../build/contracts/Darticles.json'

class RouterComponent extends Component {
    constructor(props) {
        super(props)

        this.state = { }
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
    }

    componentWillMount() {
        this.initialize()
        .then(() => { 
            this.setState({
                ...this.state,
                ready : true,
            })
        })
    }

    getRouter() {
        return(
            <BrowserRouter>
            <div>
                <Route path="/" component={NavigationBar}/>
                <Switch>
                    <Route exact path="/" component={() => (<Home web3={this.state.web3} defaultAccount={this.state.defaultAccount} darticlesInstance={this.state.darticlesInstance}/>)}/>
                    <Route path="/upload" component={() => (<Uploader web3={this.state.web3} defaultAccount={this.state.defaultAccount} darticlesInstance={this.state.darticlesInstance}/>)}/>
                    <Route exact path="/auctions" component={() => (<AuctionHome web3={this.state.web3} defaultAccount={this.state.defaultAccount} darticlesInstance={this.state.darticlesInstance}/>)}/>
                    <Route exact path="/auctions/:id" component={(prop) => (<AuctionDetail web3={this.state.web3} defaultAccount={this.state.defaultAccount} darticlesInstance={this.state.darticlesInstance} router={prop}/>)}/>
                    <Route exact path="/portfolio" component={() => (<PortfolioHome web3={this.state.web3} defaultAccount={this.state.defaultAccount} darticlesInstance={this.state.darticlesInstance}/>)}/>
                    <Route exact path="/portfolio/new" component={() => (<NewArtwork web3={this.state.web3} defaultAccount={this.state.defaultAccount} darticlesInstance={this.state.darticlesInstance}/>)}/>
                    <Route exact path="/portfolio/:id" component={(prop) => (<ArtworkDetail web3={this.state.web3} defaultAccount={this.state.defaultAccount} darticlesInstance={this.state.darticlesInstance} router={prop}/>)}/>
                    <Route path="/profile" component={() => (<Profile web3={this.state.web3} defaultAccount={this.state.defaultAccount} darticlesInstance={this.state.darticlesInstance}/>)}/>
                    <Route path="/balance" component={() => (<Balance web3={this.state.web3} defaultAccount={this.state.defaultAccount} darticlesInstance={this.state.darticlesInstance}/>)}/>
                </Switch>
            </div>
            </BrowserRouter>    
        )
    }

    render() {
        return(
            <div className="App">
                    {this.state.ready ? this.getRouter() : <ProgressBar />}
            </div>        
        )
    }
}

export default RouterComponent;