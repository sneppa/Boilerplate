var fs    = require('fs');

var bots;
fs.readFile('bots.json', (err, data) => {
  if (err) throw err;
  bots = JSON.parse(data);
});
       
module.exports = function(router, tokens) {
        
	router.get('/Status', (req, res) => {
            console.log("Rufe Bots ab.");
            res.status(200);
            res.json(bots);
	});
        
	router.get('/Status/:id', (req, res) => {
            console.log("Rufe Bot "+req.params.id+" ab.");
            
            found = false;
            for (i = 0; i < bots.length; i++)
            {
                bot = bots[i];

                if (bot.id == req.params.id)
                {
                    res.json(bot);
                    found = true;
                }
            }
            
            if (!found)
                res.json({ 'message': 'NOT OK' });
	});

	router.post('/Status/:id', (req, res) => {
            console.log("Ändere Bot: "+req.params.id);
            
            var found = false;
            
            if (!inArray(req.headers.token, tokens))
            {
                res.status(403);
            }
            else
            {
                for (i = 0; i < bots.length; i++)
                {
                    bot = bots[i];
                    
                    if (bot.id == req.params.id)
                    {
                        if (req.body.ip)
                            bot.ip = req.body.ip;
                        if (req.body.task)
                            bot.task = req.body.task;
                        if (req.body.workload)
                            bot.workload = req.body.workload;
                        
                        saveBots();
                        
                        found = true;
                    }
                }
            }
            
            res.json({ 'message': found?'OK':'NOT OK' });
	});

	router.post('/Status', (req, res) => {
            console.log("Toggle Bot.");
            
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
                        
                        saveBots();
                        
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

function saveBots() {
    fs.writeFile('bots.json', JSON.stringify(bots), (err) => {
    if (err) throw err;
    console.log('Bots gespeichert');
    });
}