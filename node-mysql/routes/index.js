exports.index = function(req, res) {
	var message = '';
	 var sql="SELECT `url`, COUNT(`init`) AS `value_occurrence` FROM `skips` GROUP BY `url` ORDER BY `value_occurrence` DESC LIMIT 3;";          
	 db.query(sql, function(err, result){  
	 	res.render('index',{message:result});
	 });

	//res.render('index', {message: message})
};

