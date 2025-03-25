import { useState, useCallback } from 'react';
import { CalculatorState, PositionSizeResult, MarketType, ValidationResult } from '../types/calculator';
import { useInstruments } from './useInstruments';

const initialState: CalculatorState = {
  marketType: 'forex',
  accountCurrency: 'USD',
  accountBalance: 10000,
  customBalance: null,
  riskPercentage: 1,
  stopLoss: 50,
  stopLossUnit: 'pips',
  entryPrice: 0,
  stopLossPrice: 0,
  takeProfitLevels: [{ price: 0, percentage: 100 }],
  leverage: 100,
  instrument: '',
  commission: 0,
  spread: 1,
  slippage: 0.5
};

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const { getInstrument, validateInstrument } = useInstruments(state.marketType);

  const calculatePositionSize = useCallback((): PositionSizeResult => {
    const balance = state.customBalance ?? state.accountBalance;
    const riskAmount = balance * (state.riskPercentage / 100);
    
    let size = 0;
    let pipValue = 0;
    let margin = 0;
    let potentialProfit = 0;

    const instrument = getInstrument(state.instrument);
    if (!instrument) {
      return {
        size: 0,
        riskAmount: 0,
        margin: 0,
        potentialProfit: 0,
        riskRewardRatio: 0,
        commission: 0,
        totalCost: 0
      };
    }

    switch (state.marketType) {
      case 'forex': {
        const pipSize = state.instrument.includes('JPY') ? 0.01 : 0.0001;
        const priceDiff = Math.abs(state.entryPrice - state.stopLossPrice);
        const pips = priceDiff / pipSize;
        
        if (pips > 0) {
          const standardLot = 100000;
          pipValue = riskAmount / pips;
          size = (pipValue * pipSize * standardLot) / state.leverage;
        }
        break;
      }
      
      case 'stocks': {
        const priceDiff = Math.abs(state.entryPrice - state.stopLossPrice);
        if (priceDiff > 0) {
          size = riskAmount / priceDiff;
        }
        break;
      }

      case 'crypto': {
        const priceDiff = Math.abs(state.entryPrice - state.stopLossPrice);
        if (priceDiff > 0) {
          size = riskAmount / priceDiff;
        }
        break;
      }

      case 'futures': {
        if (instrument.contractSize) {
          const priceDiff = Math.abs(state.entryPrice - state.stopLossPrice);
          if (priceDiff > 0) {
            size = (riskAmount / priceDiff) / instrument.contractSize;
          }
        }
        break;
      }

      case 'options': {
        if (instrument.multiplier) {
          const priceDiff = Math.abs(state.entryPrice - state.stopLossPrice);
          if (priceDiff > 0) {
            size = (riskAmount / priceDiff) / instrument.multiplier;
          }
        }
        break;
      }
    }

    // Calculate margin and potential profit
    margin = (size * state.entryPrice * (instrument.multiplier || 1)) / state.leverage;
    
    potentialProfit = state.takeProfitLevels.reduce((total, level) => {
      const priceDiff = Math.abs(level.price - state.entryPrice);
      return total + (size * priceDiff * (level.percentage / 100));
    }, 0);

    const commission = (size * state.commission);
    const totalCost = margin + commission;

    return {
      size,
      riskAmount,
      pipValue,
      margin,
      potentialProfit,
      riskRewardRatio: potentialProfit / riskAmount,
      commission,
      totalCost
    };
  }, [state, getInstrument]);

  const validateInputs = useCallback((): ValidationResult => {
    if (!state.instrument) {
      return { isValid: false, message: 'Please select an instrument' };
    }

    if (!validateInstrument(state.instrument)) {
      return { isValid: false, message: 'Invalid instrument' };
    }

    if (state.riskPercentage <= 0 || state.riskPercentage > 100) {
      return { isValid: false, message: 'Risk percentage must be between 0 and 100' };
    }

    if (state.stopLoss <= 0) {
      return { isValid: false, message: 'Stop loss must be greater than 0' };
    }

    if (state.entryPrice <= 0) {
      return { isValid: false, message: 'Entry price must be greater than 0' };
    }

    return { isValid: true };
  }, [state, validateInstrument]);

  return {
    state,
    setState,
    calculatePositionSize,
    validateInputs,
  };
}