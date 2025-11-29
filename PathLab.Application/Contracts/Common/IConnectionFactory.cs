using System.Data;


namespace PathLab.Application.Contracts.Common
{
    public interface IConnectionFactory
    {
        IDbConnection CreateConnection();
    }
}
