/* pages/create-nft.js */
import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {marketplaceAddress} from '../configuration'
import NFTMarketplace from '../artifacts/contracts/NFT.sol/NFTMarketplace.json'

const CreateItem=()=> {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
      console.log(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* next, create the item */
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.createToken(url, price, { value: listingPrice })
    await transaction.wait()
   
    router.push('/')
  }

  return (
    <div className="mx-64 my-32">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-bold mb-2" >
          Asset Name
          </label>
          <input 
          placeholder="Asset Name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          />   
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-bold mb-2" >
            Asset Description
          </label>
          <textarea
          placeholder="Asset Description"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-bold mb-2" >
             Asset Price in Eth
          </label>
          <input
          placeholder="Asset Price in Eth"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
          />
        </div>
          
        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-bold mb-2" >
            Add a file
          </label>
          <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
          />
          {
          fileUrl && (<img className="rounded mt-4" width="350" src={fileUrl} />)
          }
        </div>
        
        <button onClick={listNFTForSale} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ">
          Create NFT
        </button>
      </div>
    </div>
  )}


export default CreateItem


