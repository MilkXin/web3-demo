import { Buffer } from 'buffer';
import { ExternalProvider } from '@ethersproject/providers';

interface EthereumProvider extends ExternalProvider {
  on(event: 'accountsChanged', callback: (accounts: string[]) => void): void;
  on(event: 'chainChanged', callback: (chainId: string) => void): void;
  removeListener(event: 'accountsChanged', callback: (accounts: string[]) => void): void;
  removeListener(event: 'chainChanged', callback: (chainId: string) => void): void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    Buffer: typeof Buffer;
  }
} 