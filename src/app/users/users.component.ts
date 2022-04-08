import { Component, Inject, OnInit, Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../model/User';
import { BehaviorSubject, interval, map, Subscription, debounceTime } from 'rxjs';
@Injectable({ providedIn: 'root'})
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  constructor(private httpService: HttpService, public dialog: MatDialog) { }


  users: User[] = [
    { id: 1, foto_url: '', full_name: 'Иванов П.Ф.', name: 'Иван', fname: 'Иванов', mname: 'Петрович', balance: '1234.5', lastUpdatedAt: '10 секунд назад', status: 0},
    { id: 2, foto_url: '', full_name: 'Петров П.Ф.', name: 'иван', fname: 'Петров', mname: 'Петрович1', balance: '1234.5', lastUpdatedAt: '10 секунд назад', status:  0  },
    { id: 3, foto_url: '', full_name: 'Сидоров П.Ф.', name: 'Иван2', fname: 'Сидоров', mname: 'Петрович1', balance: '1234.5', lastUpdatedAt: '10 секунд назад', status:  0  },
    { id: 4, foto_url: '', full_name: 'Жеглов П.Ф.', name: 'глеб', fname: 'Жеглов', mname: 'Петрович1', balance: '1234.5', lastUpdatedAt: '10 секунд назад', status:  2 },
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
  sOpenDialog!: Subscription;
  sGetUser!: Subscription;
  showSpinner = false;
  selectedTab:number = 0;
  tabs = ['Все', 'Заблокированные', 'Активные'];
  errorMsg!: string;
  firstTimeCall: number = 0;


  ngOnInit(): void {
    this.showSpinner = true;

    this.sOpenDialog = this.isOpenDial.subscribe(
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

  ngOnDestroy(): void {
    if (this.sInterval) {
      this.sInterval.unsubscribe()
    }

    if (this.sOpenDialog) {
      this.sOpenDialog.unsubscribe()
    }
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
    this.sGetUser = this.httpService.getUsers(param)
    .subscribe({
           next: (data: any) => {

            if (data['message'] ) {
                this.errorMsg = data['message']

                this.stopUpdate()
                setTimeout(
                  () => { this.getUsers(param)}
                  , 5000)
            } else {
              this.fakeUsers = data.sort( (a: any, b: any) => a.id < b.id ? 1 : -1);

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
    if (this.sGetUser) {
      this.sGetUser.unsubscribe()
    }
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

  openDialog(data: User): void {

    this.isOpenDial.next(true)
      const dialogRef = this.dialog.open(DialogUser, {
      width:  '916px',
      height: '573px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result:User) => {
      this.isOpenDial.next(false)
      console.log(result);
      this.fakeUsers.forEach((data) => {
        if (data.id === result.id) {
          console.log(data);
          data.fname = result.fname
          data.name = result.name
          data.mname = result.mname
          data.status = result.status
        }
      }
      )
      console.log(this.fakeUsers);

    });
  }


}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-user.html',
  styleUrls: ['./users.component.scss']
})
export class DialogUser {
  status = this.userComponent.status;
  errorMsg = ''
  FormData: any;
  form : FormGroup = new FormGroup({
    name: new FormControl(this.data.name),
    fname: new FormControl(this.data.fname),
    mname: new FormControl(this.data.mname),
    status: new FormControl(this.status[this.data.status].id),
  })

  constructor(private userComponent: UsersComponent,
              public dialogRef: MatDialogRef<DialogUser>,
              private httpService: HttpService,
              @Inject(MAT_DIALOG_DATA) public data: User,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  send(form: FormGroup) {
    let formV = {
      id: this.data.id,
      name: form.controls['name'].value,
      fname: form.controls['fname'].value,
      mname: form.controls['mname'].value,
      status: form.controls['status'].value
    }

    this.httpService.updateUser(formV).subscribe({
      next: (data) => {console.log('data - ', data)
      if (data.status === 200) {
        this.dialogRef.close( formV);
      } else {
        console.log('Ошибка обновления');
        this.errorMsg = 'Ошибка обновления'
      }
    },
    error: (err) => {console.log(err);
    }
  });
  }
}
