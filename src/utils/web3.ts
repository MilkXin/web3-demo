import { ethers } from 'ethers';
import { InjectedConnector } from '@web3-react/injected-connector';

// 支持的链 ID
const supportedChainIds = [1, 3, 4, 5, 42];

// MetaMask 连接器
export const injected = new InjectedConnector({
  supportedChainIds,
});

// 获取 Web3 Provider
export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  throw new Error('请安装 MetaMask!');
};

// 获取账户余额
export const getBalance = async (address: string) => {
  const provider = getProvider();
  const balance = await provider.getBalance(address);
  return ethers.utils.formatEther(balance);
};

// 发送交易
export const sendTransaction = async (to: string, amount: string) => {
  const provider = getProvider();
  const signer = provider.getSigner();
  const tx = await signer.sendTransaction({
    to,
    value: ethers.utils.parseEther(amount),
  });
  return tx;
};

// 获取交易历史
export const getTransactionHistory = async (address: string) => {
  const provider = getProvider();
  const blockNumber = await provider.getBlockNumber();
  const history: ethers.providers.TransactionResponse[] = [];
  
  // 获取最近 10 个区块的交易
  for (let i = blockNumber - 10; i <= blockNumber; i++) {
    const block = await provider.getBlock(i);
    if (block && block.transactions) {
      const transactions = block.transactions as unknown as ethers.providers.TransactionResponse[];
      const relevantTxs = transactions.filter(
        (tx) => tx.from === address || tx.to === address
      );
      history.push(...relevantTxs);
    }
  }
  
  return history;
}; 