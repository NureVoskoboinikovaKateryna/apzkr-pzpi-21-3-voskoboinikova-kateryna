using healthguard.Models;
using Microsoft.AspNetCore.Mvc;

namespace healthguard.Dto
{
    public class MeasurementDto
    {
        public int MeasurementId { get; set; }
        public float MeasurementValue { get; set; }
        public DateTime MeasurementDate { get; set; }
        public int MDeviceId { get; set; }
        public int PatientId { get; set; }
    }
}
