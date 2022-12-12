using AccountTransfer.Interfaces;
using Microsoft.Extensions.Logging;
using Orleans;
using System.Linq.Expressions;

using var client = new ClientBuilder()
    .UseLocalhostClustering()
    .ConfigureLogging(logging => logging.AddConsole())
    .Build();

await client.Connect();

var accountNames = new[] { "Ioan", "Anrei", "Derick"};
var random = Random.Shared;

bool ok = false;
while (true)
{
    if (!ok)
    {
        var atm = client.GetGrain<IAtmGrain>(0);

        var fromName = accountNames[1];
        var toName = accountNames[2];
        var from = client.GetGrain<IAccountGrain>(fromName);
        var to = client.GetGrain<IAccountGrain>(toName);

        // Perform the transfer and query the results
        try
        {
            await atm.Transfer(from, to, 100);

            var fromBalance = await from.GetBalance();
            var toBalance = await to.GetBalance();

            var account = await to.GetAccount();

            Console.WriteLine(
             $"We transfered 100 credits from {account.Email} to " +
             $"{account.Balance}");

            Console.WriteLine(
                $"We transfered 100 credits from {fromName} to " +
                $"{toName}.\n{fromName} balance: {fromBalance}\n{toName} balance: {toBalance}\n");
        }
        catch (Exception exception)
        {
            Console.WriteLine(
                $"Error transfering 100 credits from " +
                $"{fromName} to {toName}: {exception.Message}");

            if (exception.InnerException is { } inner)
            {
                Console.WriteLine($"\tInnerException: {inner.Message}\n");
            }

            Console.WriteLine();
        }

        // Sleep and run again
        await Task.Delay(TimeSpan.FromMilliseconds(200));

    }
    ok = true;
}