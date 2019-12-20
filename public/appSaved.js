$.getJSON("/saved", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      console.log(data[i])
      $("#articles").append(
        "<p id=title data-id='" + data[i]._id + "'>Title: " + data[i].title + "</p>"
        +"<p id=des> Description: " + data[i].des + "</p>"
        +"<p id=url>URL: <a href='" + data[i].link + "'>" + data[i].link + "</a></p>"
        +"<button id=displayNote data-id=" + data[i]._id + " title=" + data[i].title + " des=" + data[i].des + " url=" +data[i].link + ">Note</button>"
        +"<p>\n</p>"
        +"<p>-------------------------------------</p>"
        );
    }
  });

  $("#clearSavedArticles").on("click", function() {
    document.location.href = "/clear"
  })

  $(document).on("click", "#displayNote", function() {

    $("#notes").empty();

    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })

      .then(function(data) {
        console.log(data);
        $("#notes").append("<h2>" + "Article: " + "'" + data.title + "'" + "</h2>");
        $("#notes").append("<input id='titleinput' placeholder=title name='title' >");
        $("#notes").append("<textarea id='bodyinput' placeholder=body name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        
  
        if (data.note) {
            $("#notes").append("<h2>Saved Note</h2>")
            for (let object of data.note) {
              $("#notes").append(
                  "<div>"
                + "<h4>Title: " + object.title + "</h4>"
                + "<p>Body: " + object.body + "</p>"
                + "<button id=noteDelete noteId=" + object._id + ">delete</button>"
                + "<p>--------------------</p>"
                + "</div>"
              )
            }
           
        }
      });
  });

  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    console.log(thisId)
    noteData = [ ]
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      },
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

  $(document).on("click", "#noteDelete", function() {
    thisId = $(this).attr("noteId")
    console.log(thisId)
    currentObject = $(this).parent()
    $.ajax({
      method: "GET",
      url: "/delete/" + thisId,
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        currentObject.remove()

        // Empty the notes section
      });
    })