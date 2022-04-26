require("@nomiclabs/hardhat-waffle");
import {link_id,Private_Key} from '../configuration'

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key




module.exports = {
  solidity: "0.8.4",
  networks: {
  	rinkeby: {
  		url: link_id,
  		accounts: [`0x${Private_Key}`]
  	}
  }
};