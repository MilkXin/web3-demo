import { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Input,
  useToast,
  extendTheme,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { getBalance, sendTransaction, getTransactionHistory } from './utils/web3';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: ethers.BigNumber;
}

const theme = extendTheme({});

// 支持的网络 ID
const SUPPORTED_NETWORKS = {
  1: 'Ethereum Mainnet',
  5: 'Goerli Testnet',
  11155111: 'Sepolia Testnet',
};

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const toast = useToast();

  // 检查网络
  const checkNetwork = async (provider: ethers.providers.Web3Provider) => {
    const network = await provider.getNetwork();
    const networkId = network.chainId;
    
    if (!SUPPORTED_NETWORKS[networkId as keyof typeof SUPPORTED_NETWORKS]) {
      throw new Error(`不支持的网络。请切换到以下网络之一：${Object.values(SUPPORTED_NETWORKS).join(', ')}`);
    }
  };

  // 连接钱包
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('请安装 MetaMask!');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // 请求连接钱包
      await provider.send('eth_requestAccounts', []);
      
      // 检查网络
      await checkNetwork(provider);
      
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      
      // 监听账户变化
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      // 监听网络变化
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      
      toast({
        title: '连接成功',
        description: `已连接到账户: ${address.slice(0, 6)}...${address.slice(-4)}`,
        status: 'success',
        duration: 3000,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast({
        title: '连接失败',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      });
    }
  };

  // 断开连接
  const disconnectWallet = () => {
    setAccount(null);
    setBalance('0');
    setTransactions([]);
    
    // 移除事件监听器
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', () => {});
      window.ethereum.removeListener('chainChanged', () => {});
    }
    
    toast({
      title: '已断开连接',
      status: 'info',
      duration: 3000,
    });
  };

  // 发送交易
  const handleSendTransaction = async () => {
    try {
      if (!ethers.utils.isAddress(recipientAddress)) {
        throw new Error('无效的接收地址');
      }

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('无效的金额');
      }

      const tx = await sendTransaction(recipientAddress, amount);
      toast({
        title: '交易已发送',
        description: `交易哈希: ${tx.hash}`,
        status: 'success',
        duration: 5000,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast({
        title: '交易失败',
        description: errorMessage,
        status: 'error',
        duration: 3000,
      });
    }
  };

  // 获取余额和交易历史
  useEffect(() => {
    if (account) {
      const fetchData = async () => {
        try {
          const balance = await getBalance(account);
          setBalance(balance);
          const history = await getTransactionHistory(account);
          setTransactions(history as Transaction[]);
        } catch (error) {
          console.error('获取数据失败:', error);
          toast({
            title: '数据获取失败',
            description: '无法获取余额或交易历史',
            status: 'error',
            duration: 3000,
          });
        }
      };
      fetchData();
    }
  }, [account, toast]);

  return (
    <ChakraProvider theme={theme}>
      <Box p={8}>
        <VStack spacing={8} align="stretch">
          <Heading>Web3 演示</Heading>
          
          {!account ? (
            <Button colorScheme="blue" onClick={connectWallet}>
              连接 MetaMask
            </Button>
          ) : (
            <>
              <Box>
                <Text>当前账户: {account}</Text>
                <Text>余额: {balance} ETH</Text>
                <Button colorScheme="red" onClick={disconnectWallet} mt={4}>
                  断开连接
                </Button>
              </Box>

              <Box>
                <Heading size="md">发送交易</Heading>
                <Input
                  placeholder="接收地址"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  mt={2}
                />
                <Input
                  placeholder="金额 (ETH)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  mt={2}
                />
                <Button colorScheme="green" onClick={handleSendTransaction} mt={4}>
                  发送
                </Button>
              </Box>

              <Box>
                <Heading size="md">交易历史</Heading>
                {transactions.map((tx, index) => (
                  <Box key={index} p={4} borderWidth={1} borderRadius="md" mt={2}>
                    <Text>交易哈希: {tx.hash}</Text>
                    <Text>发送方: {tx.from}</Text>
                    <Text>接收方: {tx.to}</Text>
                    <Text>金额: {ethers.utils.formatEther(tx.value)} ETH</Text>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
