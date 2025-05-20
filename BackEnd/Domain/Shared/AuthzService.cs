using System;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;

namespace BackEnd.Domain.Shared
{
    public class AuthzService : IAuthzService
    {
        private readonly HttpContext _httpContext;

        public AuthzService(IHttpContextAccessor httpContext)
        {
            this._httpContext = httpContext.HttpContext;
        }

        public string CurrentUserEmail()
        {
            IEnumerable<Claim> claimList = _httpContext.User.Claims;
            foreach (Claim claim in claimList)
            {
                if (claim.Type.Contains("identity/claims/emailaddress"))
                {
                    return claim.Value;
                }
            }
            return "";
        }

        public string CurrentUserRole()
        {
            IEnumerable<Claim> claimList = _httpContext.User.Claims;
            foreach (Claim claim in claimList)
            {
                if (claim.Type.Contains("identity/claims/role"))
                {
                    return claim.Value;
                }
            }
            return "";
        }
    }
}