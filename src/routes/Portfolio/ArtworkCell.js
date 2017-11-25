import React, {Component} from 'react'
import {Col, Card, CardTitle} from 'react-materialize'

export default class ArtworkCell extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {artwork} = this.props
        const {id, imageLink, title, subtitle} = artwork

        return (
            <Col s={3}>
            <Card className='medium'
	              header={<CardTitle image={imageLink}>{title}</CardTitle>}
	              actions={[<a onClick={() => {
                    this
                        .props
                        .onClick(this.props.artwork.id)
                }}>Detail</a>]}>
                  <div className="card-content">
                  {subtitle}
                  </div>
            </Card>

                {/* <div
                    className="card"
                    onClick={() => {
                    this
                        .props
                        .onClick(this.props.artwork.id)
                }}>
                    <div className="img-container">
                        <img className="full-width-image" src={imageLink}/>
                    </div>

                    <div className="card-text">
                        <p className="big">{title}</p>
                        <p className="small">{subtitle}</p>
                    </div>
                </div> */}

            </Col>
        )
    }

}