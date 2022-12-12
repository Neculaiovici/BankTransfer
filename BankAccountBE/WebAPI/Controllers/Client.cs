using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AccountTransfer.Interfaces;
using AccountTransfer.Interfaces.States;
using Microsoft.AspNetCore.Mvc;
using Orleans;


namespace WebAPI.Controllers
{

    [Route("api/client")]
    public class ClientController : Controller
    {
        private readonly IClusterClient _client;

        public ClientController(IClusterClient client)
        {
            _client = client;
        }

        [HttpGet("{email}")]
        public async Task<BankAccount> Get(string email)
        {
            var grain = _client.GetGrain<IAccountGrain>(email);
            return await grain.GetAccount();
        }

        [HttpPost("transfer")]
        public async Task<BankAccount> Transfer([FromBody] fromEmail, [FromBody] toEmail, [FromBody] amount)
        {
            var c = _client.GetGrain<IAccountGrain>(fromEmail);
            var to = _client.GetGrain<IAccountGrain>(toEmail);

            var atm = _client.GetGrain<IAtmGrain>(0);
            await atm.Transfer(c, to, amount);

            var res = await c.GetAccount();
            return res;
        }
    }
}
