// Libraries
import React, {Component} from 'react'
import {Row, Col, Button, CardPanel, Icon} from 'react-materialize'
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

export default class Portfolio extends Component {

    constructor(props) {
        super(props)

        this.state = {
            artworks: []
        }
    }

    componentWillMount() {
        this
            .getPortfolio()
            .then(function (portfolio) {
                const darticlesInstance = this.props.darticlesInstance
                const web3 = this.props.web3

                return Promise.all(portfolio.map((id) => darticlesInstance.getArtworkWithID.call(id, {from: this.props.defaultAccount})))
                // console.log(portfolio)
            }.bind(this))
            .then(function (artworks) {
                const web3 = this.props.web3

                var i = 0
                const dicts = artworks.map((artwork) => {
                    const imageID = artwork[2]

                    const imageLink = "/ipfs/" + artwork[2]
                    const title = web3.toUtf8(artwork[3])
                    const description = web3.toUtf8(artwork[4])
                    const state = web3.toUtf8(artwork[5])
                    const id = artwork[6]

                    return ({id, imageLink, title, description, state})
                })

                console.log(dicts)
                this.setState({
                    ...this.state,
                    artworks: dicts,
                    ready: true
                })
            }.bind(this))
            .catch((error) => {
                console.log(error)
            })
            // this.loadSampleArtwork()
    }

    async getPortfolio() {
        return this
            .props
            .darticlesInstance
            .getPortfolio
            .call({from: this.props.defaultAccount})
    }

    artworkCellPressed(artworkID) {
        document.location.href = '/portfolio/' + artworkID.toString()
    }

    newArtworkCellPressed(event) {
        document.location.href = "/portfolio/new"
    }

    render() {
        const artworkCells = this
            .state
            .artworks
            .map((artworkItem, index) => {
                return (<ArtworkCell
                    artwork={artworkItem}
                    key={index}
                    onClick={this
                    .artworkCellPressed
                    .bind(this)}/>)
            })

        const addNewArtworkCell = (<ArtworkCell
            artwork={{
            imageLink: "http://www.endlessicons.com/wp-content/uploads/2012/12/add-icon-614x460.png",
            title: "Add new"
        }}
            onClick={this
            .newArtworkCellPressed
            .bind(this)}/>)

        return (
            <div style={{
                margin: "20px"
            }}>
                <Row>
                    {artworkCells}
                </Row>
                <Button
                    waves='light'
                    onClick={this
                    .newArtworkCellPressed
                    .bind(this)}>
                    <Icon left>add</Icon>Add New Artwork</Button>
            </div>
        )
    }

}