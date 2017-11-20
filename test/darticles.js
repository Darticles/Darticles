const Darticles = artifacts.require('./Darticles.sol')

contract('Darticles', async (accounts) => {
    it('should sum 1 + 1', async () => {
        const darticlesInstance = await Darticles.deployed()
        const result = 1 + 2
        assert.equal(result, 2, "The result value is not 1 + 1")
    })

    it('Should set profile without crashing', async (accounts) => {
        const darticlesInstance = await Darticles.deployed()
        const sampleProfileImage = "https://google.com/"
        const firstName = "Fernando"
        const lastName = "Ortiz"
        const nickName = "fmo91"
        await darticlesInstance.setProfile.call(accounts[0], sampleProfileImage, firstName, lastName, nickName)
        assert.equal(true, true, "It should works")
    })

    it('Should return a profile', async (accounts) => {
        const darticlesInstance = await Darticles.deployed()
        const profile = await darticlesInstance.getProfile.call(accounts[0])
        const profileIsNotNull = profile !== undefined
        assert.equal(profileIsNotNull, true, "Profile should not be undefined")
    })
})