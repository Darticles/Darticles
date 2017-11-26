import React, {Component} from 'react'
import {Col, Card, CardTitle} from 'react-materialize'


import './css/AuctionCell.css'

class AuctionCell extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Col s={3}>
                <Card className='small'
                    header={<CardTitle image={"https://cdn-images-1.medium.com/max/621/1*3cd64RjjJiVuAFTEkw5-sA.png"}>Works title?</CardTitle>}
                    actions={[<a onClick={() => {
                    }}>Show Artwork Detail</a>]}>
                    It works
                </Card>
            </Col>
        )
    }
}

export default AuctionCell;