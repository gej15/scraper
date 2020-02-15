  
$("#scrapeButton").on("click", function() {
  fetch("./scrape") 
  setTimeout( function() {loadScrapedArticles()}, 500)
  setTimeout( function() {console.log("this is a timeout")}, 250)
})



$("#clearScrape").on("click", function() {
  document.location.href = "/clearScrape"
})

function loadScrapedArticles() {
// Grab the articles as a json
  $.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      console.log(data[i])
      $("#articles").append(
        "<p id=title data-id='" + data[i]._id + "'>Title: " + data[i].title + "</p>"
        +"<p id=des> Description: " + data[i].des + "</p>"
        +"<p id=url>URL: <a href='" + data[i].link + "'>" + data[i].link + "</a></p>"
        +"<button id=save data-id=" + data[i]._id + " title=" + data[i].title + " des=" + data[i].des + " url=" +data[i].link + ">save</button>"
        +"<p>\n</p>"
        +"<p>-------------------------------------</p>"
        );
    }
  });
}

loadScrapedArticles()


// Whenever someone clicks a p tag
$(document).on("click", "#save", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  let data = []

  var thisId = $(this).attr("data-id");
  let thisTitle = $(this).siblings('p').eq(0).text().slice(9)
  let thisDes = $(this).siblings('p').eq(1).text().slice(14);
  let thisLink = $(this).attr("url");
 

  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/save", 
    data: {
      title: thisTitle,
      des: thisDes,
      link: thisLink
    }
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      })
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId)

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});