import { Injectable } from '@nestjs/common';
import { Appointment } from './appointment.model';

export interface AppointmentInput {
  patientId: number;
  startTime: Date;
  endTime: Date;
}

@Injectable()
export class AppointmentService {
  // schedule Appointment service
  public scheduleAppointment(appointmentData: AppointmentInput): Appointment {
    // validate appointment start time and end time
    if (appointmentData.endTime <= appointmentData.startTime) {
      throw new Error("appointment's endTime should be after startTime");
    }

    // verify appointment is on same day
    if (this.endTimeIsInTheNextDay(appointmentData)) {
      throw new Error(
        "appointment's endTime should be in the same day as start time's",
      );
    }

    return {
      ...appointmentData,
      confirmed: false,
    };
  }

  // func to validate end time is next day or next month
  private endTimeIsInTheNextDay(appointmentData: AppointmentInput): boolean {
    const differentDays =
      appointmentData.endTime.getUTCDate() !==
      appointmentData.startTime.getUTCDate();
    const differentMonths =
      appointmentData.endTime.getUTCMonth() !==
      appointmentData.startTime.getUTCMonth();

    const differentYears =
      appointmentData.endTime.getUTCFullYear() !==
      appointmentData.startTime.getUTCFullYear();

    return differentDays || differentMonths || differentYears;
  }
}
