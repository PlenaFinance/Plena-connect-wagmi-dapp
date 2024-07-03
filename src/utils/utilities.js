import * as ethUtil from 'ethereumjs-util';
import { ethers } from 'ethers';

const utf8ToHex = (str) => {
  const bytes = ethers.utils.toUtf8Bytes(str);
  const hex = ethers.utils.hexlify(bytes);
  return hex;
};

export function encodePersonalMessage(msg) {
  const data = ethUtil.toBuffer(utf8ToHex(msg));
  const buf = Buffer.concat([
    Buffer.from(
      '\u0019Ethereum Signed Message:\n' + data.length.toString(),
      'utf8'
    ),
    data,
  ]);
  return ethUtil.bufferToHex(buf);
}

export function hashMessage(msg) {
  const data = encodePersonalMessage(msg);
  const buf = ethUtil.toBuffer(data);
  const hash = ethUtil.keccak256(buf);
  return ethUtil.bufferToHex(hash);
}