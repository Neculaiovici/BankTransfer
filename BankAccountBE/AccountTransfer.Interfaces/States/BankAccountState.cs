using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccountTransfer.Interfaces.States
{
    [Serializable]
    public class BankAccount
    {
        public int Id { get; set; } 
        public string Email { get; set; }
        public uint Balance { get; set; }  
    }

  
    [Serializable]
    public class BankAccountState
    {
        public BankAccount Value { get; set; }
    }
}
