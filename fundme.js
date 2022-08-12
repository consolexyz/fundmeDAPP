
 import {ethers} from "./ethers-5.6.esm.min.js";
 import {abi , contractAddress} from "./constants.js";


const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const withdrawButton = document.getElementById("withdrawButton");
const getBalanceButton= document.getElementById("getBalanceButton");

connectButton.onclick= connect;
fundButton.onclick = fund;
getBalanceButton.onclick = balance;
withdrawButton.onclick = withdraw;


async function connect() {

if(typeof window.ethereum !== "undefined"){
     console.log("i see a metamask")

   await window.ethereum.request({method: "eth_requestAccounts"});
   document.getElementById("connectButton").innerHTML="Connected!";
}else{
    document.getElementById("connectButton").innerHTML="Please install meta mask";
}

};

async function withdraw() {
  console.log(`Withdrawing...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
    } catch (error) {
      console.log(error)
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask"
  }
}


async function fund(){
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding with ${ethAmount}`)
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum); // get rpc provider from metamask 
        const signer = provider.getSigner() // GET WALLET CONNCETED 
        const contract = new ethers.Contract(contractAddress, abi , signer)
        try{
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount)
            })
            await listenForTransactionMine(transactionResponse, provider)
        }catch (error){
            console.log(error)
        }
        
    }
}
  



async function balance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    try {
      const balance = await provider.getBalance(contractAddress)
      console.log(ethers.utils.formatEther(balance))
    } catch (error) {
      console.log(error)
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask"
  }
}


function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations. `
        )
        resolve()
      })
    })
  }


