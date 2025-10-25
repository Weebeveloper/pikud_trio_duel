import { PersonModel } from './person.model';

interface IAlertHistoryModelProperties {
  readonly alert_timestamp: Date;
  readonly sender: PersonModel;
  readonly receiver: PersonModel;
}

export class AlertHistoryModel implements IAlertHistoryModelProperties {
  readonly alert_timestamp!: Date;
  readonly sender!: PersonModel;
  readonly receiver!: PersonModel;

  constructor(props: IAlertHistoryModelProperties) {
    Object.assign(this, props);
  }
}
