import hardhat from 'hardhat';
const { ethers } = hardhat;

async function main() {

const ClaimFaucetFactory = await ethers.getContractFactory("ClaimFaucetFactory");
const claimFaucetFactory = await ClaimFaucetFactory.deploy();

const deployedContract = await claimFaucetFactory.waitForDeployment();

  console.log('Contract Deployed at ' + deployedContract.target);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});