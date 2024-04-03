import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect, assert } from "chai";
import { ethers } from "hardhat";

// Types
import { SimpleStorage } from "../typechain-types";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("📝 SimpleStorage Contract", function () {
    let contract: SimpleStorage;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;


    async function deployContractFixture() {
        [owner, addr1] = await ethers.getSigners();

        const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
        contract = await SimpleStorage.deploy(owner.address);
        return { contract, owner, addr1 };
    };

    // DEPLOYMENT
    describe("🚀 Deployment", function () {

        it("Should set the right owner", async function () {

            const { contract, owner } = await loadFixture(deployContractFixture);

            expect(await contract.owner()).to.equal(owner.address);
        });

        it("Should set the right initiale value", async function () {

            const { contract } = await loadFixture(deployContractFixture);

            expect(await contract.get()).to.equal(0);
        });
    });

    // GET
    describe("📖 GET", function () {

        it("Should get the right value", async function () {

            const { contract } = await loadFixture(deployContractFixture);

            await contract.set(1);
            expect(await contract.get()).to.equal(1);
        });
    });

    // SET
    describe("✏️  SET", function () {

        it("Should set the right value from owner", async function () {

            const { contract } = await loadFixture(deployContractFixture);

            await contract.set(2);
            expect(await contract.get()).to.equal(2);
        });

        it("Should set the right initiale value from another address", async function () {

            const { contract } = await loadFixture(deployContractFixture);

            contract.connect(addr1);
            await contract.set(4);
            expect(await contract.get()).to.equal(4);
        });

        it("Should emit an event when value set", async function () {

            const { contract } = await loadFixture(deployContractFixture);

            await expect(contract.set(6))
                .to.emit(contract, "valueChanged");
        });

        it("Should emit an event when value set with args", async function () {

            const { contract } = await loadFixture(deployContractFixture);

            const newValue = 6;
            const oldValue = await contract.get();

            await expect(contract.set(newValue))
                .to.emit(contract, "valueChanged")
                .withArgs(oldValue, newValue, owner.address);
        });
    });
});