
var bots = [{'id': 0, 'ip': '127.0.0.1', 'task': 1, 'workload': 0.0}, 
            {'id': 1, 'ip': '127.0.0.2', 'task': 2, 'workload': 1.0}, 
            {'id': 2, 'ip': '127.0.0.3', 'task': 3, 'workload': 1.0}, 
            {'id': 3, 'ip': '127.0.0.4', 'task': 4, 'workload': 0.0}]

module.exports = function(router, tokens) {
        
	router.get('/Status', (req, res) => {
		res.status(200);
		res.json(bots);
	});

	router.post('/Status', (req, res) => {
            
            var found = false;
            
            if (!inArray(req.headers.token, tokens))
            {
                res.status(403);
            }
            else
            {
                res.status(200);
                for (i = 0; i < bots.length; i++)
                {
                    bot = bots[i];

                    if (bot.id == req.body.id)
                    {
    //                    console.log(req.body.id+ " = "+bot.id);
                        bot.workload = req.body.status ? 1 : 0;
                        found = true;
                    }
                }
            }
            
            res.json({ 'message': found?'OK':'NOT OK' });
	});
};

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}