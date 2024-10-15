class CookieHandler {
    // Method to get a specific cookie by name
    getCookie(name) {
        let cookieArr = document.cookie.split(";");

        for (let i = 0; i < cookieArr.length; i++) {
            let cookie = cookieArr[i].trim();
            
            if (cookie.indexOf(name + "=") === 0) {
                return cookie.substring((name + "=").length, cookie.length);
            }
        }
        
        return null;  // Return null if the cookie is not found
    }
}


export default CookieHandler;