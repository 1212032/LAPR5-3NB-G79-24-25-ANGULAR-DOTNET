namespace BackEnd.Domain.Shared
{
    public interface IAuthzService
    {
        public string CurrentUserEmail();
        public string CurrentUserRole();
    }
}