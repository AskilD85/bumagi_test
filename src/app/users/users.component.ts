import { Component, Inject, OnInit, Injectable, EventEmitter } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../model/User';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
@Injectable({ providedIn: 'root'})
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private httpService: HttpService, public dialog: MatDialog) { }

  users: User[] = [
    { id:1, foto_url: '', full_name: 'Иванов П.Ф.',name: 'Иван', fname: 'Иванов', mname: 'Петрович', balance: '1234.5', last_update: '10 секунд назад', status: 0},
    { id: 2, foto_url: '', full_name: 'Петров П.Ф.', name: 'иван', fname: 'Петров', mname: 'Петрович1', balance: '1234.5', last_update: '10 секунд назад', status:  0  },
    { id: 3, foto_url: '', full_name: 'Сидоров П.Ф.', name: 'Иван2', fname: 'Сидоров', mname: 'Петрович1', balance: '1234.5', last_update: '10 секунд назад', status:  0  },
    { id: 4, foto_url: '', full_name: 'Жеглов П.Ф.', name: 'глеб', fname: 'Жеглов', mname: 'Петрович1', balance: '1234.5', last_update: '10 секунд назад', status:  2 },
  ]
  status = [
    { id: 0, value: 'Подписка активна' },
    { id: 1, value: 'Приостановлена' },
    { id: 2, value: 'Заблокирован' },
  ];
  isOpenDial =  new BehaviorSubject<boolean>(false)
  selectedStatus = this.status[2].value;
  form: FormGroup = new FormGroup({
    statusControl : new FormControl(this.status[0].value)
  });
  usersParam: number | null = null;
  fakeUsers: User[] = [];
  sInterval! :Subscription;
  showSpinner = false;
  selectedTab:number = 0;
  tabs = ['Все', 'Заблокированные', 'Активные'];
  errorMsg!: string;
  firstTimeCall: number = 0;


  ngOnInit(): void {
    this.showSpinner = true;
    // this.fakeUsers = this.users;

    this.isOpenDial.subscribe(
      (data) => {
        if (data === true) {
          this.stopUpdate()
        }
        if (data === false) {
          this.getUsers(this.usersParam)
        }
      }
    )
  }

  getUsersInterval() {
    if (this.isOpenDial.value === false) {
      this.sInterval = interval(5000).subscribe(
          () => {
            this.getUsers(this.usersParam);
          }
        )
    }
  }


  getUsers(param: number | null){
    this.errorMsg = '';
    // this.fakeUsers = this.users;
    this.httpService.getUsers(param)
    .subscribe({
           next: (data: any) => {

            if (data['message'] ) {
                this.errorMsg = data['message']

                this.stopUpdate()
                setTimeout(
                  () => { console.log('setTimeout');
                    this.getUsers(param)}
                  , 5000)
            } else {
              this.fakeUsers = data;
              this.errorMsg = '';
              this.showSpinner = false;
              this.firstTimeCall === 1;

              if (!this.sInterval || this.sInterval.closed ) {
                this.getUsersInterval()
              }
            }
          },
          error:(err) => {
            console.log(err);
            this.stopUpdate()
          }
  });


  }

  stopUpdate() {
    console.log('this.stopUpdate()');
    if (this.sInterval) {
      this.sInterval.unsubscribe()
    }
  }

  selectTab(event: MatTabChangeEvent){
    this.showSpinner = true;
    this.stopUpdate();
    this.fakeUsers = [];

    switch (event.index) {
      case 0: {
        this.usersParam = null
        break;
      };
      case 1: {
        this.usersParam = 2
        break;
      };
      case 2: {
        this.usersParam = 0
        break;
      };
    }
    this.getUsers(this.usersParam);
  }

  openDialog(data: User | any): void {

    this.isOpenDial.next(true)
      const dialogRef = this.dialog.open(DialogUser, {
      width:  '916px',
      height: '573px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result:FormGroup) => {
      // this.updateUser(result)
      console.log('данные при закрытии диалогового окна ', result);

      this.isOpenDial.next(false)
    });
  }

  updateUser(controls: FormGroup) {
    let result = {}
  }
}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-user.html',
  styleUrls: ['./users.component.scss']
})
export class DialogUser {
  status = this.userComponent.status;
  form : FormGroup = new FormGroup({
    name: new FormControl(this.data.name),
    fname: new FormControl(this.data.fname),
    mname: new FormControl(this.data.mname),
    status: new FormControl(this.status[this.data.status].id),
  })

  constructor(private userComponent: UsersComponent,public dialogRef: MatDialogRef<DialogUser>,
              @Inject(MAT_DIALOG_DATA) public data: User,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  send(form: FormGroup) {
    console.log(form);
    let sendData = {} ;
    if (form.controls['name'].pristine === false) {
      // console.log(form.controls['name'].value);
      sendData = {name: form.controls['name'].value}
    }

    console.log(sendData);

    for (let i in form) {
      let team = form.value[i]
      // Ниже условие фильтрации
      // if (team.controls.pristine === false) {
        console.log(team);

      // }
    }
  }
}
