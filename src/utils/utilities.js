import * as ethUtil from 'ethereumjs-util';
import { ethers } from 'ethers';

const utf8ToHex = (str) => {
  const bytes = ethers.utils.toUtf8Bytes(str);
  const hex = ethers.utils.hexlify(bytes);
  return hex;
};

const toUint8Array = (hex) => {
  if (hex.startsWith('0x')) {
    hex = hex.slice(2);
  }
  const uint8Array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    uint8Array[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return uint8Array;
};

export function encodePersonalMessage(msg) {
  const utf8Message = `\u0019Ethereum Signed Message:\n${msg.length}${msg}`;
  const hexMessage = utf8ToHex(utf8Message);
  const uint8ArrayMessage = toUint8Array(hexMessage);
  return ethUtil.bufferToHex(ethUtil.keccak256(uint8ArrayMessage));
}

export function hashMessage(msg) {
  const encodedMessage = encodePersonalMessage(msg);
  const uint8ArrayMessage = toUint8Array(encodedMessage);
  const hash = ethUtil.keccak256(uint8ArrayMessage);
  return ethUtil.bufferToHex(hash);
}
