import React, { Component } from 'react'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'

import Home from './routes/HomeTruffle'
import Uploader from './routes/upload'
import AuctionHome from './routes/Auction/HomeAuction'
import PortfolioHome from './routes/Portfolio/Portfolio'
import NewArtwork from './routes/NewArtwork/NewArtwork'
import Profile from './routes/Profile/Profile'
import ArtworkDetail from './routes/Portfolio/ArtworkDetail'

export default class Router extends Component {
    profileComponent(text) {
        return () => {
            return (
                <Profile title={text} />
            )
        }
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/upload" component={Uploader} />
                        <Route path="/auctions" component={AuctionHome} />
                        <Route exact path="/portfolio" component={PortfolioHome} />
                        <Route exact path="/portfolio/new" component={NewArtwork} />
                        <Route path="/portfolio/:id" component={ArtworkDetail}/>
                        <Route path="/profile" component={() => (<Profile title="PROFLE"/>)} />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}