using System;

namespace BackEnd.Domain.Shared
{
    public class BusinessRuleNotFoundException : Exception
    {
        public string Details { get; }

        public BusinessRuleNotFoundException(string message) : base(message)
        {
            
        }

        public BusinessRuleNotFoundException(string message, string details) : base(message)
        {
            this.Details = details;
        }
    }
}