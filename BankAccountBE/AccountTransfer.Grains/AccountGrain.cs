using AccountTransfer.Interfaces;
using AccountTransfer.Interfaces.States;
using Orleans;
using Orleans.Transactions.Abstractions;

namespace AccountTransfer.Grains;

[Serializable]
public record class Balance
{
    public uint Value { get; set; } = 1_000;
}

public class AccountGrain : Grain, IAccountGrain
{
    private readonly ITransactionalState<Balance> _balance;
    private readonly IClusterClient _client;
    private string FullName;
    private string Exp = "6/25";

    public AccountGrain([TransactionalState("balance")] ITransactionalState<Balance> balance, IClusterClient client)
    {
        _balance = balance ?? throw new ArgumentNullException(nameof(balance));
        FullName = "User " + MemoryCache.Grains.Count();
        _client = client;
    }

    public override async Task OnActivateAsync()
    {
        await base.OnActivateAsync();

        string id = this.GetPrimaryKeyString();
        MemoryCache.Grains.Add(this.GetPrimaryKeyString());
    }

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

    public async Task<BankAccount> GetAccount()
    {
        return new BankAccount
        {
            Email = this.GetPrimaryKeyString(),
            Balance = await GetBalance(),
            FUllName = this.FullName,
            Exp = this.Exp
        };
    }

    public async Task<List<BankAccount>> GetAllIds()
    {
        List<BankAccount> res = new List<BankAccount>();
        foreach (var email in MemoryCache.Grains)
        {
            var _grain = _client.GetGrain<IAccountGrain>(email);
            BankAccount _grainResp = await _grain.GetAccount();
            res.Add(_grainResp);
        }
        return res;
    }

    public async Task Init(string _FullName, string _Exp, uint _Balance)
    {
        FullName = _FullName?.Length > 0 ? _FullName : FullName;
        Exp = _Exp?.Length > 0 ? _Exp : Exp;
        _balance.PerformUpdate(balance => balance.Value = _Balance);
    }

    public Task<uint> GetBalance() => _balance.PerformRead(balance => balance.Value);
}