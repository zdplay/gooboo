import store from "../../store";
import { redeemConfig, decryptData } from "../config/redeemConfig.js";

class RedeemCodeSystem {
  constructor() {
    this.serverUrl = redeemConfig.serverUrl;
    this.timeout = redeemConfig.timeout;
  }

  encodeNumber(num) {
    return num.toString(36);
  }

  decodeNumber(str) {
    return parseInt(str, 36);
  }

  getPlayerIdHash(playerId) {
    let hash = 0;
    for (let i = 0; i < playerId.length; i++) {
      const char = playerId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36).substring(0, 4);
  }

  generatePlayerIdHash(playerId) {
    let hash = 0;
    for (let i = 0; i < playerId.length; i++) {
      const char = playerId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  generateChecksum(playerId, type, feature, name, amount, salt) {
    const data = `${playerId}:${type}:${feature}:${name}:${amount}:${salt}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }



  async redeemCodeOnServer(code, playerId) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(this.serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          playerId: playerId
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'Server timeout', timeout: true };
      }
      return { success: false, error: error.message, timeout: false };
    }
  }

  generateCode(playerId, type, feature, name, amount) {
    try {
      if (!playerId || !type || !feature || !name || !amount || amount <= 0) {
        throw new Error('参数不完整或无效');
      }

      const typeMap = { 'currency': 'C', 'consumable': 'S' };
      const featureMap = {
        'gem': 'G', 'mining': 'M', 'village': 'V', 'horde': 'H',
        'farm': 'F', 'gallery': 'A', 'school': 'L', 'event': 'E',
        'consumable': 'S', 'card': 'D', 'treasure': 'T'
      };

      const typeCode = typeMap[type] || 'X';
      const featureCode = featureMap[feature] || 'X';

      let nameHash = 0;
      for (let i = 0; i < name.length; i++) {
        nameHash = ((nameHash << 5) - nameHash) + name.charCodeAt(i);
        nameHash = nameHash & nameHash;
      }
      const nameCode = Math.abs(nameHash).toString(36).substring(0, 3);

      const amountCode = this.encodeNumber(Math.min(amount, 1679615));

      const salt = Math.floor(Math.random() * 46656);
      const saltCode = this.encodeNumber(salt).padStart(3, '0');

      const checksum = this.generateChecksum(playerId, type, feature, name, amount, salt);
      const checksumCode = checksum.substring(0, 4);

      const code = `${typeCode}${featureCode}${nameCode}${amountCode}${saltCode}${checksumCode}`.toUpperCase();

      return code;
    } catch (error) {
      throw new Error(`生成兑换码失败: ${error.message}`);
    }
  }

  parseCode(code) {
    try {
      if (!code || typeof code !== 'string') {
        throw new Error('兑换码不能为空');
      }

      const cleanCode = code.trim().toUpperCase();

      if (cleanCode.length < 12 || cleanCode.length > 19) {
        throw new Error('兑换码长度无效');
      }

      const typeCode = cleanCode.substring(0, 1);
      const featureCode = cleanCode.substring(1, 2);
      const nameCode = cleanCode.substring(2, 5);
      const checksumCode = cleanCode.substring(cleanCode.length - 4);
      const saltCode = cleanCode.substring(cleanCode.length - 7, cleanCode.length - 4);
      const amountCode = cleanCode.substring(5, cleanCode.length - 7);


      const typeMap = { 'C': 'currency', 'S': 'consumable' };
      const featureMap = {
        'G': 'gem', 'M': 'mining', 'V': 'village', 'H': 'horde',
        'F': 'farm', 'A': 'gallery', 'L': 'school', 'E': 'event',
        'S': 'consumable', 'D': 'card', 'T': 'treasure'
      };

      const type = typeMap[typeCode];
      const feature = featureMap[featureCode];
      const amount = this.decodeNumber(amountCode);

      if (!type || !feature || !amount) {
        throw new Error('兑换码格式错误');
      }

      let matchedName = null;

      if (type === 'currency') {
        for (const [key, currency] of Object.entries(store.state.currency)) {
          if (currency.feature === feature) {
            const name = key.split('_')[1];
            let nameHash = 0;
            for (let i = 0; i < name.length; i++) {
              nameHash = ((nameHash << 5) - nameHash) + name.charCodeAt(i);
              nameHash = nameHash & nameHash;
            }
            const testNameCode = Math.abs(nameHash).toString(36).substring(0, 3);
            if (testNameCode === nameCode.toLowerCase()) {
              matchedName = name;
              break;
            }
          }
        }
      } else if (type === 'consumable') {
        for (const [key] of Object.entries(store.state.consumable)) {
          let nameHash = 0;
          for (let i = 0; i < key.length; i++) {
            nameHash = ((nameHash << 5) - nameHash) + key.charCodeAt(i);
            nameHash = nameHash & nameHash;
          }
          const testNameCode = Math.abs(nameHash).toString(36).substring(0, 3);
          if (testNameCode === nameCode.toLowerCase()) {
            matchedName = key;
            break;
          }
        }
      }

      if (!matchedName) {
        throw new Error('无法识别的物品类型');
      }

      const salt = this.decodeNumber(saltCode);

      const result = {
        type: type,
        feature: feature,
        name: matchedName,
        amount: amount,
        timestamp: Date.now(),
        salt: salt,
        checksumCode: checksumCode
      };

      if (this.debug) {
        console.log('解析兑换码:', {
          兑换码: cleanCode,
          typeCode,
          featureCode,
          nameCode,
          amountCode,
          saltCode,
          checksumCode,
          解析结果: result
        });
      }

      return result;
    } catch (error) {
      console.error('解析兑换码失败:', error);
      throw new Error(`兑换码无效: ${error.message}`);
    }
  }

  validateCode(code, currentPlayerId) {
    try {
      const data = this.parseCode(code);

      if (data.checksumCode) {
        const salt = data.salt;

        const expectedChecksum = this.generateChecksum(currentPlayerId, data.type, data.feature, data.name, data.amount, salt);
        const expectedChecksumCode = expectedChecksum.substring(0, 4);

        if (data.checksumCode.toLowerCase() !== expectedChecksumCode.toLowerCase()) {
          return {
            valid: false,
            data: null,
            error: '兑换码校验失败'
          };
        }
      }

      if (data.type === 'currency') {
        const currencyKey = `${data.feature}_${data.name}`;
        const currencyExists = !!store.state.currency[currencyKey];

        if (!currencyExists) {
          return {
            valid: false,
            data: null,
            error: '兑换码中的货币类型不存在'
          };
        }
      } else if (data.type === 'consumable') {
        const consumableExists = !!store.state.consumable[data.name];

        if (!consumableExists) {
          return {
            valid: false,
            data: null,
            error: '兑换码中的消耗品类型不存在'
          };
        }
      } else {
        return {
          valid: false,
          data: null,
          error: '兑换码中的物品类型不支持'
        };
      }

      return {
        valid: true,
        data: data,
        error: null
      };
    } catch (error) {
      return {
        valid: false,
        data: null,
        error: error.message
      };
    }
  }

  async useCode(code, currentPlayerId) {
    try {
      const result = await this.redeemCodeOnServer(code, currentPlayerId);

      if (result.timeout) {
        return {
          success: false,
          message: '服务器连接超时，请稍后重试',
          data: null
        };
      }

      if (!result.success) {
        return {
          success: false,
          message: result.error || '兑换失败',
          data: null
        };
      }

      let serverValidation;
      try {
        serverValidation = decryptData(result.encrypted);
      } catch (error) {
        return {
          success: false,
          message: '服务器响应解密失败',
          data: null
        };
      }

      const localValidation = this.validateCode(code, currentPlayerId);
      if (!localValidation.valid) {
        return {
          success: false,
          message: '验证失败：' + localValidation.error,
          data: null
        };
      }

      const localData = localValidation.data;

      if (serverValidation.amount !== localData.amount) {
        return {
          success: false,
          message: '数量验证失败，可能存在篡改',
          data: null
        };
      }

      const localPlayerIdHash = this.generatePlayerIdHash(currentPlayerId);
      if (serverValidation.playerIdHash !== localPlayerIdHash) {
        return {
          success: false,
          message: 'PlayerId验证失败，可能存在篡改',
          data: null
        };
      }

      if (localData.type === 'currency') {
        store.dispatch('currency/gain', {
          feature: localData.feature,
          name: localData.name,
          amount: localData.amount
        });
      } else if (localData.type === 'consumable') {
        store.dispatch('consumable/gain', {
          name: localData.name,
          amount: localData.amount
        });
      }

      const usedCodes = store.state.system.usedRedeemCodes || [];
      store.commit('system/updateKey', {
        key: 'usedRedeemCodes',
        value: [...usedCodes, code]
      });

      const itemDisplayName = localData.type === 'currency' ? `${localData.feature}_${localData.name}` : localData.name;
      return {
        success: true,
        message: `成功获得 ${localData.amount} ${itemDisplayName}`,
        data: localData,
        needTranslation: true
      };
    } catch (error) {
      console.error('使用兑换码失败:', error);
      return {
        success: false,
        message: `兑换失败: ${error.message}`,
        data: null
      };
    }
  }

  getAvailableItems() {
    const items = [];

    for (const [key, currency] of Object.entries(store.state.currency)) {
      items.push({
        type: 'currency',
        key: key,
        feature: currency.feature,
        name: key.split('_')[1],
        displayName: key,
        color: currency.color,
        icon: currency.icon
      });
    }

    for (const [key, consumable] of Object.entries(store.state.consumable)) {
      items.push({
        type: 'consumable',
        key: key,
        feature: 'consumable',
        name: key,
        displayName: key,
        color: consumable.color,
        icon: consumable.icon
      });
    }

    return items.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'currency' ? -1 : 1;
      }
      return a.feature.localeCompare(b.feature);
    });
  }
}

const redeemCodeSystem = new RedeemCodeSystem();

export default redeemCodeSystem;
