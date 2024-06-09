function currentDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const hours = today.getHours().toString().padStart(2, '0');
  const minutes = today.getMinutes().toString().padStart(2, '0');
  const seconds = today.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export class Notification {
  notificationId: number = 0
  patientId: number = 0
  senderId: number = 0
  date: string = currentDate()
  title: string = ""
  content: string = ""
}
