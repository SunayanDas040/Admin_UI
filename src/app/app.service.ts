import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { User } from './model/user.model';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    public dataChanged: EventEmitter<any> = new EventEmitter<any>();
    public users: User[] = [];
    constructor(private _http: HttpClient) {
        const result = this._http.get<User[]>('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
        result.subscribe((data: User[]) => {
            this.users = data;
            this.dataChanged.emit(this.users.slice());
        });
    }

    async getUsers() {
        return this.users.slice();
    }
}