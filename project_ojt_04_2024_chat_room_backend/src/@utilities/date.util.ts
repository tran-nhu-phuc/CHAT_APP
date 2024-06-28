import moment from 'moment';
import { DATE_FORMAT, DATETIME_FORMAT } from '../@config/formatter.config';

export class DateUtil {
  public static getCurrentDate() {
    return moment().format(DATE_FORMAT);
  }

  public static getCurrentDateTime() {
    return moment().format(DATETIME_FORMAT);
  }
}
