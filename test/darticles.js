const Darticles = artifacts.require('./Darticles.sol')

contract('Darticles', (accounts) => {

    it('Should set profile without crashing', async function() {
        const darticlesInstance = await Darticles.deployed()
        const sampleProfileImage = "haaseiondq2189e31"
        const firstName = "Fernando"
        const lastName = "Ortiz"
        const nickName = "fmo91"
        await darticlesInstance.setProfile.call(sampleProfileImage, firstName, lastName, nickName, {from: accounts[0]})
        assert.equal(true, true, "It should work")
    })

    it('Should return a profile', async function() {
        const darticlesInstance = await Darticles.deployed()
        const profile = await darticlesInstance.getProfile.call(accounts[0])
        const profileIsNotNull = profile !== undefined
        assert.equal(profileIsNotNull, true, "Profile should not be undefined")
    })

    it('Should add an artwork without crashing', async function() {
        const darticlesInstance = await Darticles.deployed()
        const imageLink = "haaseiondq2189e31"
        const title = "The best artwork"
        const description = "Digital photography"
        await darticlesInstance.addArtwork(imageLink, title, description, { from: accounts[0] })
        assert(true, true, "It should work")
    })
    
})