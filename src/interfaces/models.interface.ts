// models.interface.ts
interface IUser {
    userId?: string;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    googleId?: string;
    profilePicture?: string;
    isManualAuth?: boolean;
    createdAt?: Date;
    updateAt?: Date;
  }
  
  export { IUser };