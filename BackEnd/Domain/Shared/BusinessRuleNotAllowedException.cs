using System;

namespace BackEnd.Domain.Shared
{
    public class BusinessRuleNotAllowedException : Exception
    {
        public string Details { get; }

        public BusinessRuleNotAllowedException(string message) : base(message)
        {
            
        }

        public BusinessRuleNotAllowedException(string message, string details) : base(message)
        {
            this.Details = details;
        }
    }
}