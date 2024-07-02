import React, { useMemo } from 'react';
import { Modal, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { shortAddress } from '../utils/shortAddress';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export default function SendTxnModal({
  isModalOpen,
  onCancel,
  pendingRequest = false,
  result = {},
}) {
  return (
    <Modal
      open={isModalOpen}
      onCancel={onCancel}
      maskClosable
      destroyOnClose
      footer={null}
      centered>
      <div className='flex flex-col items-center justify-center mt-4'>
        {pendingRequest ? (
          <>
            <p className='font-bold text-xl text-black-500'>Pending Request</p>
            <Spin indicator={antIcon} />
            <p className='font-medium text-lg text-gray-500'>
              Accept or Reject request using your wallet
            </p>
          </>
        ) : result ? (
          <>
            <p className='font-bold text-xl text-black-500'>Request Approved</p>
            <div className='w-full'>
              <div className='flex items-center'>
                <p className='text-base font-bold w-20'>method:</p>
                <p className='text-md font-ligh'>{result?.method}</p>
              </div>
              <div className='flex items-center'>
                <p className='text-base font-bold w-20'>txn Hash:</p>
                <p className='text-md font-ligh'>
                  {shortAddress(result?.txHash, 8)}
                </p>
              </div>
              <div className='flex items-center'>
                <p className='text-base font-bold w-20 '>From:</p>
                <p className='text-sm font-ligh'>{result?.from}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className='font-bold text-3xl text-black-500'>
              Request Rejected
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}