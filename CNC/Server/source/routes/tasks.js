var fs    = require('fs');

var tasks;
fs.readFile('tasks.json', (err, data) => {
  if (err) throw err;
  tasks = JSON.parse(data);
});

var allowedTypes = ["hash-sha256", "hash-md5", "crack-md5"];

module.exports = function(router, tokens) {
        
	router.get('/Tasks', (req, res) => {
            console.log("Rufe Tasks ab.");
            res.status(200);
            res.json(tasks);
	});

	router.post('/Tasks/:id', (req, res) => {
            console.log("Ändere Task: "+req.params.id);
            
            var found = false;
            
            if (!inArray(req.headers.token, tokens))
            {
                res.status(403);
            }
            else
            {
                for (i = 0; i < tasks.length; i++)
                {
                    task = tasks[i];
                    
                    if (task.id == req.params.id)
                    {
                        if (req.body.type && inArray(req.body.type, allowedTypes))
                            task.type = req.body.type;
                        if (req.body.data)
                        {
                            if (req.body.data.input)
                                task.data.input = req.body.data.input;
                            if (req.body.data.output)
                                task.data.output = req.body.data.output;
                        }
                    
                        saveTasks();
                        
                        found = true;
                    }
                }
            }
            
            res.json({ 'message': found?'OK':'NOT OK' });
	});

	router.post('/Tasks', (req, res) => {
            console.log("Füge Task hinzu.");
            
            inserted = false;
            if (!inArray(req.headers.token, tokens))
            {
                res.status(403);
            }
            else
            {
                res.status(200);

                newtask = req.body;
                if (newtask.data.input != "" && inArray(newtask.type, allowedTypes))
                {
                    newtask.id = getNewId();
                    newtask.data.output = null;

                    tasks.push(newtask);
                    
                    saveTasks();

                    inserted = true;
                }
            }
        
            res.json({ 'message': inserted?'OK':'NOT OK' });
	});

};


function getNewId()
{
    maxid = 0;
    for (i = 0; i < tasks.length; i++)
        if (maxid < tasks[i].id)
            maxid = tasks[i].id;
    return maxid+1;
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

function saveTasks() {
    fs.writeFile('tasks.json', JSON.stringify(tasks), (err) => {
    if (err) throw err;
    console.log('Tasks gespeichert');
    });
}