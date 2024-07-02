export const shortAddress = (txnHash, length = 4) => {
    return `${txnHash?.substr(0, length)}....${txnHash?.substr(
      txnHash?.length - length,
      txnHash?.length - 1
    )}`;
  };