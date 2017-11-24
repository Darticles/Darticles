import React, { Component } from 'react'

import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import './css/ArtworkCell.css'

export default class ArtworkCell extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { artwork } = this.props
        const { imageLink, title, subtitle } = artwork

        return (
            <div className="pure-u-1-4" onClick={this.props.onClick}>
                <div className="card">
                    <div className="img-container">
                        <img className="full-width-image" src={imageLink} />
                    </div>
                    
                    <div className="card-text">
                        <p className="big">{title}</p>
                        <p className="small">{subtitle}</p>
                    </div>
                </div>
            </div>
        )
    }

}