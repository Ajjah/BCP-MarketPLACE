require("@nomiclabs/hardhat-waffle");

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const Private_Key = "a6b44160d8b3ceedf2541cfa9fb748f4523e1e3801fd71e19f4760e3081b374a";



module.exports = {
  solidity: "0.8.4",
  networks: {
  	rinkeby: {
  		url: `https://rinkeby.infura.io/v3/21cbaf8465024bacb08b41095418ed1e`,
  		accounts: [`0x${Private_Key}`]
  	}
  }
};