import { createContext, useContext, useEffect, useState } from 'react';
import { useSigner, useNetwork, useClient } from 'wagmi';
import { WalletService } from '@unlock-protocol/unlock-js';

import { ShowToast } from '../components/elements/Toaster';
import { Contract } from 'ethers';
import { PGSUBS_ABI } from '../../utilities/PGSubsABI';

// A context for unlock protocol, with a common functions like purchase, renew, get user's key, etc.

const UnlockContext = createContext({
    handleExtendKey: async () => {},
    handlePurchaseSubscription: async () => {}
});

const networks = {
    1: {
        unlockAddress: "0x3d5409CcE1d45233dE1D4eBDEe74b8E004abDD13",
        provider: "https://rpc.unlock-protocol.com/1"
    },
    137: {
        unlockAddress: "0xE8E5cd156f89F7bdB267EabD5C43Af3d5AF2A78f",
        provider: "https://rpc.unlock-protocol.com/137"
    },
    80001: {
        unlockAddress: "0x1FF7e338d5E582138C46044dc238543Ce555C963",
        provider: "https://rpc.unlock-protocol.com/80001"
    }
}

export const UnlockProvider = ({ children }) => {
    const { provider } = useClient();
    const { chain } = useNetwork()
    const { data: signer, isError } = useSigner();

    // Unlock protocol network config
    // const [network, setNetwork] = useState(networks[process.env.NEXT_PUBLIC_CHAIN_ID]);

    // If chain changed
    // useEffect(() => {
    //     if(chain){
    //         setNetwork(networks[chain.id])
    //     }
    // }, [chain])

    // Check if the component is mounted
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, [])

    // Extend key
    const handleExtendKey = async (lockAddress, tokenId) => {
        if (!signer) {
            return;
        }

        try {
            ShowToast({
                message: "We received your request, processing...",
            })
            setTimeout(() => {
                ShowToast({
                    message: "Please confirm your payment!",
                });
            }, 3000);

            const walletService = new WalletService(networks);
            await walletService.connect(provider, signer);

            const res = await walletService.extendKey({
                lockAddress,
                tokenId,
            });

            console.log("RES", res);

            ShowToast({
                message: "Key extended successfully!",
            })

            return {
                receipt: res,
                status: "success"
            }
        } catch (error) {
            console.log(error)
            ShowToast({
                message: "Something went wrong :(",
                state: "error",
            })
            return {
                status: "error"
            }
        }
    }

    const handlePurchaseSubscription = async (contractAddress, lockDetail) => {
        const contracts = new Contract(contractAddress, PGSUBS_ABI.abi, signer);

        let transactionResponse;
        try {
            transactionResponse = await contracts.purchaseSub({
                value: parseInt(lockDetail.price.hex.toString()).toString(),
            });

            ShowToast({
                message: "Working on it~",
            });
            setTimeout(() => {
                ShowToast({
                    message: "Waiting for confirmation..",
                });
            }, 2000);
            const receipt = await transactionResponse.wait();
            if (receipt.status == 1) {
                ShowToast({
                    message: "Subscription Purchased!",
                });
                return {
                    receipt,
                    status: "success"
                }
            }
        } catch (e) {
            console.log(e);
            return {
                status: "error",
            }
        }

    }

    return (
        <UnlockContext.Provider value={{
            handleExtendKey,
            handlePurchaseSubscription
        }}>
            {children}
        </UnlockContext.Provider>
    )
}

export const useUnlock = () => {
    return useContext(UnlockContext);
}