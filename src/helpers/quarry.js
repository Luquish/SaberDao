import { Payroll } from '@quarryprotocol/quarry-sdk';
export const createQuarryPayroll = (quarryData) => new Payroll(quarryData.famineTs, quarryData.lastUpdateTs, quarryData.annualRewardsRate, quarryData.rewardsPerTokenStored, quarryData.totalTokensDeposited);
