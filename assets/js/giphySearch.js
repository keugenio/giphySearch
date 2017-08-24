// JavaScript function that wraps everything
$(document).ready(function() {
  var searchItemArray=[];

  //*********  create Home button/pill and corresponding div **********//
  makeButton("Home","Home");
  createHomeTabPane("Home");

  // ************ onclick/mouse events ********************* //
    $("#submit").on("click", function() {
      event.preventDefault();
      var queryURL = getQueryURL();
      var searchTerm = getSearchBox();
      if (searchItemArray.indexOf(searchTerm)<0){
        $.ajax({
          url: queryURL,
          method: "GET"
        }).done(function(response) {
          var anID = response.meta.response_id;
          var results = response.data;

          // reset the current pills and their respective panes by removing the 'active' class from the li and div
          resetSearchResultsPills();

          // create a button/pill that links to the unique id of the tab with its images
          createPill(anID);

          //create a tab-pane to hold all images from search. this needs a unique id to be addressed by its button/pill
          createTabPaneAndImages(results,anID);         

        }); // ajax call
      } else {
      	alert("already searched");
      	// clear all the buttons and tabs
      	resetSearchResultsPills();
      	// find the button already searched, set class to active. find corresponding tab-pane and set that to active
      	findAndSetButtonAndTab(searchTerm);      	
      }
    }); //submit

    $("#infoBtn").on("click", function(){
         $("#info").fadeToggle();
    });
    $("#infoWindowCloseBtn").on("click", function(){
         $("#info").fadeToggle();
    });
    $(document).on("mouseenter", ".gif", function() {
      $(this).css({border: '0 solid #f37736'}).animate({                
          borderWidth: 4
      }, 500);      
    });
    $(document).on("mouseleave", ".gif", function() {
     $(this).animate({   
        borderWidth: 0
      }, 500);
    });
    $(document).on("mouseenter", ".giphyButton", function() {
      $(this).css({border: '0 solid #f37736'}).animate({                
          borderWidth: 1
      }, 500);      
    });
    $(document).on("mouseleave", ".giphyButton", function() {
     $(this).animate({   
        borderWidth: 0
      }, 500);
    });

    $(document).on('click','.gif', function() {
      swapAnimation(this);     
    });

    $(document).on("click", ".nav-item", function(){
      if (this.children[0].text !== "Home")
        $("#searchHeading").html("search(" + this.children[0].text + ")");
      resetSearchResultsPills();
      $(this.children[0].hash).addClass("d-flex flex-row flex-wrap align-self-start tab-pane fade in active giphyImages");
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
      var searchItem = getSearchBox();
      var api_key = "dc6zaTOxFJmzC";
      var queryURL= "http://api.giphy.com/v1/gifs/search?q=" + searchItem + "&api_key=" + api_key + "&limit=10";
      return queryURL;
  }
  function createPill(anID){
  	// reset search bar and make the button
    var searchTerm = getSearchBox();
    $("#searchHeading").html("search(" + searchTerm + ")");
    resetSearchBox();
    searchItemArray.push(searchTerm);

    // searchItemArray.push(searchTerm);
    makeButton(searchTerm, anID);
  }
  function makeButton(searchTerm, anID){
    var li = $("<li class='nav-item giphyButton active'>");
    li.attr("id", searchTerm + "-l")
    li.attr("data-toggle", "pill");
    var a = $("<a href='#" + anID + "-d" +"' class='nav-link'>");
    a.text(searchTerm);
    a.attr("data-value", searchTerm);
    li.append(a);
    $("#giphyButtons").append(li);
  }
  function createHomeTabPane(anID){
    var imgDiv = $("<div>");
    imgDiv.addClass("d-flex flex-row flex-wrap align-self-start tab-pane fade in active giphyImages");
    imgDiv.attr("id", anID + "-d");    

    var figure = $("<div class='figure'>");
    var image = $("<img>");
    image.attr("src", "assets/images/giphysearch/giphysearch.gif");
    image.addClass("gif img-fluid fig-img");

    figure.append(image);
    imgDiv.append(figure);  
    
    // add the image Div to search results
    $("#searchResults").prepend(imgDiv);
  }
  function createTabPaneAndImages(results,anID){
    var imgDiv = $("<div>");
    imgDiv.addClass("d-flex flex-row flex-wrap align-self-start tab-pane fade in active giphyImages");
    imgDiv.attr("id", anID + "-d");

    // create img and it's rating for each of the results returned. include all animate and still info
    // add each img to its tab-pane div
    for (var i = 0; i < results.length; i++) {

        var figure = $("<div class='figure'>");
        var caption = $("<div class='figure-caption text-right'>");
        caption.html("Rated:" + results[i].rating);
        
        var image = $("<img>");
        image.attr("src", results[i].images.fixed_height_still.url);
        image.attr("data-still", results[i].images.fixed_height_still.url);
        image.attr("data-animate", results[i].images.fixed_height.url);              
        image.attr("data-state", "still");
        image.attr("alt", anID);        
        image.addClass("gif img-fluid fig-img");  

        figure.append(image);
        figure.append(caption);
        imgDiv.append(figure);            
    }
    // add the image Div to search results
    $("#searchResults").prepend(imgDiv);     
  }

  function swapAnimation(obj){
      var state = $(obj).attr("data-state");

      if (state == "still"){
          $(obj).attr("src", $(obj).attr("data-animate"));
          $(obj).attr("data-state", "animate");
      }
      else if (state == "animate"){
          $(obj).attr("src", $(obj).attr("data-still"));
          $(obj).attr("data-state", "still");
      }      
  }

  function resetSearchResultsPills(){
    //remove the active class from the nav-pill and tab-pane of each button/pill
    var giphyBtn = document.getElementsByClassName("giphyButton");
    var giphyImg = document.getElementsByClassName("giphyImages");

 	    for (var i = 0; i < giphyBtn.length; i++) {
	        giphyBtn[i].classList.value = "nav-item giphyButton";
	        giphyImg[i].classList.value ="tab-pane fade giphyImages";
  	}
  } 

  function resetSearchBox(){
  	$("#Search").val("");
  }
  function getSearchBox(){
  	return $("#Search").val().trim().toLowerCase();
  }
  function findAndSetButtonAndTab(key){
    var giphyBtn = document.getElementsByClassName("giphyButton");
    var giphyImg = document.getElementsByClassName("giphyImages");
    var targetIndex=-1;

    for (var i = 0; i < giphyBtn.length; i++) {
    	if (key == giphyBtn[i].textContent){
    		targetIndex = i;
    		break;
    	}
    }
    //activate the button and div
    var buttonID = giphyBtn[targetIndex].id;
    var divID = giphyImg[targetIndex].id;

    $("#" + buttonID).addClass("nav-item giphyButton active");
    $("#" + divID).addClass("d-flex flex-row flex-wrap align-self-start tab-pane fade in active giphyImages"); 
    resetSearchBox();   
  }       
});
