class UserHandler {
    constructor(cookieHandler) {
        this.cookieHandler = cookieHandler;
    }

    getUserInfo() {
        let user = this.cookieHandler.getCookie("user");

       return user
    }
}

export default UserHandler
