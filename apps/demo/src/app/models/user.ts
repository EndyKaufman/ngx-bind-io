import { Expose, plainToClassFromExist } from 'class-transformer';
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

  @Expose()
  id: number;

  @IsNotEmpty()
  @Expose()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  @Expose()
  isSuperuser: boolean;

  @Expose()
  isStaff: boolean;

  @Expose()
  isActive: boolean;

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
