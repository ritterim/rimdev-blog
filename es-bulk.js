var elasticsearch = require('elasticsearch'),
    fs = require('fs'),
    content = JSON.parse(fs.readFileSync(__dirname + '/_site/search.json')),
    client = new elasticsearch.Client({
        host: 'localhost:9200',
        log: 'trace'
    });

for (var i = 0; i < content.length; i++) {
    var item = content[i],    
        id = item.id,
        type = item.site;

    client.create({
        index: "jekyll",
        type: type,
        id: id,
        body: item
    }, function (error, response) {
        if (error) {
            console.error(error);
            return;
        }
        else {
            console.log(response);  //  I don't recommend this but I like having my console flooded with stuff.  It looks cool.  Like I'm compiling a kernel really fast.
        }
    })
}