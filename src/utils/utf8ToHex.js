export const utf8ToHex = (str) => {
    const encoder = new TextEncoder();
    const utf8Array = encoder.encode(str);
    let hex = '';
    for (let i = 0; i < utf8Array.length; i++) {
      hex += utf8Array[i].toString(16).padStart(2, '0');
    }
    return `0x${hex}`;
  };
  