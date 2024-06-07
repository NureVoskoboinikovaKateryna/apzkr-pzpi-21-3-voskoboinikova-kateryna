using healthguard.Data;
using healthguard.Interfaces;
using healthguard.Models;

namespace healthguard.Repository
{
    public class BloodTypeRepository : IBloodTypeRepository
    {
        private readonly DataContext _context;

        public BloodTypeRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<BloodType> GetBloodTypes()
        {
            return _context.BloodTypes.OrderBy(e => e.BloodTypeId).ToList();
        }

        public BloodType GetBloodType(int btypeId)
        {
            return _context.BloodTypes.Where(e => e.BloodTypeId == btypeId).FirstOrDefault();
        }

        public ICollection<Patient> GetPatientsByBloodType(int btypeId)
        {
            return _context.Patients.Where(e => e.BloodType.BloodTypeId == btypeId).ToList();
        }
    }
}
