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
        public string Email { get; set; }
        public uint Balance { get; set; }

        public string FromEmail { get; set; }

        public string ToEmail { get; set; }
            
        public uint Amount { get; set; }    
    }

  
    [Serializable]
    public class BankAccountState
    {
        public BankAccount Value { get; set; }
    }
}
