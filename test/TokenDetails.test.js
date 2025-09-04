const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
// const { bigint } = require("hardhat/internal/core/params/argumentTypes");


describe("MyToken", function () {
  
  async function deployFixture(){
    const Token = await ethers.getContractFactory("tokenDetails");
    const [owner,addr1,addr2] = await ethers.getSigners();
    const myToken = await Token.deploy("Nxtwave", "Nxt");
    return {myToken, owner, addr1, addr2}
  }

  // Runs ONCE after all tests in this block

  describe("Deployment and Getters", function (){
    it("should set correct name, symbol and owner", async () => {
      const {myToken , owner} = await loadFixture(deployFixture);
      expect(await myToken.name()).to.equal("Nxtwave")
      expect(await myToken.symbol()).to.equal("Nxt");
      expect(await myToken.owner()).to.equal(owner.address)
      expect(await myToken.decimals()).to.equal(18)
    });
  })
  // ---- TEST CASES ----
  it("should assign initial supply to owner", async function () {
    const {myToken, owner} = await loadFixture(deployFixture)
    const ownerBalance = await myToken.balanceOf(owner.address);
    expect(ownerBalance).to.equal(0);
  });
  describe("Transfer Function" , function(){
      it("should transfer tokens between accounts", async function () {
      const {myToken,owner,addr1,addr2} = await loadFixture(deployFixture);
      await myToken.connect(owner)._mint(addr1.address, 1000000)
      console.log("Before",await myToken.balanceOf(addr1.address))
      let beforeBalance = await myToken.balanceOf(addr1.address)
      let amount = 100;
      await myToken.connect(addr1).transfer(addr2.address, amount);
      console.log("Aefore",await myToken.balanceOf(addr1.address))
      console.log("valueeeeeee", beforeBalance);
      console.log("amoubnttttt", BigInt(amount));
      
      expect(await myToken.balanceOf(addr1.address)).to.equal(beforeBalance - ethers.parseUnits(amount.toString(),18))
    });

    it("should fail if sender does not have enough tokens", async function () {
      const {myToken,owner,addr1,addr2} = await loadFixture(deployFixture)
      await myToken.connect(owner)._mint(addr1.address,5)
      await expect(
        myToken.connect(addr1).transfer(addr2.address, 10)
      ).to.be.revertedWith("Insufficient balance");
    });

    it("should fail if to address is null", async () => {
      const {myToken,owner,addr1} = await loadFixture(deployFixture);
      await myToken.connect(owner)._mint(addr1.address,10);
      console.log(ethers.ZeroAddress);
      await expect(myToken.connect(addr1).transfer(ethers.ZeroAddress,10)).to.be.revertedWith("Invalid to address");
    })

  })
  

  describe("Mint function", function(){
    it("should mint the tokens" , async () => {
      const {myToken, owner , addr2} = await loadFixture(deployFixture);
      console.log("Valueeeeeeeeeeeee", BigInt(110));
      
      await myToken.connect(owner)._mint(addr2.address, BigInt(110));
      expect(await myToken.balanceOf(addr2)).to.equal(BigInt(110*10**18));
    })

    it("should fail if not owner", async ()=>{
      const {myToken, addr1, addr2} = await loadFixture(deployFixture);
      await expect(myToken.connect(addr2)._mint(addr1.address,90)).to.be.revertedWith("Only owner can call this function")
    })

    it("should fail if to address is null in mint", async () => {
      const {myToken,owner} = await loadFixture(deployFixture);
      await expect(myToken.connect(owner)._mint(ethers.ZeroAddress,10)).to.be.revertedWith("Invalid Address");
    })
  })

  describe("Approve Function", function (){
    it("should aprrove the amount for account", async () => {
      const {myToken, owner, addr1, addr2} = await loadFixture(deployFixture);
      await myToken.connect(owner)._mint(addr1.address,10)
      await myToken.connect(addr1).approve(addr2.address, 5);
      expect (await myToken.allowance(addr1.address, addr2.address)).to.equal(BigInt(5*10**18));
    })

    it("should fail if spender address in null", async () => {
      const {myToken} = await loadFixture(deployFixture);
      await expect(myToken.approve(ethers.ZeroAddress,10 )).to.be.revertedWith("Invalid to address")
    })
  })

  describe("TransferFrom function" , function(){
    it("should fail if there is insufficient allowance" , async () => {
      const {myToken, owner, addr1, addr2} = await loadFixture(deployFixture);
      await myToken.connect(owner)._mint(owner.address, 10);
      await myToken.connect(owner).approve(addr1.address, 5);
      await expect(myToken.connect(addr1).transferFrom(owner.address,addr2.address, 8)).to.be.revertedWith("Insufficient allowance");
    })

    it("should fail if owner does not have enough tokens" ,  async()=> {
      const {myToken, owner, addr1, addr2} = await loadFixture(deployFixture);
      await myToken.connect(owner)._mint(owner.address, 10);
      await myToken.connect(owner).approve(addr1.address, 15);
      await expect(myToken.connect(addr1).transferFrom(owner.address,addr2.address,15)).to.be.revertedWith("Insufficient Balance")
    })

    it("should fail if to address is invalid", async() => {
      const {myToken, owner, addr1} = await loadFixture(deployFixture);
      await myToken.connect(owner)._mint(owner.address, 10);
      await myToken.connect(owner).approve(addr1.address, 5);
      await expect(myToken.connect(addr1).transferFrom(owner,ethers.ZeroAddress, 3)).to.be.revertedWith("Invalid to address");
    })

    it("should successfully transfer tokens", async() => {
      const {myToken, owner, addr1, addr2} = await loadFixture(deployFixture);
      await myToken.connect(owner)._mint(owner.address, 10);
      await myToken.connect(owner).approve(addr1.address, 5);
      const allowanceAfterApproval = await myToken.allowance(owner.address, addr1.address);
      expect(allowanceAfterApproval).to.equal(BigInt(5) * 10n ** 18n);
      const ownerInitialBalance = await myToken.balanceOf(owner.address);
      const addr2InitialBalance = await myToken.balanceOf(addr2.address);
      await myToken.connect(addr1).transferFrom(owner.address, addr2.address, 3);
      const ownerFinalBalance = await myToken.balanceOf(owner.address);
      const addr2FinalBalance = await myToken.balanceOf(addr2.address);
      expect(ownerFinalBalance).to.equal(ownerInitialBalance - (BigInt(3) * 10n ** 18n));
      expect(addr2FinalBalance).to.equal(addr2InitialBalance + (BigInt(3) * 10n ** 18n));
      const addr1FinalAllowance = await myToken.allowance(owner.address, addr1.address);
      expect(addr1FinalAllowance).to.equal(allowanceAfterApproval - (BigInt(3) * 10n ** 18n));
    })

  })

});

