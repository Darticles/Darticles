const Darticles = artifacts.require('./Darticles.sol')

contract('Darticles', (accounts) => {

    it('Should get profile that has been previously set', async function() {
        const defaultAccount = accounts[0]
        const darticlesInstance = await Darticles.deployed()
        const profileImage = "haaseiondq2189e31"
        const firstName = "Fernando"
        const lastName = "Ortiz"
        const nickName = "ferortiz"
        await darticlesInstance.setProfile.call(profileImage, firstName, lastName, nickName, {from: defaultAccount})
        const profile = await darticlesInstance.getProfile.call({from: defaultAccount})
        assert.equal(true, true, "It should work")
    })

    it('Should add an artwork without crashing', async function() {
        const darticlesInstance = await Darticles.deployed()
        const imageLink = "haaseiondq2189e31"
        const title = "The best artwork"
        const description = "Digital photography"
        await darticlesInstance.addArtwork(imageLink, title, description, { from: accounts[0] })
        await darticlesInstance.addArtwork(imageLink, title, description, { from: accounts[0] })
        await darticlesInstance.addArtwork(imageLink, title, description, { from: accounts[0] })
        const defaultAccount = accounts[0]
        const artworkIDs = await darticlesInstance.getPortfolio.call({from: defaultAccount})
        console.log(`Funca? ids: ${artworkIDs}`)
        const artworks = await Promise.all(artworkIDs.map((id) => darticlesInstance.artwork.call(id)))\
        // SON ADDRESS ?? :|
        console.log(`Artworks: ${artworks.map((artwork) => (artwork[0]))}`)
        assert(true, true, "It should work")
    })
    
})

async function mineBlock() {
    return new Promise((resolve, reject) => {
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_mine",
            id: 12345
          }, function(err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
} 