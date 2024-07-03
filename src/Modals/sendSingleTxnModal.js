import React from 'react';
import { Modal, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export default function TransactionModal({
  isModalOpen,
  onCancel,
  isPending,
  isConfirming,
  isConfirmed,
  transactionError,
  receiptError,
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
        {isPending ? (
          <>
            <p className='font-bold text-xl text-black-500'>Pending Transaction</p>
            <Spin indicator={antIcon} />
            <p className='font-medium text-lg text-gray-500'>
              Please confirm the transaction in your wallet.
            </p>
          </>
        ) : transactionError ? (
          <>
            <p className='font-bold text-3xl text-black-500'>Transaction Rejected</p>
            <p className='text-md font-light text-red-500'>
              {transactionError.message}
            </p>
          </>
        ) : isConfirming ? (
          <>
            <p className='font-bold text-xl text-black-500'>Transaction Confirming</p>
            <Spin indicator={antIcon} />
            <p className='font-medium text-lg text-gray-500'>
              Waiting for the transaction to be mined.
            </p>
          </>
        ) : receiptError ? (
          <>
            <p className='font-bold text-3xl text-black-500'>Receipt Error</p>
            <p className='text-md font-light text-red-500'>
              {receiptError.message}
            </p>
          </>
        ) : isConfirmed ? (
          <>
            <p className='font-bold text-xl text-black-500'>Transaction Confirmed</p>
            <div className='w-full'>
              <div className='flex items-center'>
                <p className='text-base font-bold w-20'>Method:</p>
                <p className='text-md font-light'>{result?.method}</p>
              </div>
              <div className='flex items-center'>
                <p className='text-base font-bold w-20'>Hash:</p>
                <p className='text-md font-light'>{result?.hash}</p>
              </div>
              <div className='flex items-center'>
                <p className='text-base font-bold w-20'>From:</p>
                <p className='text-xs font-light'>{result?.from}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className='font-bold text-3xl text-black-500'>
              Unknown State
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}
