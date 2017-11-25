import React, {Component} from 'react'
import {Col, Card, CardTitle} from 'react-materialize'

export default class ArtworkCell extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {artwork} = this.props
        const {id, imageLink, title, description} = artwork

        return (
            <Col s={3}>
            <Card className='small'
	              header={<CardTitle image={imageLink}>{title}</CardTitle>}
	              actions={[<a onClick={() => {
                    this
                        .props
                        .onClick(this.props.artwork.id)
                }}>Show Artwork Detail</a>]}>
                  {description}
            </Card>
            </Col>
        )
    }

}