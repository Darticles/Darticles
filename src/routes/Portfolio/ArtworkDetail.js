// Libraries
import React, {Component} from 'react'
import Contract from 'truffle-contract'
import classnames from 'classnames'

// Components
import NavigationBar from '../NavigationBar/NavigationBar'
import ArtworkCell from './ArtworkCell'

// Contract Abis
import Darticles from '../../../build/contracts/Darticles.json'

// Utils
import promisify from '../../utils/promisify'
import BigNumber from 'bignumber.js'

// CSS Styles
import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'

export default class ArtworkDetail extends Component {

    constructor(props) {
        super(props)
        this.state = { } 
    }

    initialize() {
        this.retrieveArtwork()
        .then(function(response) {
            const web3 = this.props.web3

            console.log(response)

            const artwork = {
                creator: response[0],
                owner: response[1],
                imageLink: "http://localhost:8080/ipfs/" + response[2],
                title: web3.toUtf8(response[3]),
                description: web3.toUtf8(response[4])
            }

            this.setState({
                ...this.state,
                artwork,
                ready: true
            })

        }.bind(this))
        .catch(function(error) {
            console.log(error)
        })
    }

    retrieveArtwork() {
        const artworkID = this.props.router.match.params.id
        if (artworkID) {
            return this
            .props
            .darticlesInstance
            .getArtworkWithID.call(artworkID, {from: this.props.defaultAccount})
        }
        else {
            throw 'No Artwork ID'
        }
    } 

    componentWillMount() {
        this.initialize()
    }

    getDetail() {
        const artwork = this.state.artwork

        return(       
            <div class="pure-g">
                <div className="pure-u-2-24"></div>
                <div className="pure-u-20-24">
                    <h2>{artwork.title}</h2>
                    <h3>{artwork.description}</h3>
                    <img src={artwork.imageLink}/>
                </div>
                <div className="pure-u-2-24"></div>
            </div>
        )
    }

    render() {
        return(
            <div>
                <h1>Artwork Detail for {this.props.router.match.params.id}</h1>
                { this.state.ready ? this.getDetail() : <div/> }
            </div>
        )
    }

}