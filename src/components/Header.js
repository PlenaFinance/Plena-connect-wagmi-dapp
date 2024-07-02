import React from 'react';
import { shortAddress } from '../utils/shortAddress';

export default function Header({ walletAddress }) {
  return (
    <div className='flex flex-col items-start justify-between px-5 py-2'>
      <div className='flex items-center'>
        <img
          src="https://cdn3d.iconscout.com/3d/premium/thumb/ethereum-coin-5533573-4623160.png"
          alt="Ethereum Icon"
          className='mr-2 w-8 h-8 rounded-full'
          style={{ backgroundColor: '#1677ff' }}
        />
        <p className=' mr-5 text-sm font-bold my-0'>
          {shortAddress(walletAddress || '', 5)}
        </p>
      </div>
    </div>
  );
}
