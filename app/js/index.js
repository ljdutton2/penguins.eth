import Web3 from "web3";
import penguinArtifact from "../../build/contracts/penguinContract.json";
import fleek from '@fleekhq/fleek-storage-js';


// Create a Javascript class to keep track of all the things
// we can do with our contract.
// Credit: https://github.com/truffle-box/webpack-box/blob/master/app/src/index.js
const App = {
    web3: null,
    account: null,
    penguinContract: null,

    start: async function () {
        // Connect to Web3 instance.
        const { web3 } = this;

        try {
            // Get contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = penguinArtifact.networks[networkId];
            this.penguinContract = new web3.eth.Contract(
                penguinArtifact.abi,
                deployedNetwork.address,
            );

            // Get accounts and refresh the balance.
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];
            this.refreshBalance();
        } catch (error) {
            console.error("Could not connect to contract or chain: ", error);
        }
    },

    refreshBalance: async function () {
        // Fetch the balanceOf method from our contract.
        const { balanceOf } = this.penguinContract.methods;

        // Fetch penguin amount by calling balanceOf in our contract.
        const balance = await balanceOf(this.account).call();

        // Update the page using jQuery.
        $('#balance').html(balance);
        $('#total-shouts').show();
        $('my-account').html(this.account);
    },

    storeMetadata: async function (name, to, message) {
        // Build the metadata.
        var metadata = {
            "name": "penguins.eth",
            "description": `penguin from ${name}`,
            "to": to,
            "message": message,
            "image": "https://ipfs.io/ipfs/QmRGhvqTPvx8kgMSLFdPaCysKvhtP5GV5MsKDmTx3v2QxT",
            "timestamp": new Date().toISOString()
        };

        // Configure the uploader.
        const uploadMetadata = {
            apiKey: '4XymEF32DK1SIQ3Qrqumpw==',
            apiSecret: 'cCMhvoPTldhrhI23a1NVPPJg40DsiUYLKGoHjH/p6Vo=',
            key: `metadata/${metadata.timestamp}.json`,
            data: JSON.stringify(metadata),
        };

        // Tell the user we're sending the penguin.
        this.setStatus("Sending penguin... please wait!");

        // Add the metadata to IPFS first, because our contract requires a
        // valid URL for the metadata address.
        const result = await fleek.upload(uploadMetadata);

        // Once the file is added, then we can send a penguin!
        this.awardItem(to, result.publicUrl);
    },

    awardItem: async function (to, metadataURL) {
        // Fetch the awardItem method from our contract.
        const { awardItem } = this.penguinContract.methods;

        // Award the penguin.
        await awardItem(to, metadataURL).send({ from: this.account });

        // Set the status and show the metadata link on IPFS.
        this.setStatus(`penguin sent! View the metadata <a href="${metadataURL}" target="_blank">here</a>.`);

        // Finally, refresh the balance (in the case where we send a penguin to ourselves!)
        this.refreshBalance();
    },

    setStatus: function (message) {
        $('#status').html(message);
    }
};

window.App = App;

// When all the HTML is loaded, run the code in the callback below.
$(document).ready(function () {
    // Detect Web3 provider.
    if (window.ethereum) {
        // use MetaMask's provider
        App.web3 = new Web3(window.ethereum);
        window.ethereum.enable(); // get permission to access accounts
    } else {
        console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",);
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        App.web3 = new Web3(
            new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
        );
    }
    // Initialize Web3 connection.
    window.App.start();

    // Capture the form submission event when it occurs.
    $("#penguin-form").submit(function (e) {
        // Run the code below instead of performing the default form submission action.
        e.preventDefault();

        // Capture form data and create metadata from the submission.
        const name = $("#from").val();
        const to = $("#to").val();
        const message = $("#message").val();

        window.App.storeMetadata(name, to, message);
    });
});