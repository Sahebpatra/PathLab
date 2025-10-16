using System.Data;


namespace PathLab.Application.Common.Interfaces
{
    public interface IConnectionFactory
    {
        IDbConnection CreateConnection();
    }
}
