import { keccak256 } from 'ethers/lib/utils';

// Function to encode the personal message
export function encodePersonalMessage(msg) {
  const prefix = `\u0019Ethereum Signed Message:\n${msg.length}`;
  const utf8Message = prefix + msg;
  const uint8ArrayMessage = new TextEncoder().encode(utf8Message);
  return keccak256(uint8ArrayMessage);
}

// Function to hash a message using Keccak256
export function hashMessage(msg) {
  const encodedMessage = encodePersonalMessage(msg);
  return keccak256(encodedMessage);
}
