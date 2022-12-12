using Microsoft.Extensions.Hosting;
using Orleans;
using Orleans.Hosting;
using System.Net;

await Host.CreateDefaultBuilder()
    .UseOrleans(siloBuilder =>
    {
        siloBuilder
            .UseLocalhostClustering(serviceId: "bank")
            .AddMemoryGrainStorageAsDefault()
            .UseTransactions();
    })
    .RunConsoleAsync();