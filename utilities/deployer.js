import { ContractFactory } from 'ethers';
import { keyABI } from './keyABI'


export const deployer = async ({
    account,
    ...props
}) => {

    const factory = new ContractFactory(keyABI.abi, keyABI.bytecode, account);
    const contract = await factory.deploy(...props)
    console.log(contract.address);
    console.log(contract.deployTransaction);
    return contract;
}