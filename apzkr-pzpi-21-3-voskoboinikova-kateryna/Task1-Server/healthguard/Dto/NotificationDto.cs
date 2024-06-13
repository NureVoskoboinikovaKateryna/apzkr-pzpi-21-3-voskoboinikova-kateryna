using healthguard.Models;

namespace healthguard.Dto
{
    public class NotificationDto
    {
        public int NotificationId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int SenderId { get; set; }
        public int PatientId { get; set; }
        public DateTime Date { get; set; }
    }
}
