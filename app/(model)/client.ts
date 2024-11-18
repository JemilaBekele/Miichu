// interfaces/client.ts

export interface Client {
  phoneNumber: string;
  fullName: string;
  sex: string;
  fiydaIdImage: string;
  fiydaIdImageback: string;
  password: string;
  confirmPassword:string
  workplaceId?: string;
  organization?: string;
  locationStart?: string;
  locationEnd?: string;
  }