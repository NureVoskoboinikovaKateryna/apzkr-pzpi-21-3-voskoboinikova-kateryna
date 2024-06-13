using healthguard.Models;

namespace healthguard.Interfaces
{
    public interface ISpecializationRepository
    {
        ICollection<Specialization> GetSpecializations();
        Specialization GetSpecialization(int spezId);
        ICollection<Doctor> GetDoctorsBySpecialization(int spezId);
        bool SpecializationExists(int spezId);
        bool CreateSpecialization(Specialization specialization);
        bool UpdateSpecialization(Specialization specialization);
        bool DeleteSpecialization(Specialization specialization);
        bool Save();
    }
}
