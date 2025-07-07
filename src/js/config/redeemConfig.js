// 兑换码系统配置
export const redeemConfig = {
  serverUrl: 'https://goobooredeemvalidator.ggff.eu.org',

  timeout: 10000,
  responseEncryptionKey: 'gooboo-response-key-2024'
};

export function decryptData(encryptedData) {
  try {
    const key = redeemConfig.responseEncryptionKey;
    const encrypted = atob(encryptedData); 
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      decrypted += String.fromCharCode(charCode);
    }
    return JSON.parse(decrypted);
  } catch (error) {
    throw new Error('解密失败');
  }
}
