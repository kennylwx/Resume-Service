import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';

describe('AppointmentService', () => {
  let service: AppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentService],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // An unconfirmed schedule should be created on success
  it('should schedule an unconfirmed apointment for a user on success', () => {
    const startTime = new Date('2022-01-01T14:00:00Z');
    const endTime = new Date('2022-01-01T15:00:00Z');

    const newAppointment = service.scheduleAppointment({
      patientId: 1,
      startTime,
      endTime,
    });

    expect(newAppointment).toEqual({
      patientId: 1,
      startTime,
      endTime,
      confirmed: false,
    });
  });

  // The end time should not be before the start time
  it('should throw an error when end time is before start time', () => {
    const startTime = new Date('2022-01-01T15:00:00Z');
    const endTime = new Date('2022-01-01T14:00:00Z');

    expect(() =>
      service.scheduleAppointment({ patientId: 1, startTime, endTime }),
    ).toThrow("appointment's endTime should be after startTime");
  });

  // The end time should be after the start time
  it('should throw an error when end time is equal to start time', () => {
    const startTime = new Date('2022-01-01T15:00:00Z');
    const endTime = startTime;

    expect(() =>
      service.scheduleAppointment({ patientId: 1, startTime, endTime }),
    ).toThrow("appointment's endTime should be after startTime");
  });

  // An appointment start and end time should be within the same day
  it('should throw an error when end time is in the next day', () => {
    const startTime = new Date('2023-12-20T07:09:08.000Z');
    const endTime = new Date('2023-12-22T07:09:08.000Z');

    expect(() =>
      service.scheduleAppointment({ patientId: 1, startTime, endTime }),
    ).toThrow(
      "appointment's endTime should be in the same day as start time's",
    );
  });

  // An appointment start and end time should be within the same month
  it('should throw an error when end time is in the same day and hour of next month', () => {
    const startTime = new Date('2023-11-22T07:09:08.000Z');
    const endTime = new Date('2023-12-22T07:09:08.000Z');

    expect(() =>
      service.scheduleAppointment({ patientId: 1, startTime, endTime }),
    ).toThrow(
      "appointment's endTime should be in the same day as start time's",
    );
  });

  // An appointment start and end time should be within the same year
  it('should throw an error when end time is in the same day and hour and month of next year', () => {
    const startTime = new Date('2022-11-22T07:09:08.000Z');
    const endTime = new Date('2023-11-22T07:09:08.000Z');

    expect(() =>
      service.scheduleAppointment({ patientId: 1, startTime, endTime }),
    ).toThrow(
      "appointment's endTime should be in the same day as start time's",
    );
  });
});
