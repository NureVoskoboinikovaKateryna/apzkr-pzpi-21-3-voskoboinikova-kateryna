using healthguard.Models;

namespace healthguard.Interfaces
{
    public interface IBloodTypeRepository
    {
        ICollection<BloodType> GetBloodTypes();
        BloodType GetBloodType(int btypeId);
        ICollection<Patient> GetPatientsByBloodType(int btypeId);
    }
}
