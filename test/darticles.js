const Darticles = artifacts.require('./Darticles.sol')

contract('Darticles', (accounts) => {

    it('Should get profile that has been previously set', async function() {
        const defaultAccount = accounts[0]
        const darticlesInstance = await Darticles.deployed()
        const _profileImage = "QmeJm6RxCRWZ345otwhCzCjVsqVbUJ6XhCD3QJa2agwoPj"
        const _firstName = "Fernando"
        const _lastName = "Ortiz"
        const _nickName = "ferortiz"

        await darticlesInstance.setProfile(_profileImage, _firstName, _lastName, _nickName, {from: defaultAccount})

        const profile = await darticlesInstance.getProfile.call({from: defaultAccount})

        const profileImage  = profile[0]
        const firstName     = web3.toUtf8(profile[1])
        const lastName      = web3.toUtf8(profile[2])
        const nickName      = web3.toUtf8(profile[3])

        assert.equal(profileImage, _profileImage, "The profile image was saved incorrectly")
        assert.equal(firstName, _firstName, "The first name was saved incorrectly")
        assert.equal(lastName, _lastName, "The last name was saved incorrectly")
        assert.equal(nickName, _nickName, "The nick name was saved incorrectly")
    })

    it('Should get an artwork that I have added', async function() {
        const darticlesInstance = await Darticles.deployed()
        const defaultAccount = accounts[0]

        const imageLink1 = "QmeJm6RxCRWZ345otwhCzCjVsqVbUJ6XhCD3QJa2agwoPj"
        const title1 = "Title"
        const description1 = "Description"
        await darticlesInstance.addArtwork(imageLink1, title1, description1, { from: defaultAccount })

        const portfolio = await darticlesInstance.getPortfolio.call({from: defaultAccount})
        const ids = portfolio.map((id) => new web3.BigNumber(id))
    
        assert.equal(ids.length, 1, "An artwork should has been added")
        assert.equal(ids[0], 0, "Artwork ids should start by 0")

        const artworksInBytes32 = await Promise.all(ids.map((id) => darticlesInstance.getArtworkWithID.call(id, { from: defaultAccount })))

        assert.equal(artworksInBytes32.length, 1, "There  one only artwork")

        const artwork = artworksInBytes32[0]

        const creator       = artwork[0]
        const owner         = artwork[1]
        const imageLink     = artwork[2]
        const title         = web3.toUtf8(artwork[3])
        const description   = web3.toUtf8(artwork[4])

        assert.equal(creator, defaultAccount, "The creator is not the default account")
        assert.equal(owner, defaultAccount, "The owner is not the default account")
        assert.equal(imageLink, imageLink1, "The image link was saved incorrectly")
        assert.equal(title, title1, "The title was saved incorrectly")
        assert.equal(description, description1, "The description was saved incorrectly")
    })
    
})