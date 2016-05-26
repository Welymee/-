var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');	// file system

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express wtf 6666' });
});

router.get('/demo',function(req,res,next){
	res.render('demo',{ name: "This is the demo" });
});

// router.post('/demo2',function(req,res,next){
	// res.render('demo',{ name: "This is the demo" });
// });

router.all('/login',function(req,res,next){
	if("GET"==req.method){
		res.render('login',{});
	}else if("POST"==req.method){
		// res.json({result:0});
		// console.log(req.body);
		// if(req.body.uname == "admin" && req.body.upass == "admin"){
			// res.redirect("/");
		// }else{
			// res.render("login",{ err: "登陆失败"});
		// }
		fs.readFile(path.join(__dirname,"user.db"),"utf8",function(err,txt){
			if(err){
				return res.render("login",{err:err.message});
			}else{
				// console.log(txt);
				// res.send("---")
				var array = txt.split("\r\n");
				while(true){
					var item = array.shift();
					if(!item){
						break;
					}
					var infos = item.split(":");
					var uname = infos[0];
					var upass = infos[1];
					if(req.body.uname == uname && req.body.upass == upass){
						return res.redirect("/");
					}
				}
				res.render("login",{ err: "用户名或密码错误"});
			}
		});
	}
	
});

router.all('/regist',function( req, res, next){
	//fs.appendFile
	//判断注册用户名密码是否存在: , \r\n   req.body.uname.indexOf(":")  -1  不存在冒号, 否则存在，提示：非法字符
	//用户名，密码，确认密码，  密码和确认密码是否一致  不一致，提示：密码与确认密码不一致
	if ("GET"==req.method){
		res.render('regist',{});
	}else if("POST"==req.method){
		if (req.body.upass != req.body.reupass){
			return res.render("regist",{err:"密码与确认密码不一致"});
		}else{
			var data = "\r\n"+req.body.uname+":"+req.body.upass;
			fs.appendFile(path.join(__dirname,"user.db"),data,function(err,code){
				if(err){
					return res.render("regist",{err:err.message});
				}else{
					return res.render("regist",{ message: "注册成功\r\n用户名是:"+req.body.uname});
				}
			})
			
		}
		
	}
});


module.exports = router;
