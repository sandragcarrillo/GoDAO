import { useEffect, useState } from "react";
import styled from "styled-components";
import { InjectedConnector } from '@web3-react/injected-connector';
import { useWeb3React } from "@web3-react/core";
import Notifications from "../../pages/notifications";

interface NwMappingType {
  [key: number]: string;
}

const NETWORK_MAPPING: NwMappingType = {
  1: 'ETH_MAIN_NET',
  42: 'ETH_KOVAN',
  3: 'ETH_ROPSTEN',
  37: 'POLYGON_MAINNET',
  80001: 'POLYGON_MUMBAI'
};

const ConnectWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 20;

  & .account {
    font-size: 1.2rem;
    border: 1px solid green;
    border-radius: 3px;
    padding: 4px 7px;
    font-weight: 500;
    font-family: monospace;
  }

  & .network {
    margin: 5px 0;
  }
`;

const StyledButton = styled.button`
  border: 0px;
  outline: 0px;
  padding: 8px 15px;
  margin: 10px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
`;


const Connect = styled(StyledButton)`
  color: rgb(255, 255, 255);
  background: rgb(103, 76, 159);
`;

const Disconnect = styled(StyledButton)`
  color: rgb(255, 255, 255);
  background: rgb(226, 8, 128);
`;


const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ModalContent = styled.div`
  background-color: #fff;
  width: 300px;
  height: 100vh;
  padding: 20px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 30px; /* Ajusta el valor de top según tus preferencias */
  right: 10px;
  border: none;
  background-color: transparent;
  font-size: 16px;
  cursor: pointer;
`;

const ConnectButton = () => {
  const { active, account, activate, deactivate, chainId } = useWeb3React();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebarToggle = () => {
    setShowSidebar(!showSidebar);
  };

  const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 37, 80001],
  });

  async function connect() {
    try {
      await activate(injected);
      localStorage.setItem('isWalletConnected', 'true');
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.setItem('isWalletConnected', 'false');
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        try {
          await activate(injected);
          localStorage.setItem('isWalletConnected', 'true');
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, []);

  return (
    <ConnectWrapper>
      {active ? (
        <>
          <p>Connected with <span className="account">{account?.substring(0, 4)}...{account?.slice(-4)}</span></p>
          {chainId ? <p className="network">{NETWORK_MAPPING[chainId]}</p> : null}
          <StyledButton onClick={handleSidebarToggle}> <svg width="18" height="18" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.1336 11C18.7155 16.3755 21 18 21 18H3C3 18 6 15.8667 6 8.4C6 6.70261 6.63214 5.07475 7.75736 3.87452C8.88258 2.67428 10.4087 2 12 2C12.3373 2 12.6717 2.0303 13 2.08949" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg> </StyledButton>
          <Disconnect onClick={disconnect}>Disconnect wallet</Disconnect>
          {showSidebar && (
            <ModalOverlay>
              <ModalContent>
                <CloseButton onClick={handleSidebarToggle}>X</CloseButton>
                <Notifications />
              </ModalContent>
            </ModalOverlay>
          )}
        </>
      ) : (
        <Connect onClick={connect}>Connect to MetaMask</Connect>
      )}
    </ConnectWrapper>
  );
};

export default ConnectButton;