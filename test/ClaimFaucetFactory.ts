import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Message Test", function () {

    const tokenInfo = {
        name: "Valora Token",
        symbol: "VTK"
    }
    const tokenInfo2 = {
        name: "DLT Token",
        symbol: "DTK"
    }

   
    async function deployClaimFaucetFactoryFixture(){

    
        const [firstAcct, otherAccount] = await hre.ethers.getSigners();

        const ClaimFaucetFactory = await hre.ethers.getContractFactory("ClaimFaucetFactory");
        const claimFaucetFactory = await ClaimFaucetFactory.deploy();

        return {claimFaucetFactory, firstAcct, otherAccount}
    }

    describe("deployment", () => {
        it("should check if it deployed", async function () {
            const {claimFaucetFactory, firstAcct} = await loadFixture(deployClaimFaucetFactoryFixture);

            expect(await claimFaucetFactory).not.equal(undefined);
        });
    })
    describe("Functions", () => {
        it("should check if it deployed claim faucet", async function () {
            const {claimFaucetFactory, firstAcct} = await loadFixture(deployClaimFaucetFactoryFixture);

            await claimFaucetFactory.connect(firstAcct).deployClaimFaucet(tokenInfo.name, tokenInfo.symbol)

            expect(await claimFaucetFactory.getLengthOfDeployedContracts()).equal(1);
        });

        it("should check balance of an address", async function () {
            const {claimFaucetFactory, firstAcct} = await loadFixture(deployClaimFaucetFactoryFixture);

            await claimFaucetFactory.connect(firstAcct).deployClaimFaucet(tokenInfo.name, tokenInfo.symbol)

            const deployedContactInfo = await claimFaucetFactory.getUserDeployedContractByIndex(0);

            const [deployerAddress, deployedContractAddress] = deployedContactInfo

            expect(await claimFaucetFactory.connect(firstAcct).getBalanceOfAnAddress(deployedContractAddress)).to.equal(0);
        });

        it("should check if it claim faucet", async function () {
            const {claimFaucetFactory, firstAcct} = await loadFixture(deployClaimFaucetFactoryFixture);

            await claimFaucetFactory.connect(firstAcct).deployClaimFaucet(tokenInfo.name, tokenInfo.symbol)

            const deployedContactInfo = await claimFaucetFactory.getUserDeployedContractByIndex(0);

            const [deployerAddress, deployedContractAddress] = deployedContactInfo

            const initialBalance = await claimFaucetFactory.connect(firstAcct).getBalanceOfAnAddress(deployedContractAddress);

            await claimFaucetFactory.connect(firstAcct).claimFaucetFromContract(deployedContractAddress)

            expect(await claimFaucetFactory.connect(firstAcct).getBalanceOfAnAddress(deployedContractAddress) ).to.be.greaterThan(initialBalance);
        });

        it("should check info of a token", async function () {
            const {claimFaucetFactory, firstAcct} = await loadFixture(deployClaimFaucetFactoryFixture);

            await claimFaucetFactory.connect(firstAcct).deployClaimFaucet(tokenInfo.name, tokenInfo.symbol)

            const deployedContactInfo = await claimFaucetFactory.getUserDeployedContractByIndex(0);

            const [deployerAddress, deployedContractAddress] = deployedContactInfo



            expect(await claimFaucetFactory.getInfoFromContract(deployedContractAddress)).to.deep.equal([tokenInfo.name, tokenInfo.symbol]);
        });

        it("should get user deployed contract by index", async function () {
            const {claimFaucetFactory, firstAcct} = await loadFixture(deployClaimFaucetFactoryFixture);

            await claimFaucetFactory.connect(firstAcct).deployClaimFaucet(tokenInfo.name, tokenInfo.symbol)

            const deployedContactInfo = await claimFaucetFactory.getUserDeployedContractByIndex(0);

            expect(deployedContactInfo[0]).to.equal(firstAcct.address);
        });


        it("should get all contracts deployed on this platform", async function () {
            const { claimFaucetFactory, firstAcct, otherAccount} = await loadFixture(deployClaimFaucetFactoryFixture);
        
           
            await claimFaucetFactory.connect(firstAcct).deployClaimFaucet(tokenInfo.name, tokenInfo.symbol);
            await claimFaucetFactory.connect(otherAccount).deployClaimFaucet(tokenInfo2.name, tokenInfo2.symbol);
        
            
            const deployedContactInfo1 = await claimFaucetFactory.getUserDeployedContractByIndex(0);
            const deployedContactInfo2 = await claimFaucetFactory.connect(otherAccount).getUserDeployedContractByIndex(0);
        
         
            const [deployerAddress1, deployedContractAddress1] = deployedContactInfo1;
            const [deployerAddress2, deployedContractAddress2] = deployedContactInfo2;
        
         
            const allContracts = await claimFaucetFactory.getAllContractDeployed();
        
           
            expect(allContracts).to.deep.equal([
                [deployerAddress1, deployedContractAddress1 ],
                [ deployerAddress2,deployedContractAddress2 ]
            ]);
        });


        it("should get all contracts deployed by an address on this platform", async function () {
            const { claimFaucetFactory, firstAcct} = await loadFixture(deployClaimFaucetFactoryFixture);
        
           
            await claimFaucetFactory.connect(firstAcct).deployClaimFaucet(tokenInfo.name, tokenInfo.symbol);
            await claimFaucetFactory.connect(firstAcct).deployClaimFaucet(tokenInfo2.name, tokenInfo2.symbol);
        
            
            const deployedContactInfo1 = await claimFaucetFactory.connect(firstAcct).getUserDeployedContractByIndex(0);
            const deployedContactInfo2 = await claimFaucetFactory.connect(firstAcct).getUserDeployedContractByIndex(1);
        
         
            const [deployerAddress1, deployedContractAddress1] = deployedContactInfo1;
            const [deployerAddress2, deployedContractAddress2] = deployedContactInfo2;
        
         
            const allContractsByUser = await claimFaucetFactory.connect(firstAcct).getUserDeployedContracts();
        
           
            expect(allContractsByUser).to.deep.equal([
                [deployerAddress1, deployedContractAddress1 ],
                [ deployerAddress2,deployedContractAddress2 ]
            ]);
        });
        
    })


})