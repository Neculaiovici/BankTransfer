using Microsoft.Extensions.Hosting;
using Orleans;
using Orleans.Hosting;
using Orleans.Statistics;
using System.Net;

await Host.CreateDefaultBuilder()
    .UseOrleans(siloBuilder =>
    {
        siloBuilder
            .UseLocalhostClustering(serviceId: "bank")
            .AddMemoryGrainStorageAsDefault()
            .UseDashboard(options =>
            {
                options.Username = "admin";
                options.Password = "admin";
                options.Host = "*";
                options.Port = 8080;
                options.HostSelf = true;
                options.CounterUpdateIntervalMs = 1000;
            })
            .UsePerfCounterEnvironmentStatistics()
            .UseTransactions();
    })
    .RunConsoleAsync();