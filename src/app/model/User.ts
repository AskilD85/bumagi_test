export class User {
  id:number;
  name: string;
  fname: string;
  mname:string;
  status:Status;
  foto_url?: string;
  full_name?:string;
  balance?:string|number;
  last_update?:string;
  constructor (id:number,name:string,fname:string,mname:string,status: Status) {
    this.id = id;
    this.name = name;
    this.fname=fname;
    this.mname = mname;
    this.status = status;
  }
}

export class Status {
  id?: number;
  value?: string
}
