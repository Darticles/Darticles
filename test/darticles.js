const Darticles = artifacts.require('./Darticles.sol')

contract('Darticles', async (accounts) => {
    it('should sum 1 + 1', async () => {
        const darticlesInstance = await Darticles.deployed()
        const result = 1 + 2
        assert.equal(result, 2, "The result value is not 1 + 1")
    })
})