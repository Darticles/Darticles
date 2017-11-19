import Contract from 'truffle-contract'
import Darticles from '../../build/contracts/Darticles.json'
import promisify from './promisify'

export async function getDarticlesInstance(web3) {
    // Create voting entity from contract abi
    const darticles = Contract(Darticles)
    darticles.setProvider(web3.currentProvider)
    const darticlesInstance = await darticles.deployed()
    return darticlesInstance
}

export async function getDefaultAccount(web3) {
    const accounts = await promisify(web3.eth.getAccounts)
    const defaultAccount = accounts[0]
    console.log(`The default account is ${defaultAccount}`)
    return defaultAccount
}

export async function getAuctions(web3, darticlesInstance, defaultAccount) {
    console.log(`It's about to load proposals from account ${defaultAccount}`)
    console.log(`Darticles instance address: ${darticlesInstance.address}`)
    const auctionIDs = await darticlesInstance.getAuctions.call(defaultAccount)
    const auctions = auctionIDs.map((auctionID) => darticlesInstance.auctionWithID(auctionID))
    return auctions
}

export async function getPortfolio(web3, darticlesInstance, defaultAccount) {
    console.log(`It's about to load portfolio for account ${defaultAccount}`)
    console.log(`Darticles instance address: ${darticlesInstance.address}`)
    const artworkIDs = await darticlesInstance.getArtwork.call(defaultAccount)
    const artwork = artworkIDs.map((artworkID) => darticlesInstance.auctionWithID(auctionID))
    return artwork
}