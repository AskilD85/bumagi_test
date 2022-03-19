import { Component, Inject, OnInit, Injectable } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Status, User } from '../model/User';
import { debounceTime, distinctUntilChanged, interval, Subscription } from 'rxjs';
@Injectable({ providedIn: 'root'})
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private httpService: HttpService, public dialog: MatDialog) { }

  users: User[] = [
    { id:1, foto_url: '', full_name: 'Иванов П.Ф.',name: 'Иван2', fname: 'Иванов2', mname: 'Петрович1', balance: '1234.5', last_update: '10 секунд назад', status: {id:0}},
    { id: 2, foto_url: '', full_name: 'Петров П.Ф.', name: 'Иван2', fname: 'Петров', mname: 'Петрович1', balance: '1234.5', last_update: '10 секунд назад', status: { id: 0 } },
    { id: 3, foto_url: '', full_name: 'Сидоров П.Ф.', name: 'Иван2', fname: 'Сидоров', mname: 'Петрович1', balance: '1234.5', last_update: '10 секунд назад', status: { id: 0 } },
    { id: 4, foto_url: '', full_name: 'Жеглов П.Ф.', name: 'Глеб', fname: 'Жеглов', mname: 'Петрович1', balance: '1234.5', last_update: '10 секунд назад', status: { id: 2 } },
  ]
  status: Status[] = [
    { id: 0, value: 'Подписка активна' },
    { id: 1, value: 'Приостановлена' },
    { id: 2, value: 'Заблокирован' },
  ];
  isUpdate = false;
  selectedStatus = this.status[2].value;
  form: FormGroup = new FormGroup({
    statusControl : new FormControl(this.status[0].value)
  });
  usersParam: string = 'all';
  fakeUsers: User[] = [];
  sInterval! :Subscription;

  ngOnInit(): void {
    // this.getUsers(this.usersParam);
    this.getUsersInterval()
  }

  getUsersInterval() {
    this.sInterval = interval(5000).subscribe(
      () => {
        console.log('getUsers - interval');
        this.getUsers(this.usersParam);
      }
    )
  }

  getUsers(param: string | number){
    this.fakeUsers == []
    /*this.httpService.getUsers(param).subscribe({
          next: (data) => {
            console.log(data);
           this.fakeUsers = this.users;
          },
          error: (err) => {
            console.log(err);
          }
        });*/
          console.log('запрос на сервер');


    this.fakeUsers = this.users;

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
    this.sInterval.unsubscribe()
    const dialogRef = this.dialog.open(DialogUser, {
      width:  '916px',
      height: '573px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.getUsers(this.usersParam = 'all');
      this.getUsersInterval()
      // this.httpService.updateUser(this.form.value).subscribe();
    });
  }
}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-user.html',
  styleUrls: ['./users.component.scss']
})
export class DialogUser implements OnInit {
  status = this.userComponent.status;
  form : FormGroup = new FormGroup({
    name: new FormControl(this.data.name),
    fname: new FormControl(this.data.fname),
    mname: new FormControl(this.data.mname),
    status: new FormControl(this.status[this.data.status.id].id),
  })

  constructor(private userComponent: UsersComponent,public dialogRef: MatDialogRef<DialogUser>,
              @Inject(MAT_DIALOG_DATA) public data: User | any,
  ) { }

  ngOnInit(): void {
    // this.form.get('name')!.valueChanges.pipe(
    //   debounceTime(1000),
    //   distinctUntilChanged()
    // ).subscribe((v) => {
    //   console.log(3, v)
    // })
    // this.form.statusChanges.subscribe((status) => {
    //   console.log(4, status)
    // })
  }

  saveUserForm(form: FormGroup)
  {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
