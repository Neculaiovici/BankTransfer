using AccountTransfer.Interfaces.States;
using Orleans;

namespace AccountTransfer.Interfaces;

public interface IAccountGrain : IGrainWithStringKey
{
    [Transaction(TransactionOption.Join)]
    Task Withdraw(uint amount);

    [Transaction(TransactionOption.Join)]
    Task Deposit(uint amount);

    [Transaction(TransactionOption.CreateOrJoin)]
    Task<uint> GetBalance();
    [Transaction(TransactionOption.CreateOrJoin)]
    Task<BankAccount> GetAccount();
}
