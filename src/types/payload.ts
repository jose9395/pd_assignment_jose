export interface PipedrivePersonPayload {
  name?: string;
  email?: { value: string; primary: boolean }[];
  phone?: { value: string; primary: boolean }[];
  [key: string]: any;
}