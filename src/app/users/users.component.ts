import { Component, Inject, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../model/User';


const status = {
  active: 'Подписка активна',
  stopped: 'Приостановлена',
  blocked: 'Заблокирован'
}



const user = {
  foto_url: '',
  full_name: 'Иванов П.Ф.',
  balance: '1234.5',
  last_update: '10 секунд назад',
  status: status.active
}



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private httpService: HttpService, public dialog: MatDialog) { }
  user = user;
  status = status

  status2: any[] = [
    { value: '0', viewValue: 'Подписка активна' },
    { value: '1', viewValue: 'Приостановлена' },
    { value: '2', viewValue: 'Заблокирован' },
  ];
  selectedStatus = this.status2[2].value;
  form: FormGroup = new FormGroup({
    statusControl : new FormControl(this.status2[0].value)
  });

  ngOnInit(): void {
    console.log('https://bumagi-frontend-test.herokuapp.com/users');
    this.getUsers('all');
  }



  getUsers(param: string | number){
      this.httpService.getUsers(param).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        }
      })
  }


  selectTab(event: MatTabChangeEvent){

    if (event.index===0) {
      this.getUsers('all')
    }

    if (event.index === 1) {
      this.getUsers(2)
    }

    if (event.index === 2) {
      this.getUsers(0)
    }
  }

  openDialog(data: User | any): void {
    console.log(data);

    const dialogRef = this.dialog.open(DialogUser, {
      width:  '916px',
      height: '573px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);

    });
  }
}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-user.html',
  styleUrls: ['./users.component.scss']
})
export class DialogUser {
  status: any[] = [
    { value: '0', viewValue: 'Подписка активна' },
    { value: '1', viewValue: 'Приостановлена' },
    { value: '2', viewValue: 'Заблокирован' },
  ];

  form : FormGroup = new FormGroup({
    name: new FormControl('Иванов', this.data.name),
    fname: new FormControl('Иван',this.data.fname),
    mname: new FormControl('Петрович', this.data.mname),
    status: new FormControl(this.status[0].value),
  })

  constructor(public dialogRef: MatDialogRef<DialogUser>,
              @Inject(MAT_DIALOG_DATA) public data: User | any,
  ) { }


  saveUserForm(form: FormGroup) {
    console.log(1,form.value);
    console.log(2,this.form.value);


  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
