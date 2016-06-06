
module.exports = function(router) {
        
	router.get('/Tasks', (req, res) => {
		res.status(200);
		res.json({'message': "ok"});
	});

};

