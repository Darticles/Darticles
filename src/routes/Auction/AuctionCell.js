import React, { Component } from 'react'

import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import './css/AuctionCell.css'

class AuctionCell extends Component {
    render() {
        return(
            <div className="pure-u-1-4">
                <div className="card">
                    <img className="full-width-image" src="https://k32.kn3.net/taringa/3/2/4/8/6/1//doggystar/5AB.gif"/>
                    <div className="card-text">
                        <h3>Mi trabajo aqui ha terminado</h3>
                        <h4>Leonard Nimoy</h4>
                    </div>
                </div>
            </div>
        )
    }
}

export default AuctionCell;