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
    
    it('Should start an auction correctly', async function() {
        const darticlesInstance = await Darticles.deployed()
        const defaultAccount = accounts[0]

        const imageLink1 = "QmeJm6RxCRWZ345otwhCzCjVsqVbUJ6XhCD3QJa2agwoPj"
        const title1 = "Title"
        const description1 = "Description"
        await darticlesInstance.addArtwork(imageLink1, title1, description1, { from: defaultAccount })
        const _artworkID = 0
        const _initialPrice = 10000
        const _endTimestamp = 0
        await darticlesInstance.startAuction(_artworkID, _initialPrice, _endTimestamp, { from: defaultAccount })
        const activeAuctions = await darticlesInstance.getActiveAuctions.call({ from: defaultAccount })
        const auctionID = 0

        assert.equal(auctionID, activeAuctions[0], "Auction ids don't start from 0")

        const auction = await darticlesInstance.getAuctionWithID.call(auctionID, { from: defaultAccount })
        
        const owner = auction[0]
        const artworkID = auction[1]
        const initialPrice = auction[2]
        const endTimestamp = auction[3]
        const state = web3.toUtf8(auction[4])

        assert.equal(owner, defaultAccount, "The owner is not the default account")
        assert.equal(_artworkID, artworkID, "The auction is not 0")
        assert.equal(_initialPrice, initialPrice, "Ths initial price has not been set")
        assert.equal(_endTimestamp, endTimestamp, "Ths end timestamp has not been set")
        assert.equal(state, "Active", "The auction does not start Active")
    })

    it('Should add bids correctly', async function() {
        const darticlesInstance = await Darticles.deployed()
        const defaultAccount = accounts[0]
        const otherAccount = accounts[1]

        const imageLink1 = "QmeJm6RxCRWZ345otwhCzCjVsqVbUJ6XhCD3QJa2agwoPj"
        const title1 = "Title"
        const description1 = "Description"
        await darticlesInstance.addArtwork(imageLink1, title1, description1, { from: defaultAccount })
        const _artworkID = 0
        const _initialPrice = 10000
        const _endTimestamp = 0
        await darticlesInstance.startAuction(_artworkID, _initialPrice, _endTimestamp, { from: defaultAccount })
        const activeAuctions = await darticlesInstance.getActiveAuctions.call({ from: defaultAccount })
        const auctionID = 0


        // -- BID 1 --

        const bid1 = web3.toWei('0.1', 'ether')
        await darticlesInstance.makeBid(auctionID, { from: defaultAccount, value: bid1 })
        const currentBidAt1 = await darticlesInstance.getCurrentBidForAuctionWithID.call(auctionID, { from: defaultAccount })
        
        const sender1 = currentBidAt1[0]
        const value1 = new web3.BigNumber(currentBidAt1[1])

        assert.equal(sender1, defaultAccount, "The first bid is not being stored correctly. Addresses do not match")
        assert.equal(value1, bid1, "The first bid is not being stored correctly. Values do not match")

        // -- BID 2 --

        const bid2 = web3.toWei('0.3', 'ether')
        await darticlesInstance.makeBid(auctionID, { from: otherAccount, value: bid2 })
        const currentBidAt2 = await darticlesInstance.getCurrentBidForAuctionWithID.call(auctionID, { from: defaultAccount })

        const sender2 = currentBidAt2[0]
        const value2 = new web3.BigNumber(currentBidAt2[1])

        assert.equal(sender2, otherAccount, "The second bid is not being stored correctly. Addresses do not match")
        assert.equal(value2, bid2, "The second bid is not being stored correctly. Values do not match")

        // -- BID 3 --

        const bid3 = web3.toWei('0.2', 'ether')
        let exception = false

        try {
            await darticlesInstance.makeBid(auctionID, { from: defaultAccount, value: bid3 })
        } catch (error) {
            exception = true
        }

        assert.equal(exception, true, "Make bid did not throw an exception")

        const currentBidAt3 = await darticlesInstance.getCurrentBidForAuctionWithID.call(auctionID, { from: defaultAccount })
        const sender3 = currentBidAt3[0]
        const value3 = new web3.BigNumber(currentBidAt3[1])

        assert.equal(sender3, otherAccount, "The third bid is not being stored correctly. Addresses do not match")
        assert.equal(value3, bid2, "The third bid is not being stored correctly. Values do not match")

        
    })

})