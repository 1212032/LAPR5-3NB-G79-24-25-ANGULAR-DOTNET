using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Domain.Shared;

namespace BackEnd.Domain.Specializations
{
    public interface ISpecializationRepository : IRepository<Specialization, SpecializationId>
    {
        /// <summary>
        /// Verifica se uma especialização com o código fornecido existe.
        /// </summary>
        /// <param name="code">O código da especialização.</param>
        /// <returns>True se existir, caso contrário False.</returns>
        Task<bool> ExistsAsync(string code);

        /// <summary>
        /// Retorna uma query para realizar consultas dinâmicas na entidade Specialization.
        /// </summary>
        /// <returns>IQueryable de Specialization</returns>
        IQueryable<Specialization> Query();

        /// <summary>
        /// Retorna uma lista de especializações que atendem aos critérios fornecidos.
        /// </summary>
        /// <param name="code">O código parcial ou completo da especialização.</param>
        /// <param name="name">O nome parcial ou completo da especialização.</param>
        /// <returns>Uma lista de especializações que correspondem aos critérios.</returns>
        Task<List<Specialization>> GetByCriteriaAsync(string code, string name);
    }
}
