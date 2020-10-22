var express    = require("express");
var app        = express();
// used for POST method
var bodyParser = require("body-parser");
// adapter: connect MySQL and talk to the MySQL database
var mysql      = require("mysql");
var bcrypt     = require("bcrypt");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'CS425Project'
});
// used for authentication
var passport = require("passport");
// used for local authentication
var localStrategy = require("passport-local").Strategy;
// require customer model
// var customer = require("./models/customer");
var session = require("express-session");
var methodOverride = require("method-override");



// tell express all templates will be .ejs
app.set("view engine", "ejs");
// tell express to use bodyParser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// set passport up
app.use(passport.initialize());
app.use(passport.session());
// session
app.use(session({
	secret: "CS425Project",
	resave: false,
	saveUninitialized: false
}));
// in order to use the img in /public folder
// define the path in node, in this case, /public is a valid location
var path = require('path');
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));



//====================================
// Routes
//====================================

// get the home page
app.get("/", function(req, res){
	// add the product information from database into home page
	var sql = 'SELECT * FROM PRODUCT';
	connection.query(sql, function(error, results, fields){
		// if there is product in databse
		if(results){
			var product = results;
			// if login
			if(req.session.loggedin){
				res.render("home_loggedin.ejs", {product: product});
				return;
			}
			// if there is no session, render home page
			res.render("home.ejs", {product: product});
		}
		// if no product in database
		else{
			var product = null;
			// if login
			if(req.session.loggedin){
				res.render("home_loggedin.ejs", {product: product});
				return;
			}
			// if there is no session, redirect to the home page
			res.render("home.ejs", {product: product});
		}
	});
});

app.get("/home_test", function(req, res){
	res.render("home_test.ejs");
})

// get the register page
app.get("/register", function(req, res){
	res.render("register.ejs");
});

// post router, for user to create an account
app.post("/register", function(req, res){
	// get data from form
	var email       = req.body.email;
	var pwd         = req.body.password;
	var password    = bcrypt.hashSync(pwd, 10);
	var firstName   = req.body.firstName;
	var middleName  = req.body.middleName;
	var lastName    = req.body.lastName;
	var phoneNumber = req.body.phoneNumber;
	var address     = req.body.address;
	var frequentCustomer = {
		EMAIL: email, 
		FIRSTNAME: firstName,          
		MIDDLENAME: middleName,
		LASTNAME: lastName,
		CUSTOMER_PHONENUMBER:phoneNumber,
    	FREQUENCY: 1,
    	ADDRESS: address,
    	PASSWORD: password,
	};
	var sql = 'INSERT INTO CUSTOMERS SET ?';
	// insert the value into database
	// frequentCustomer: values following the sequence of attributes of table in database
	connection.query(sql, frequentCustomer, function (error, results, fields) {
	   if (error) throw error; 
	});
	// after creating a new account, redirect to home page
	res.redirect("/");
});

// get the login page
app.get("/login", function(req, res){
	res.render("login.ejs");
});
// login logic
app.post("/login", function(req, res){
	var email    = req.body.email;
	var password = req.body.password;
	// check whether the email is in database
	// if email is not null
	if(email){
		connection.query('SELECT * FROM CUSTOMERS WHERE email = ?',[email], function(error, results, fields){
			if(results.length > 0){
				// check whether the password is correct
				// if password is correct, maintain login
				if(bcrypt.compareSync(password, results[0].PASSWORD)){
					req.session.customer = results;
				   	req.session.loggedin = true;
					req.session.email = email;
					// after login, redirect to home page
					res.redirect("/");
				}
				// if password is incorrect
				else{
					res.send('Incorrect email/password');
				}
			}
			// if database don't exist this customer
			else{
				res.send('Incorrect email/password');
			}
			res.end();
		});
	}else{
		res.send('Please enter Email and Password');
		res.end();
	}
});

