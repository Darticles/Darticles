import React, {Component} from 'react'
import {Col, Card, CardTitle} from 'react-materialize'


import './css/AuctionCell.css'

class AuctionCell extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {owner, artworkID, initialPrice, endTimestamp, auctionState, artwork} = this.props.auction
        const {creator, artworkOwner, imageLink, title, description, state} = artwork

        return (
            <Col s={3}>
                <Card className='small'
                    header={<CardTitle image={imageLink}>{title}</CardTitle>}
                    actions={[<a onClick={() => {
                    }}>See details</a>]}>
                    {auctionState}
                </Card>
            </Col>
        )
    }
}

export default AuctionCell;