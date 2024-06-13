using healthguard.Models;

namespace healthguard.POST
{
    public class DoctorPOST
    {
        public int DoctorId { get; set; }
        public int SpecializationId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
    }
}
