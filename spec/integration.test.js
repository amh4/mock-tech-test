const Account = require('../lib/account')
const Transaction = require('../lib/transaction')

describe('Integration testing', () => {
  beforeEach(() => {
    transaction = new Transaction()
    userAccount = new Account(0)
    userWithdrawalTestAccount = new Account(1000)
    consoleSpy = jest.spyOn(console, 'log')
  })

  describe('recordTransaction', () => {
    it('adds a deposit to this.transactionHistory', () => {
      userAccount.recordTransaction(transaction.deposit(100))
      expect(userAccount.transactionHistory[0][0]).toEqual('21/2/2023')
      expect(userAccount.transactionHistory[0][1]).toEqual(100)
      expect(userAccount.transactionHistory[0][2]).toEqual("")
    })

    it('records two deposits to this.transactionHistory', () => {
      const transaction2 = new Transaction()
      userAccount.recordTransaction(transaction.deposit(100))
      userAccount.recordTransaction(transaction2.deposit(900))
      expect(userAccount.transactionHistory).toHaveLength(2)
      expect(userAccount.transactionHistory[0]).toEqual(['21/2/2023', 900, "",1000])
      expect(userAccount.transactionHistory[1]).toEqual(['21/2/2023', 100, "",100])
    })

    it('checks if the transaction is a credit and adds to current balance if true', () => {
      userAccount.recordTransaction(transaction.deposit(200))
      expect(userAccount.currentBalance).toEqual(200)
    })

    it('records a withdrawal in the transaction history', () => {
      userWithdrawalTestAccount.recordTransaction(transaction.withdrawal(100))
      expect(userWithdrawalTestAccount.transactionHistory[0]).toEqual(['21/2/2023',"", 100 ,900])
    })

    it('updates current balance after withdrawal', () => {
      userWithdrawalTestAccount.recordTransaction(transaction.withdrawal(100))
      expect(userWithdrawalTestAccount.currentBalance).toEqual(900)
    })

    it('records two withdrawals in transaction history', () => {
      const transaction2 = new Transaction()
      userWithdrawalTestAccount.recordTransaction(transaction.withdrawal(100))
      userWithdrawalTestAccount.recordTransaction(transaction2.withdrawal(300))
      expect(userWithdrawalTestAccount.transactionHistory).toHaveLength(2)
      expect(userWithdrawalTestAccount.transactionHistory[0]).toEqual(['21/2/2023',"", 300 ,600])
      expect(userWithdrawalTestAccount.transactionHistory[1]).toEqual(['21/2/2023',"", 100 ,900])
    })

    it('returns insufficient funds if balance will fall below 0 post withdrawal', () => {
      expect(userAccount.recordTransaction(transaction.withdrawal(100))).toEqual('Insufficient Funds')
    })
  })

  describe('printStatement', () => {
    it('prints out the header in the requested format', () => {
      userAccount.printStatement()
      expect(consoleSpy).toHaveBeenCalledWith('date || credit || debit || balance')
    })
  })
})