// get logout page
app.get('/logout', function(req, res, next) {
  if (req.session) {
	customerID = null;
	// if there is a session, delete session object and redirect to the home page
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});


// get the member's profile page if the customer have loged in his/her account successfully
app.get("/profile", function(req, res){
	var customer = req.session.customer;
	if(req.session.loggedin){
		res.render("profile.ejs", {customer: customer[0]});
	}
	// not login, give a hint, then redirect to login page
	else{
		res.redirect("/login");
	}
});
// get the user's purchase history
app.get("/history", function(req, res){
	res.render("history.ejs");
})

// edit profile
app.get("/profile/edit", function(req, res){
	if(req.session.loggedin){
		res.render("profile_edit.ejs")
	}
	else{
		res.render('login.ejs')
	}
});
var customerID;
app.post("/profile/edit", function(req, res){
	customerID = req.body.customerID;
	res.render('profile_edit.ejs', {customerID: customerID});
});
app.post("/profile/edit/success", function(req, res){
	console.log(req.body);
	var customerID  = req.body.customerID;
	var firstName   = req.body.firstName;
	var middleName  = req.body.middleName;
	var lastName    = req.body.lastName;
	var phoneNumber = req.body.phoneNumber;
	var address     = req.body.address;
	sql = "UPDATE CUSTOMERS SET FIRSTNAME = ?, MIDDLENAME = ?, LASTNAME = ?, CUSTOMER_PHONENUMBER = ?, ADDRESS = ? WHERE CUSTOMER_ID = ?";
	connection.query(sql, [firstName, middleName, lastName, phoneNumber, address, customerID], function(error, results, files){
		console.log(results);
	});
	// res.redirect("/profile/edit");
	res.send("Edit successfully")
});



// Cart router: add items to cart
var itemsInCart = [];
app.post("/cart", function(req, res){
	// When Add to Cart, prompt hint "Add to Cart Successfully"
	// add the product ID into an array
	itemsInCart.push(req.body.ProductInCart);
	res.redirect('/');
});

app.get("/cart", function(req, res){
	// console.log(req);
	let sql = 'SELECT * FROM PRODUCT WHERE PRODUCT_ID IN (?)';
	connection.query(sql, [itemsInCart], function(error, results, fields){
		if(results){
			let items = results;
			res.render("cart.ejs", {items: items});
			return;
		}
		else{
			let items = null;
			res.render("cart.ejs", {items: items});
		}
	});
});

app.post("/checkout_cardInfo", function(req, res){
	res.redirect("/checkout_cardInfo");
});

app.get("/checkout_cardInfo", function(req, res){
	res.render("checkout_cardInfo.ejs");
});

var cardInfo = [];
app.post("/checkout_shipInfo", function(req, res){
	cardInfo.push(req.body);
	res.redirect('/checkout_shipInfo');
});

app.get("/checkout_shipInfo", function(req, res){
	res.render("checkout_shipInfo.ejs");
});

var ship = [];
app.post("/placeOrder", function(req, res){
	ship.push(req.body);
	res.redirect('/placeOrder');
});

app.get("/placeOrder", function(req, res){
	let sql = 'SELECT * FROM PRODUCT WHERE PRODUCT_ID IN (?)';
	connection.query(sql, [itemsInCart], function(error, results, fields){
		if(results){
			let items = results;
			res.render("placeOrder.ejs", {items: items, cardInfo: cardInfo, ship: ship, customerID: customerID});
			return;
		}
		else{
			let items = null;
			res.render("placeOrder.ejs", {items: items, cardInfo: cardInfo, ship: ship, customerID: customerID});
		}
	});
});

app.post("/finish", function(req, res){
	sql = 'INSERT INTO ORDERS SET ?'
	var set = req.body;
	console.log(set);
	connection.query(sql, [set], function(error, results, fileds){
		console.log(results);
	})
	res.send("Order placed successfully, Thank you!");
})

// get the unkonwn page if user input undefined page
app.get("*", function(req, res){
	res.render("unknown.ejs");
});

// connect the server
app.listen(3000, function(){
	console.log("Server has started!")
});
