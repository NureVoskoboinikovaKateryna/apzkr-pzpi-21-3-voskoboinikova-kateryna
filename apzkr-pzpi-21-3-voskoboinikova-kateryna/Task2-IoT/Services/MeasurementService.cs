using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using StayHealthIoT.Data;
using StayHealthIoT.Models;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace StayHealthIoT.Services
{
    public class MeasurementService : IHostedService, IDisposable
    {
        private Timer _timer;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly Random _random = new Random();
        private const double MinTemp = 36.0;
        private const double MaxTemp = 37.5;

        public MeasurementService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromMinutes(5));
            return Task.CompletedTask;
        }

        private void DoWork(object state)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<SmartWatchDbContext>();

            var temperature = _random.NextDouble() * (MaxTemp - MinTemp) + MinTemp;

            var measurement = new Measurement
            {
                PatientId = Program.PatientId,
                MeasurementValue = (float)temperature,
                MedicalDeviceId = Program.MedicalDeviceId,
                MeasurementDate = DateTime.UtcNow
            };

            context.Measurements.Add(measurement);
            context.SaveChanges();

            if (temperature < MinTemp || temperature > MaxTemp)
            {
                Console.WriteLine(Program.LocalizationResources["TemperatureOutOfRange"], temperature);
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
