using healthguard.Models;

namespace healthguard.POST
{
    public class CompanyManagerPOST
    {
        public int CompanyManagerId { get; set; }
        public int CompanyId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
    }
}
