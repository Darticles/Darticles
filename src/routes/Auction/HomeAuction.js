import React, {Component} from 'react'
import classnames from 'classnames'

import NavigationBar from '../NavigationBar/NavigationBar'
import AuctionCell from './AuctionCell'

import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import '../css/root.css'

class App extends Component {
    constructor(props){
        super(props)
    }

    render() {
        const { className, ...props } = this.props;
        return(
            <div className="App">
                <NavigationBar/>
                <main className="container">
                    <h1>Auctions</h1>
                    <div className="pure-g">
                        <AuctionCell/>
                        <AuctionCell/>
                        <AuctionCell/>
                        <AuctionCell/>
                        <AuctionCell/>
                        <AuctionCell/>
                    </div>
                </main>
            </div>
        );   
    }
}

export default App;