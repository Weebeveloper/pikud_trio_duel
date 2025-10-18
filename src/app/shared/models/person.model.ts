interface IPersonModelProperties {
  id: string;
  name: string;
  location: { longtitude: number; latitude: number };
  image: string;
  phoneNumber: string;
  backgroundColor?: string;
}

export class PersonModel implements IPersonModelProperties {
  id!: string;
  name!: string;
  location!: { longtitude: number; latitude: number };
  image!: string;
  phoneNumber!: string;
  backgroundColor?: string = '#7793a7';

  constructor(props: IPersonModelProperties) {
    Object.assign(this, props);
  }
}
