import axios from 'axios';
import store from "@/store";

const CLOUD_SERVERS = [
    "https://gamesaves.ggff.eu.org",
    "https://gamesaves.zding.de"
];

let currentServerIndex = 0;

const instance = axios.create({
    baseURL: CLOUD_SERVERS[currentServerIndex],
    timeout: 30000
});

instance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        if (currentServerIndex !== 0) {
            currentServerIndex = 0;
            instance.defaults.baseURL = CLOUD_SERVERS[currentServerIndex];
        }
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        const isNetworkError = !error.response || error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR';
        const hasBackupServer = currentServerIndex < CLOUD_SERVERS.length - 1;
        const shouldRetry = !originalRequest._retried && isNetworkError && hasBackupServer;

        if (shouldRetry) {
            originalRequest._retried = true;
            currentServerIndex++;
            instance.defaults.baseURL = CLOUD_SERVERS[currentServerIndex];
            try {
                const response = await instance(originalRequest);
                return response;
            } catch (retryError) {
                addCloudNotification('error', 'server_failed', retryError, '所有云存档服务器都无法访问');
                return Promise.reject(retryError);
            }
        }

        if (error.response) {
            return Promise.reject({
                ...error,
                data: error.response.data
            });
        } else {
            return Promise.reject(error);
        }
    }
);

export function getCurrentServerInfo() {
    return {
        currentServer: CLOUD_SERVERS[currentServerIndex],
        serverIndex: currentServerIndex,
        allServers: CLOUD_SERVERS,
        isUsingBackup: currentServerIndex > 0
    };
}


export function loadSaveFile(saveId, userId, tokenId) {
    const gameId = window.location.hostname;

    const data = {
        userId: userId,
        tokenId: tokenId,
        gameId: gameId
    };

    return instance({
        url: '/download',
        method: 'post',
        data: {
            ...data,
            saveId: parseInt(saveId)
        }
    }).then(response => {
        if (response.success && response.save && response.save.save_data) {
            return response.save.save_data;
        } else {
            console.error("下载存档失败:", response);
            throw new Error("下载存档失败");
        }
    }).catch(error => {
        console.error("下载存档请求出错:", error);
        throw error;
    });
}


export async function getLatestData(userId, tokenId) {
    const gameId = window.location.hostname;

    const data = {
        userId: userId,
        tokenId: tokenId,
        gameId: gameId
    };

    try {
        const response = await instance({
            url: '/latest',
            method: 'post',
            data: data,
        });

        if (response.success && response.save && response.save.save_data) {
            return response.save;
        } else {
            return null;
        }
    } catch (error) {
        console.error("获取最新的存档失败:", error);
        throw error;
    }
}

export async function getLatestDataList(userId, tokenId) {
    const gameId = window.location.hostname;

    const data = {
        userId: userId,
        tokenId: tokenId,
        gameId: gameId
    };

    try {
        const response = await instance({
            url: '/list',
            method: 'post',
            data: data
        });
        if (response.success && response.saves && response.saves.length > 0) {
            return response.saves;
        } else {
            return [];
        }
    } catch (error) {
        console.error("获取最新的存档列表失败:", error);
        throw error;
    }

}


export function saveData(saveData, userId, tokenId, memo) {
    const gameId = window.location.hostname;

    const data = {
        userId: userId,
        tokenId: tokenId,
        gameId: gameId,
        saveData: saveData
    };
    
    if (memo) {
        data.memo = memo;
    }
    
    return instance({
        url: '/save',
        method: 'post',
        data: data
    });
}

export function updateMemo(saveId, memo, userId, tokenId) {
    const gameId = window.location.hostname;

    const data = {
        userId: userId,
        tokenId: tokenId,
        gameId: gameId,
        saveId: parseInt(saveId),
        action: 'update_memo',
        memo: memo
    };
    
    return instance({
        url: '/listweb',
        method: 'post',
        data: data
    }).then(response => {
        if (response.success) {
            return response;
        } else {
            console.error("更新备注失败:", response);
            throw new Error(response.error || "更新备注失败");
        }
    }).catch(error => {
        console.error("更新备注请求出错:", error);
        if (error.data && error.data.error) {
            throw new Error(error.data.error);
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(error.message || "更新备注请求失败");
    });
}

/**
 * 统一处理云存档通知
 * @param {string} type - 通知类型: 'success'|'error'
 * @param {string} operation - 操作类型: 'save'|'load'|'update_memo'|'list'等
 * @param {Object} [error] - 错误信息对象
 * @param {string} [customMessage] - 自定义消息
 */
export function addCloudNotification(type, operation, error, customMessage) {
    let color, timeout, message;
    
    if (type === 'error') {
        color = 'error';
        timeout = 2500;
    } else {
        color = 'success';
        timeout = 1500;
    }
    
    message = {
        type: 'cloudSave',
        operation: operation,
        error: type === 'error' ? (error || {}) : null,
        customMessage: customMessage
    };
    
    store.commit('system/addNotification', { color, timeout, message });
}

export default instance;
