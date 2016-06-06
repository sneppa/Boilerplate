
var tasks = [{id: 0, type: 'hash-md5', data: { input: 'pupsen', output: null }}];
var allowedTypes = ["hash-sha256", "hash-md5", "crack-md5"];

module.exports = function(router, tokens) {
        
	router.get('/Tasks', (req, res) => {
		res.status(200);
		res.json(tasks);
	});

	router.post('/Tasks', (req, res) => {
            
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
        if (maxid < i)
            maxid = i;
    return maxid+1;
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}