var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session')

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var users = new Array();

users[0] = {
	"userId" : 0,
	"name" : "jin",
	"password" : "abc",
	"isAdmin" : true
}
users[1] = {
	"userId" : 1,
	"name" : "jin",
	"password" : "abc",
	"isAdmin" : false
}

app.put('/login', function (req, res) {
	for(var i=0;i<users.length;i++)
	{
		if(users[i].userId==req.body.userId)
		{
			if(users[i].password==req.body.password)
			{
				if(users[i].isAdmin==true)
				{
					req.session.isAdmin=true;
				}
				req.session.userId=req.body.userId;
				res.send("Login");
			}
			else
			{
				res.send("The username or password do not match.")
			}
		}
	}
});

app.put('/logout', function (req, res) {
	if(req.session.userId!=null)
	{
		req.session.userId=null;
		res.send("LogOut");
	}
	else
	{
		res.send("로그인상태가아닙니다");
	}

});

var auth = function (req, res, next) {

	if (req.session.userId!=null&&req.session.isAdmin==true)
		next();
	else
		res.send("you are not addmin");

};
app.get('/user/:userId', auth,function (req, res) {
	var userId = req.params.userId;
    console.log(users[userId]);
    res.send(users[userId]);
});

app.post('/user', auth,function (req, res) {
	users[req.body.id] = [req.body.userId, req.body.name, req.body.password, req.body.isAdmin];
	res.send(users[req.body.id]);
})

app.put('/user',auth, function (req, res) {
	var id=req.session.userId;
	users[id] = [req.body.userId, req.body.name, req.body.password, req.body.isAdmin];
	res.send("update")
})


app.delete('/user/:userId',auth, function (req, res) {
	users.splice(req.params.users, 1);
    res.send(users);
})

var server = app.listen(80);
