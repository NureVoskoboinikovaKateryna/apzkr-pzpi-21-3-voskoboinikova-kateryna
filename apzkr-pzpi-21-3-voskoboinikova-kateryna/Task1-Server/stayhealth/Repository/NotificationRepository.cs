using healthguard.Data;
using healthguard.Interfaces;
using healthguard.Models;

namespace healthguard.Repository
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly DataContext _context;

        public NotificationRepository(DataContext context)
        {
            _context = context;
        }

        public bool CreateNotification(Notification notification)
        {
            _context.Add(notification);
            return Save();
        }

        public bool DeleteNotification(Notification notification)
        {
            _context.Remove(notification);
            return Save();
        }

        public Notification GetNotification(int notifId)
        {
            return _context.Notifications.Where(e => e.NotificationId == notifId).FirstOrDefault();
        }

        public ICollection<Notification> GetNotifications()
        {
            return _context.Notifications.OrderBy(e => e.NotificationId).ToList();
        }

        public ICollection<Notification> GetNotificationsByDoctor(int doctorId)
        {
            return _context.Notifications.Where(e => e.SenderId == doctorId).ToList();
        }

        public ICollection<Notification> GetNotificationsByPatient(int patientId)
        {
            return _context.Notifications.Where(e => e.PatientId == patientId).ToList();
        }

        public bool NotificationExists(int notifId)
        {
            return _context.Notifications.Any(e => e.NotificationId == notifId);
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0;
        }

        public bool UpdateNotification(Notification notification)
        {
            _context.Update(notification);
            return Save();
        }
    }
}
