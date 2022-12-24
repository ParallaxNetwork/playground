import {
    Multicall,
    ContractCallResults,
    ContractCallContext,
} from 'ethereum-multicall';



const doMulticall = ({
    provider
}) => {
    const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

    const contractCallContext = [
        {
            reference: 'testContract',
            contractAddress: '0x6795b15f3b16Cf8fB3E56499bbC07F6261e9b0C3',
            abi: [{ name: 'foo', type: 'function', inputs: [{ name: 'example', type: 'uint256' }], outputs: [{ name: 'amounts', type: 'uint256' }] }],
            calls: [{ reference: 'fooCall', methodName: 'foo', methodParameters: [42] }]
        },
        {
            reference: 'testContract2',
            contractAddress: '0x66BF8e2E890eA0392e158e77C6381b34E0771318',
            abi: [{ name: 'fooTwo', type: 'function', inputs: [{ name: 'example', type: 'uint256' }], outputs: [{ name: 'amounts', type: 'uint256', name: "path", "type": "address[]" }] }],
            calls: [{ reference: 'fooTwoCall', methodName: 'fooTwo', methodParameters: [42] }]
        }
    ];
}