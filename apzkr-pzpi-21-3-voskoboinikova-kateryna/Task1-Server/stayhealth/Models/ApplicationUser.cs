using Microsoft.AspNetCore.Identity;

namespace healthguard.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
    }
}
