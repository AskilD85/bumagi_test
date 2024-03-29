export class User {
  id:number;
  name: string;
  fname: string;
  mname:string;
  status:number;
  foto_url?: string;
  full_name?:string;
  balance?:string|number;
  lastUpdatedAt?: Date | string;
  message?: string;
  constructor (id:number,name:string,fname:string,mname:string,status: number) {
    this.id = id;
    this.name = name;
    this.fname=fname;
    this.mname = mname;
    this.status = status;
  }
}

