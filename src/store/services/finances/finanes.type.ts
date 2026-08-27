export type FinancesBalance = {
  balance: {
    available: number;
    pending: {
      release: number;
      retention: number;
    };
  };
  test: {
    available: number;
    pending: {
      release: number;
      retention: number;
    };
  };
  withdraws: {
    approved: 0;
    pending: 0;
  };
};

export type FinancesBalanceResponse = FinancesBalance;
