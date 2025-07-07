export interface IUserLogin {
    dataUser: DataUser;
    token:    string;
}
export interface IUserRegister{
    user:string;
    email:string;
    password:string;
}

export interface DataUser {
    id:           number;
    user:         string;
    email:        string;
    typeusers_id: number;
}



