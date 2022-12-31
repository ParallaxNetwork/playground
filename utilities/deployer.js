import { ContractFactory } from 'ethers';
import { PGCORE_ABI } from './PGCoreABI';


export const deployer = async ({
    account,
    ...props
}) => {
    console.log(...props)
    const factory = new ContractFactory(PGCORE_ABI.abi, PGCORE_ABI.bytecode, account);
    const contract = await factory.deploy(...props)
    console.log(contract.address);
    console.log(contract.deployTransaction);
    return contract;
}

