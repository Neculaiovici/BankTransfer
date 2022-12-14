using AccountTransfer.Interfaces;
using AccountTransfer.Interfaces.States;
using Orleans;
using Orleans.Transactions.Abstractions;
using System.ComponentModel.DataAnnotations;

namespace AccountTransfer.Grains;


[Serializable]
public record class Balance
{
    public uint Value { get; set; } = 1_000;
}

public class AccountGrain : Grain, IAccountGrain
{
    private readonly ITransactionalState<Balance> _balance;
    public AccountGrain(
        [TransactionalState("balance")] ITransactionalState<Balance> balance) =>
        _balance = balance ?? throw new ArgumentNullException(nameof(balance));

    public Task Deposit(uint amount) =>
        _balance.PerformUpdate(
            balance => balance.Value += amount);

    public Task Withdraw(uint amount) =>
        _balance.PerformUpdate(balance =>
        {
            if (balance.Value < amount)
            {
                throw new InvalidOperationException(
                    $"Withdrawing {amount} credits from account " +
                    $"\"{this.GetPrimaryKeyString()}\" would overdraw it." +
                    $" This account has {balance.Value} credits.");
            }

            balance.Value -= amount;
        });

    public async Task<BankAccount> GetAccount() => new BankAccount
    {
        Email = this.GetPrimaryKeyString(),
        Balance = await GetBalance()
    };

    public Task<uint> GetBalance() =>
        _balance.PerformRead(balance => balance.Value);

}
