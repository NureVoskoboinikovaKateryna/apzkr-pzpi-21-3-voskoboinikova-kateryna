namespace healthguard.Models
{
    public class Notification
    {
        public int NotificationId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int PatientId { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public int SenderId { get; set; } = 0;
        public Patient Patient { get; set; }
    }
}
