import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsersService } from '../services/users.service';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UsersStore {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.usersSubject.asObservable();

  constructor(private usersService: UsersService) {}

  loadUsers(): void {
    this.usersService.getUsers().subscribe(users => {
      this.usersSubject.next(users);
    });
  }

  addUser(user: User): void {
    this.usersService.createUser(user).subscribe(newUser => {
      const users = [...this.usersSubject.value, newUser];
      this.usersSubject.next(users);
    });
  }

  updateUser(user: User): void {
    this.usersService.updateUser(user.id_user, user).subscribe(updatedUser => {
      const users = this.usersSubject.value.map(u => u.id_user === updatedUser.id_user ? updatedUser : u);
      this.usersSubject.next(users);
    });
  }

  deleteUser(id: string): void {
    this.usersService.deleteUser(Number(id)).subscribe(() => {
      const users = this.usersSubject.value.filter(u => u.id_user !== Number(id));
      this.usersSubject.next(users);
    });
  }
}
