import { Injectable } from '@angular/core';
import { User } from './user';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersList: Array<User> = [];
  userAvatarLink: string =
    'https://api.dicebear.com/6.x/initials/svg?radius=50';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getCountries() {
    return this.http.get<
      Array<{
        name: string;
        dial_code: string;
        code: string;
      }>
    >('/assets/countryCode.json');
  }

  getUsersList(): Array<User> {
    return [...this.usersList];
  }

  getUserById(id: number): User {
    return this.usersList[id - 1];
  }

  saveUser(user: any, id?: number) {
    let message = '';
    if (id) {
      this.usersList[id - 1] = user;
      message = 'User update successfully';
    } else {
      this.usersList.push(user);
      message = 'User created successfully';
    }
    this.openSnackBar(message);
  }

  convertJsonToXlsx(usersList: Array<User>) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Users List');
    worksheet.mergeCells('A1', 'F2');
    let sheetTitle = worksheet.getCell('A1');
    sheetTitle.value = 'List of Users';
    sheetTitle.font = {
      size: 16,
    };
    sheetTitle.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('A3', 'B3');
    let dateTitle = worksheet.getCell('A3');
    dateTitle.value = 'Report Generated On';
    worksheet.mergeCells('C3', 'D3');
    let date = worksheet.getCell('C3');
    let d = new Date();
    date.value = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()} | ${
      d.getHours() + 1
    }:${d.getMinutes()}`;
    worksheet.addRow([]);
    let subTitle = worksheet.getCell('A5');
    subTitle.value = 'List of Users';
    subTitle.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'afafaf' },
    };
    worksheet.addRow([]);
    const head = Object.keys(usersList[0]).map((h) => {
      return h.toUpperCase();
    });
    let headers = ['Sr.No.', ...head];
    worksheet.addRow(headers);
    let data: Array<Array<string>> = [];
    usersList.forEach((user, index) => {
      data.push([index + 1, ...Object.values(user)]);
    });
    data.forEach((d) => {
      worksheet.addRow(d);
    });
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(6).width = 30;
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'users_list' + '.xlsx');
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}
