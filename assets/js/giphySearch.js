// JavaScript function that wraps everything
$(document).ready(function() {

    $("#submit").on("click", function() {
      event.preventDefault();
      var queryURL = getQueryURL();

        $.ajax({
          url: queryURL,
          method: "GET"
        }).done(function(response) {

          createPill();

          var results = response.data;
          for (var i = 0; i < results.length; i++) {
              var searchDiv = $("<div>");
              var p = $("<p>");
              p.text("Rating:" + results[i].rating);
              
              var searchImage = $("<img>");
              searchImage.attr("src", results[i].images.fixed_height_still.url);
              searchImage.attr("data-still", results[i].images.fixed_height_still.url);
              searchImage.attr("data-animate", results[i].images.fixed_height.url);              
              searchImage.attr("data-state", "still");
              searchImage.addClass("gif");  

              searchDiv.append(p);
              searchDiv.append(searchImage);            
              $("#giphyImages").prepend(searchImage);

          }

        }); // ajax
    }); //submit

    $("#infoBtn").on("click", function(){
         $("#info").fadeToggle();
    });
    $("#infoWindowCloseBtn").on("click", function(){
         $("#info").fadeToggle();
    });

    $(document).on('click','img', function() {
        var state = $(this).attr("data-state");

        if (state == "still"){
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        }
        else if (state == "animate"){
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    });

    $(document).mouseup(function(e){
        // if the information div is open, toggle it close
        var container = $("#info");
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) 
        {
            container.hide();
        }
     });    
// ************** functions *********************
  function getQueryURL(){
      var searchItem = $("#Search").val();
      var api_key = "dc6zaTOxFJmzC";
      var queryURL= "http://api.giphy.com/v1/gifs/search?q=" + searchItem + "&api_key=" + api_key + "&limit=10";
      return queryURL;
  }

  function createPill(){
    var searchTerm = $("#Search").val();
    $("#Search").text("");

    var li = $("<li class='nav-item'>");
    var a = $("<a href='#' class='nav-link'>");
    a.text(searchTerm);
    a.attr("data-value", searchTerm);
    li.append(a);
    $("#giphyButtons").append(li);


  }
});
