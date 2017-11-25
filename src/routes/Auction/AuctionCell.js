import React, { Component } from 'react'

import './css/AuctionCell.css'

class AuctionCell extends Component {
    render() {
        return(
            <div className="pure-u-1-4">
                <div className="card">
                    <img className="full-width-image" src="https://k32.kn3.net/taringa/3/2/4/8/6/1//doggystar/5AB.gif"/>
                    <div className="card-text">
                        <p className="big">Mi trabajo aqui ha terminado</p>
                        <p className="small">Leonard Nimoy</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default AuctionCell;