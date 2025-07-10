export default {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {
        grantRelic({ dispatch, commit, rootState }, relicName) {
            dispatch('relic/find', relicName, {root: true});
            if (rootState.system.settings.notification.items.achievement.value) {
                commit('system/addNotification', {
                    color: 'success',
                    timeout: 5000,
                    message: {
                        type: 'relic',
                        name: relicName
                    }
                }, {root: true});
            }
        },

        checkAndGrantRewards({ rootState, dispatch }) {
            if (!rootState.system.settings.experiment.items.consecutiveSignInRelics.value) {
                return;
            }

            try {
                const CONSECUTIVE_REWARDS = [
                    { days: 7, relic: 'consecutiveSignIn1' },
                    { days: 14, relic: 'consecutiveSignIn2' },
                    { days: 21, relic: 'consecutiveSignIn3' },
                    { days: 28, relic: 'consecutiveSignIn4' },
                    { days: 35, relic: 'consecutiveSignIn5' },
                    { days: 50, relic: 'consecutiveSignIn6' },
                    { days: 65, relic: 'consecutiveSignIn7' },
                    { days: 80, relic: 'consecutiveSignIn8' },
                    { days: 95, relic: 'consecutiveSignIn9' },
                    { days: 110, relic: 'consecutiveSignIn10' },
                    { days: 150, relic: 'consecutiveSignIn11' }
                ];

                const totalSignInCount = rootState.system.dailyCheckIn?.totalCount || 0;
                //console.log(`🎁 累签奖励检查: 累计签到次数 = ${totalSignInCount}`);

                if (totalSignInCount === 0) {
                    return;
                }

                for (const reward of CONSECUTIVE_REWARDS) {
                    if (totalSignInCount >= reward.days) {
                        const relicData = rootState.relic.item[reward.relic];

                        if (relicData && !relicData.found) {
                            dispatch('grantRelic', reward.relic);
                            //console.log(`🎁 累签奖励: 累计签到${totalSignInCount}天，获得圣遗物 ${reward.relic}`);
                        }
                    }
                }
            } catch (error) {
                console.error('❌ 检查累签奖励时出错:', error);
            }
        }
    }
};
