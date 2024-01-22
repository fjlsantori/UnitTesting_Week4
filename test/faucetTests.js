const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');

describe('Faucet', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    let withdrawAmount = ethers.parseUnits("0.5", "ether");

    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy();

    const [owner,owner1] = await ethers.getSigners();

    console.log('Signer 1 address: ', owner.address);
    return { faucet, owner, withdrawAmount };
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });
  it('should not allow withdrawals above .1 ETH at a time', async function () {
    const { faucet, withdrawAmount } = await loadFixture(deployContractAndSetVariables);

    await expect(faucet.withdraw(withdrawAmount,{ value: withdrawAmount })).to.be.reverted;
  });
  it('only the owner should call the  withdrawall function', async function () {
    const { faucet, owner1 } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.connect(owner1).withdrawall()).to.be.reverted;
  });
});