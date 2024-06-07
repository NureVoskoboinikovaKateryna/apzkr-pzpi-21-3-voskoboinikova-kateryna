using healthguard.Models;

namespace healthguard.Interfaces
{
    public interface IMedicalDeviceTypeRepository
    {
        ICollection<MedicalDeviceType> GetMedicalDeviceTypes();
        MedicalDeviceType GetMedicalDeviceType(int mdevicetypeId);
        ICollection<MedicalDevice> GetMedicalDevicesByType(int mdevicetypeId);
        bool MedicalDeviceTypeExists(int mdevicetypeId);
        bool CreateMedicalDeviceType(MedicalDeviceType medicalDeviceType);
        bool UpdateMedicalDeviceType(MedicalDeviceType medicalDeviceType);
        bool DeleteMedicalDeviceType(MedicalDeviceType medicalDeviceType);
        bool Save();
    }
}
