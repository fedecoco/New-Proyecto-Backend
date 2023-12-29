export default class UserDto{
    constructor(user){
        this.first_name = user.first_name
        this.last_name = user.last_name;
        this.email = user.email;
        this.role = user.role;
        this.id = user._id;
        this.last_connection = user.last_connection;
        this.documents = user.documents; 
    }
}