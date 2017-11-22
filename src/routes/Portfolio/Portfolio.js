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
import getWeb3 from '../../utils/getWeb3'
import promisify from '../../utils/promisify'

// CSS Styles
import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import '../css/root.css'
// import { read } from '../../../../../../Library/Caches/typescript/2.6/node_modules/@types/graceful-fs';

export default class Portfolio extends Component {

    constructor(props) {
        super(props)

        this.state = {
            artwork: []
        }
    }

    componentWillMount() {
        this.initialize().then(() => {
            return this.getPortfolio()
        })
        .then((portfolio) => {
            const darticlesInstance = this.state.darticlesInstance
            return Promise.all((portfolio[0].map((item) => item.c[0])).map((id) => darticlesInstance.getArtworkWithID.call(id, { from : this.state.defaultAccount })))
            // console.log(portfolio)
        })
        .then((artworks) => {
            console.log(artworks)
            // this.setState({
            //     ...this.state,
            //     ready : true,
            // })    
        })
        .catch((error) => {
            console.log(error)
        })
        this.loadSampleArtwork()
    }

    async getPortfolio() {
        return this.state.darticlesInstance.getPortfolio.call({ from : this.state.defaultAccount })
    }

    async initialize() {
        const { web3 } = await getWeb3
    
        // Create voting entity from contract abi
        const darticles = Contract(Darticles)
        darticles.setProvider(web3.currentProvider)
    
        const accounts = await promisify(web3.eth.getAccounts)
        const defaultAccount = accounts[0]
    
        const darticlesInstance = await darticles.deployed()
    
        this.setState({
            ...this.state,
            web3,
            defaultAccount,
            darticlesInstance,
        })
    }

    loadSampleArtwork() {
        this.setState({
            ...this.state,
            artwork: [
                { 
                    imageLink   : "https://i.pinimg.com/originals/02/f9/12/02f912e15e0417739cb7ab903681862d.jpg", 
                    title       : "The lion",
                },
                { 
                    imageLink   : "https://i.pinimg.com/736x/e0/3b/d0/e03bd0c4c05e76ae8605462336b40e7a--graphic-design-studios-art-design.jpg", 
                    title       : "The head",
                },
                { 
                    imageLink   : "https://i.pinimg.com/originals/8d/1a/fd/8d1afdf0c54bb93d11d553306c03cd34.jpg", 
                    title       : "The bird",
                },
                { 
                    imageLink   : "https://www.classboat.com/AdminImages/SubCategory/078907Digital-Art.jpg", 
                    title       : "The planet",
                },
                { 
                    imageLink   : "https://www.demilked.com/magazine/wp-content/uploads/2017/07/pop-culture-digital-art-filip-hodas-11.jpg", 
                    title       : "The pacman",
                },
            ],
        })
    }

    artworkCellPressed(event) {
        alert("Does it work?")
    }

    newArtworkCellPressed(event) {
        document.location.href = "/portfolio/new"
    }

    render() {
        const artworkCells = this.state.artwork.map((artworkItem, index) => {
            return (
                <ArtworkCell artwork={artworkItem} key={index} onClick={this.artworkCellPressed.bind(this)} />
            )
        })

        const addNewArtworkCell = (
            <ArtworkCell 
                artwork={
                    { 
                        imageLink   : "http://www.endlessicons.com/wp-content/uploads/2012/12/add-icon-614x460.png", 
                        title       : "Add new",
                    }
                } 
                onClick={this.newArtworkCellPressed.bind(this)} 
            />
        )

        return (
            <div className="App">
                <NavigationBar/>
                <main className="container">
                    <h1>Portfolio</h1>
                    { artworkCells }
                    { addNewArtworkCell }
                </main>
            </div>
        )
    }

}