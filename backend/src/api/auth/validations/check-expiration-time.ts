import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class ValidatorService {
  public checkExpirationTime(issueDate: string, daysInTrial: number): boolean {
    const today = new Date().getTime();
    const issueDateToMilliseconds = new Date(issueDate).getTime();
    const timeFromIssueDateToSeconds = (today - issueDateToMilliseconds) / 1000;
    const daysInTrialToSeconds = daysInTrial * 24 * 60 * 60;

    return daysInTrialToSeconds <= timeFromIssueDateToSeconds;
  }
}
