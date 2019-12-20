const db = require("../modelsss")
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {

    // A GET route for scraping the echoJS website
    app.get("/scrape", function(req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://blog.scrapinghub.com/").then(function(response) {
    
        // Load the Response into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);
    
        // An empty array to save the data that we'll scrape
        var results = [];
    
        // With cheerio, find each p-tag with the "title" class
        // (i: iterator. element: the current element)
        $("div.post-item").each(function(i, element) {
    
        // Save the text of the element in a "title" variable
        var title = $(element).find('a').text()
    
        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        var link = $(element).find('a').attr('href')
    
        let des = $(element).find('p').text()
    
        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
            title: title,
            link: link,
            des: des
        });
        });
    
        // Log the results once you've looped through each of the elements found with cheerio
        
    
    
        
            // Create a new Article using the `result` object built from scraping
            db.Scrape.create(results)
            .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
            });
        });
    
        // Send a message to the client
        res.send("Scrape Complete")
        });
    
    app.post("/save", function(req, res){
        db.Article.create(req.body, function(error, saved) {
        if (error) {
            console.log(error)
        } else {
            res.send(saved)
        }
        })
    })
    
    app.get("/saved", function(req, res) {
        db.Article.find({}).then(function(articles){
        res.json(articles);
        })
    })
    
    
    // Route for getting all Articles from the db
    app.get("/articles", function(req, res) {
        db.Scrape.find({}).then(function(articles) {
        res.json(articles);
        });
    });
    
    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function(req, res) {
        db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function(foundArt) {
            console.warn('found art!', foundArt)
            res.json(foundArt);
        })
        .catch(function(err) {
            res.json(err);
        }
        );
    });
    
    
    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function(req, res) {
        db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({}, { $push: { note: dbNote._id } }, { new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
        }
    );
    
    app.get("/clear", function(req, res) {
        db.Article.remove({}).then(function(articles) {
        res.redirect("./save");
        });
    })

    app.get("/clearScrape", function(req, res) {
        db.Scrape.remove({}).then(function(articles) {
        res.redirect("./");
        });
    })

    app.get("/delete/:id", function(req, res) {
        db.Note.remove(
            {
                _id: req.params.id
            },
            function(error, removed) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(removed)
                    res.send(removed)
                }
            }
        ) 
    })
}
 