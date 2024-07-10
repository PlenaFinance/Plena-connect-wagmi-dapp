import { Contract, utils } from 'ethers';

// Define the specification for the EIP-1271 signature verification
const spec = {
  magicValue: '0x1626ba7e',
  abi: [
    {
      constant: true,
      inputs: [
        {
          name: '_hash',
          type: 'bytes32',
        },
        {
          name: '_sig',
          type: 'bytes',
        },
      ],
      name: 'isValidSignature',
      outputs: [
        {
          name: 'magicValue',
          type: 'bytes4',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ],
};

/**
 * Verifies if a signature is valid according to EIP-1271
 * @param {string} address - The address of the contract implementing EIP-1271
 * @param {string} sig - The signature to verify
 * @param {string|Uint8Array} data - The data that was signed
 * @param {ethers.providers.Provider} provider - The ethers.js provider
 * @param {Array} abi - The ABI of the contract (default: EIP-1271 spec ABI)
 * @param {string} magicValue - The expected magic value for a valid signature (default: EIP-1271 spec magic value)
 * @returns {Promise<boolean>} - Returns true if the signature is valid, false otherwise
 */
async function isValidSignature(
  address,
  sig,
  data,
  provider,
  abi = spec.abi,
  magicValue = spec.magicValue
) {
  let returnValue;
  try {
    // Create a contract instance with the provided address, ABI, and provider
    const contract = new Contract(address, abi, provider);

    // Convert data to bytes array if it's not already in that format
    const dataArray = utils.arrayify(data);

    // Call the isValidSignature function on the contract
    returnValue = await contract.isValidSignature(dataArray, sig);
  } catch (e) {
    console.error('Error calling isValidSignature:', e);
    return false;
  }

  // Compare the returned value with the expected magic value
  return returnValue.toLowerCase() === magicValue.toLowerCase();
}

// Export the spec and isValidSignature function as part of eip1271 object
export const eip1271 = {
  spec,
  isValidSignature,
};
