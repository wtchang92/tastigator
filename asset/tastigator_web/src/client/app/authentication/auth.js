module.exports = {
    login: function(username, pass, successFunction) {
        if (localStorage.token) {
            console.log("logging in")
            successFunction()
        }
        else {
            console.log("logging in 0")
            this.getTokenAndLogin(username, pass, successFunction)
        }
    },        
    
    logout: function() {
        delete localStorage.token
    },

    loggedIn: function() {
        return !!localStorage.token
    },

    getToken: function(username, pass, cb) {
        $.ajax({
            type: 'POST',
            url: '/api/obtain-auth-token/',
            data: {
                username: username.toLowerCase(),
                password: pass
            },
            success: function(res){
                cb({
                    authenticated: true,
                    token: res.token
                })
            }
        })
    },

    getTokenAndLogin: function(username, pass, successFunction) {
        console.log("logging in 1")

        $.ajax({
            type: 'POST',
            url: '/api/obtain-auth-token/',
            data: {
                username: username.toLowerCase(),
                password: pass
            },
            success: function(res){
                if (res.authenticated) {
                    localStorage.token = res.token
                    console.log("logging in 2")
                    successFunction()
                }
            }
        })
    },


    signUp: function(username, email, pass, confirm_pass, cb) {
        if (pass ===confirm_pass) {
            var data = {
                    username: username,
                    email:email,
                    password: pass,
                    confirm_pass: confirm_pass,
                    new_pass: null,
                    new_confirm_pass: null,
                };
            var context = this;
            $.ajax({
                type: 'POST',
                url: '/api/users/',
                data: data,
                success: function(res){
                     context.login(username, pass, cb)
                }.bind(this),
                  error: function(xhr, status, err) {
                    console.log("registration failed");
                  }.bind(this)
            })
        }
    },
}
