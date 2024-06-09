document.addEventListener('DOMContentLoaded', (event) => {
    const connectWalletButton = document.getElementById('connectWalletButton');
  
    connectWalletButton.addEventListener('click', async () => {
      if (window.ethereum) {
        try {
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          const walletAddress = accounts[0];
          alert(`Connected: ${walletAddress}`);
          // Here you can also send the wallet address to the server if needed
        } catch (error) {
          console.error(error);
        }
      } else {
        alert('MetaMask is not installed. Please install it to use this feature.');
      }
    });
  });
  