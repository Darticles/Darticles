import React, { Component } from 'react'
import { Container } from 'react-materialize'
import classnames from 'classnames'

import getWeb3 from '../utils/getWeb3'
import NavigationBar from './NavigationBar/NavigationBar'

import PortfolioImage from './img/Darticles-portfolio.png'
import AuctionImage from './img/Darticles-auction.png'

class App extends Component {  

    render() {
        return (
          <Container>
                  <h4>Darticles</h4>
                  <h5>Decentralized artwork portfolio and auctioning platform.</h5>
                  <hr/>
                  <h5>Introduction</h5>
                  <p>Darticles is a decentralized gallery and artwork auctioning platform built on Ethereum. People can manage their portfolios and have a cryptographic proof that the containing artwork is theirs. No central authority is required.</p>
                  <h5>Index</h5>
                  <ul>
                  <li>Why?</li>
                  <li>How?</li>
                  <li>Portfolio</li>
                  <li>Auctions</li>
                  <li>About</li>
                  </ul>
                  <h5>Why?</h5>
                  <p>Digital art does not have a suitable environment right now. Artists upload their artwork to centralized platforms, so they aren't owners of what they do. We propose a decentralized platform where artist can submit their artwork, expose them in galleries and sell them with absolute freedom without having to trust in any central authority.</p>
                  <h5>How?</h5>
                  <p>Within the Darticles platform, artists can manage their own portfolios. No central authority can ban what they submit or erase their artwork. Artwork can be selled or auctioned. When an artwork is selled, it is transferred from the artist's portfolio to the bidder's one. The Darticles platform is built on Ethereum. No ERC20 token is used, just plain Ether, Images are stored in IPFS (Inter-Planetary File System) making them immutable and permanent. The images hashes are stored within the Blockchain, reducing the contract storage size.</p>
                  <hr/>
                  <h5>Portfolio</h5>
                  <img src={PortfolioImage} />
                  <hr/>
                  <h5>Auctions</h5>
                  <img src={AuctionImage} />
          </Container>
        )
    }

}

export default App
