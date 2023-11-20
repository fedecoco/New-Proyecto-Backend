export default class CustomError{
    static createError({name="Error", cause, message, code=1}){
        const error = new Error(message,);
        error.name = name;
        error.cause = cause ? new Error(cause): null;
        error.code = code;
        
        throw error;
    }
}