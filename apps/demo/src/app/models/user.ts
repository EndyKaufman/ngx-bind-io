import { plainToClassFromExist } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class User {
  static strings = {
    id: 'Id',
    username: 'Username',
    email: 'Email',
    roles: 'Roles',
    isSuperuser: 'Administrator',
    isStaff: 'Staff',
    isActive: 'User'
  };

  id: number = undefined;
  @IsNotEmpty()
  username: string = undefined;
  @IsEmail()
  @IsNotEmpty()
  email: string = undefined;
  isSuperuser: boolean = undefined;
  isStaff: boolean = undefined;
  isActive: boolean = undefined;

  get roles() {
    const roles: string[] = [];
    if (this.isActive) {
      roles.push('User');
    }
    if (this.isStaff) {
      roles.push('Staff');
    }
    if (this.isSuperuser) {
      roles.push('Admin');
    }
    return roles.join(', ');
  }

  toString() {
    return this.username;
  }

  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }
}
