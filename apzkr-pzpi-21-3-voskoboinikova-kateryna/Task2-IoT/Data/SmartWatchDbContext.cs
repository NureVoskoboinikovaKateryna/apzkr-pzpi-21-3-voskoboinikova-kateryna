using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;
using StayHealthIoT.Models;
using StayHealthIoT.Controllers;

namespace StayHealthIoT.Data
{
    public class SmartWatchDbContext : DbContext
    {
        public SmartWatchDbContext(DbContextOptions<SmartWatchDbContext> options) : base(options) { }

        public DbSet<Measurement> Measurements { get; set; }
    }

}
