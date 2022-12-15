using System;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Cryptography.Xml;
using System.Text.Json;
using System.Threading.Tasks;
using AccountTransfer.Interfaces;
using AccountTransfer.Interfaces.States;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Any;
using Orleans;
using Orleans.Core;
using Orleans.Runtime;
using WebAPI.Dtos;

namespace WebAPI.Controllers
{
    [Route("api/client")]
    public class ClientController : Controller
    {
        private readonly IClusterClient _client;
        private readonly IManagementGrain _managementGrain;

        public ClientController(IClusterClient client)
        {
            _client = client;
        }

        [HttpPost]
        public async Task<BankAccount> Get([FromBody] Account account)
        {
            var grain = _client.GetGrain<IAccountGrain>(account.Email);
            await grain.Init(account.FullName, account.Exp, account.Balance);

            return await grain.GetAccount();
        }

        [HttpGet("getAll")]
        public async Task<List<BankAccount>> GetAll()
        {
            var res = await _client.GetGrain<IAccountGrain>("Memory Cache").GetAllIds();
            return res;
        }

        [HttpPost("transfer")]
        public async Task<BankAccount> Transfer([FromBody] Transfer transfer)
        {
            var c = _client.GetGrain<IAccountGrain>(transfer.fromEmail);
            var to = _client.GetGrain<IAccountGrain>(transfer.toEmail);

            var atm = _client.GetGrain<IAtmGrain>(0);
            await atm.Transfer(c, to, transfer.amount);

            var res = await c.GetAccount();
            return res;
        }
    }
}