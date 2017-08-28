// JavaScript function that wraps everything
$(document).ready(function() {
  var searchedItemArray=[]; //holds previous search terms to doublecheck against repeat searches

  //*********  create Home button and corresponding div **********//
  makeButton("Home","Home");
  createHomeTabPane("Home");

  // ************ onclick/mouse events ********************* //
    $("#submit").on("click", function() {
      var searchTerm = getSearchBox();
      if (searchTerm){ // ignore blank responses
        event.preventDefault();
        callAJAX(searchTerm);
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
      $(this.childNodes[1]).toggle(true);
      $(this).css({
        border: '0 solid #f37736'}).animate({                
          borderWidth: 4,

      }, 500);      
    });
    $(document).on("mouseleave", ".giphyButton", function() {
      $(this.childNodes[1]).toggle(false);
     $(this).animate({   
        borderWidth: 0
      }, 500);
    });

    $(document).on('click','.gif', function() {
      swapAnimation(this);     
    });

    $(document).on("click", ".delBtn", function(){
      var li = this.parentElement.parentElement;
      var ul = $("#giphyButtons")[0];
      var targetIndex =-1;  

      // find the previous button to be the new active button
      for (var i = 0; i < ul.childNodes.length; i++) {
        if (li.id == ul.childNodes[i].id){
          targetIndex = i-1;
          break;
        }
      }
      var newActiveBtn = ul.childNodes[targetIndex].textContent;
      var delDiv = li.childNodes[0].hash

      // remove the search term from the array to be deleted
      searchedItemArray.splice(searchedItemArray.indexOf(li.id.replace(/\s/g, '')),1);

      $("#"+li.id).remove();
      $(delDiv).remove();
      resetButtonsAndTabs();

      findAndSetButtonAndTab(newActiveBtn);

    });

    $(document).on("click", ".nav-item", function(){
      // this event will get called when you delete a button.  if there is no parent, then it was deleted so skip this event
      if (this.parentElement){
        //update header with the current search term
        if (this.children[0].text !== "Home")
          $("#searchTerm").html(this.children[0].text);
        else
          $("#searchTerm").html("");
        //reset all butons and tabs and activate the button and it's corresponding tab-pane
        resetButtonsAndTabs();
        findAndSetButtonAndTab(this.children[0].text);
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
  function getQueryURL(searchWord){
      // var searchItem = searchWord;
      var api_key = "dc6zaTOxFJmzC";
      var queryURL= "https://api.giphy.com/v1/gifs/search?q=" + searchWord + "&api_key=" + api_key + "&limit=10";
      return queryURL;
  }
  function callAJAX(searchWord){
    var queryURL = getQueryURL(searchWord);          

    // clear all the buttons and tabs
    resetButtonsAndTabs();
    if (searchedItemArray.indexOf(searchWord.replace(/\s/g, ''))<0){
      $.ajax({
        url: queryURL,
        method: "GET"
      }).done(function(response) {
        var anID = response.meta.response_id;
        var results = response.data;

        // create a button that links to the unique id of the tab with its images
        createButton(anID, searchWord);

        //create a tab-pane to hold all images from search. this needs a unique id to be addressed by its button
        createTabPaneAndImages(results,anID);         

      }); // ajax call
    } else {
      // find the button already searched, set class to active. find corresponding tab-pane and set that to active
      findAndSetButtonAndTab(searchWord);       
    }    
  }
  function createButton(anID, searchWord){
  	// reset search bar and make the button
    var searchTerm = searchWord;
    $("#searchTerm").html(searchTerm);
    resetSearchBox();
    searchedItemArray.push(searchTerm.replace(/\s/g, ''));

    makeButton(searchTerm, anID);
  }
  function makeButton(searchTerm, anID){
    var li = $("<li class='nav-item giphyButton d-flex align-items-center active'>");
    li.attr("id", searchTerm.replace(/\s/g, '') + "-l")
    li.attr("data-toggle", "pill");
    var a = $("<a href='#" + anID + "-d" +"' class='nav-link'>");

    a.text(searchTerm);
    a.attr("data-value", searchTerm);
    
    li.append(a);
    if(anID !="Home"){  //do not put a delete button on the Home Button, every other button has an option to delete
      var delBtn = $("<span><i class='fa fa-times-circle-o delBtn' aria-hidden='true'>");
      $(delBtn).toggle();
      li.append(delBtn);
    }

    $("#giphyButtons").append(li);
  }
  function createHomeTabPane(anID){
    var imgDiv = $("<div>");
    imgDiv.addClass("d-flex flex-row flex-wrap align-self-start tab-pane fade in active giphyImages");
    imgDiv.attr("id", anID + "-d");    

    var figure = $("<div class='figure'>");
    var image = $("<img>");
    image.attr("src", "assets/images/giphysearch/giphysearch.gif");
    image.addClass("img-fluid fig-img");

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
        var caption = $("<p class='rating-caption'>");
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

  function resetButtonsAndTabs(){
    //remove the active class from the nav-pill and tab-pane of each button/pill
    var giphyBtn = document.getElementsByClassName("giphyButton");
    var giphyImg = document.getElementsByClassName("giphyImages");

 	    for (var i = 0; i < giphyBtn.length; i++) {
	        giphyBtn[i].classList.value = "nav-item giphyButton d-flex align-items-center ";
	        giphyImg[i].classList.value ="tab-pane fade giphyImages";
  	}
  } 

  function resetSearchBox(){
    event.preventDefault();       
  	$("#Search").val("");
  }
  function getSearchBox(){
  	return $("#Search").val().trim().toLowerCase();
  }
  function findAndSetButtonAndTab(key){
    var giphyBtn = document.getElementsByClassName("giphyButton");
    var giphyImg = document.getElementsByClassName("giphyImages");
    var targetIndex=-1;

    //update the Header to giphy.search(key)
    $("#searchTerm").html(key);    
    for (var i = 0; i < giphyBtn.length; i++) {
    	if (key == giphyBtn[i].textContent){
    		targetIndex = i;
    		// break;
    	}
    }
    if (targetIndex>=0){
      //activate the button and div
      var buttonID = "#" + giphyBtn[targetIndex].id;
      var divID = giphyBtn[targetIndex].childNodes[0].hash;

      $(buttonID).addClass("nav-item giphyButton active");
      $(divID).addClass("d-flex flex-row flex-wrap align-self-start tab-pane fade in active giphyImages"); 
    }
    resetSearchBox();
  }       
});
=======
// JavaScript function that wraps everything
$(document).ready(function() {
  var searchedItemArray=[]; //holds previous search terms to doublecheck against repeat searches

  //*********  create Home button and corresponding div **********//
  makeButton("Home","Home");
  createHomeTabPane("Home");

  // ************ onclick/mouse events ********************* //
    $("#submit").on("click", function() {
      var searchTerm = getSearchBox();
      if (searchTerm){ // ignore blank responses
        event.preventDefault();
        callAJAX(searchTerm);
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
      $(this.childNodes[1]).toggle(true);
      $(this).css({
        border: '0 solid #f37736'}).animate({                
          borderWidth: 4,

      }, 500);      
    });
    $(document).on("mouseleave", ".giphyButton", function() {
      $(this.childNodes[1]).toggle(false);
     $(this).animate({   
        borderWidth: 0
      }, 500);
    });

    $(document).on('click','.gif', function() {
      swapAnimation(this);     
    });

    $(document).on("click", ".delBtn", function(){
      var li = this.parentElement.parentElement;
      var ul = $("#giphyButtons")[0];
      var targetIndex =-1;  

      // find the previous button to be the new active button
      for (var i = 0; i < ul.childNodes.length; i++) {
        if (li.id == ul.childNodes[i].id){
          targetIndex = i-1;
          break;
        }
      }
      var newActiveBtn = ul.childNodes[targetIndex].textContent;
      var delDiv = li.childNodes[0].hash

      // remove the search term from the array to be deleted
      searchedItemArray.splice(searchedItemArray.indexOf(li.id),1);

      $("#"+li.id).remove();
      $(delDiv).remove();
      resetButtonsAndTabs();

      findAndSetButtonAndTab(newActiveBtn);

    });

    $(document).on("click", ".nav-item", function(){
      // this event will get called when you delete a button.  if there is no parent, then it was deleted so skip this event
      if (this.parentElement){
        //update header with the current search term
        if (this.children[0].text !== "Home")
          $("#searchTerm").html(this.children[0].text);
        else
          $("#searchTerm").html("");
        //reset all butons and tabs and activate the button and it's corresponding tab-pane
        resetButtonsAndTabs();
        findAndSetButtonAndTab(this.children[0].text);
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
  function getQueryURL(searchWord){
      var searchItem = searchWord;
      var api_key = "dc6zaTOxFJmzC";
      var queryURL= "https://api.giphy.com/v1/gifs/search?q=" + searchItem + "&api_key=" + api_key + "&limit=10";
      return queryURL;
  }
  function callAJAX(searchWord){
    var queryURL = getQueryURL(searchWord);          

    // clear all the buttons and tabs
    resetButtonsAndTabs();
    if (searchedItemArray.indexOf(searchWord)<0){
      $.ajax({
        url: queryURL,
        method: "GET"
      }).done(function(response) {
        var anID = response.meta.response_id;
        var results = response.data;

        // create a button that links to the unique id of the tab with its images
        createButton(anID, searchWord);

        //create a tab-pane to hold all images from search. this needs a unique id to be addressed by its button
        createTabPaneAndImages(results,anID);         

      }); // ajax call
    } else {
      // find the button already searched, set class to active. find corresponding tab-pane and set that to active
      findAndSetButtonAndTab(searchTerm);       
    }    
  }
  function createButton(anID, searchWord){
  	// reset search bar and make the button
    var searchTerm = searchWord;
    $("#searchTerm").html(searchTerm);
    resetSearchBox();
    searchedItemArray.push(searchTerm);

    makeButton(searchTerm, anID);
  }
  function makeButton(searchTerm, anID){
    var li = $("<li class='nav-item giphyButton d-flex align-items-center active'>");
    li.attr("id", searchTerm + "-l")
    li.attr("data-toggle", "pill");
    var a = $("<a href='#" + anID + "-d" +"' class='nav-link'>");

    a.text(searchTerm);
    a.attr("data-value", searchTerm);
    
    li.append(a);
    if(anID !="Home"){  //do not put a delete button on the Home Button, every other button has an option to delete
      var delBtn = $("<span><i class='fa fa-times-circle-o delBtn' aria-hidden='true'>");
      $(delBtn).toggle();
      li.append(delBtn);
    }

    $("#giphyButtons").append(li);
  }
  function createHomeTabPane(anID){
    var imgDiv = $("<div>");
    imgDiv.addClass("d-flex flex-row flex-wrap align-self-start tab-pane fade in active giphyImages");
    imgDiv.attr("id", anID + "-d");    

    var figure = $("<div class='figure'>");
    var image = $("<img>");
    image.attr("src", "assets/images/giphysearch/giphysearch.gif");
    image.addClass("img-fluid fig-img");

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
        var caption = $("<p class='rating-caption'>");
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

  function resetButtonsAndTabs(){
    //remove the active class from the nav-pill and tab-pane of each button/pill
    var giphyBtn = document.getElementsByClassName("giphyButton");
    var giphyImg = document.getElementsByClassName("giphyImages");

 	    for (var i = 0; i < giphyBtn.length; i++) {
	        giphyBtn[i].classList.value = "nav-item giphyButton d-flex align-items-center ";
	        giphyImg[i].classList.value ="tab-pane fade giphyImages";
  	}
  } 

  function resetSearchBox(){
    event.preventDefault();       
  	$("#Search").val("");
  }
  function getSearchBox(){
  	return $("#Search").val().trim().toLowerCase();
  }
  function findAndSetButtonAndTab(key){
    var giphyBtn = document.getElementsByClassName("giphyButton");
    var giphyImg = document.getElementsByClassName("giphyImages");
    var targetIndex=-1;

    //update the Header to giphy.search(key)
    $("#searchTerm").html(key);    
    for (var i = 0; i < giphyBtn.length; i++) {
    	if (key == giphyBtn[i].textContent){
    		targetIndex = i;
    		// break;
    	}
    }
    if (targetIndex>=0){
      //activate the button and div
      var buttonID = "#" + giphyBtn[targetIndex].id;
      var divID = giphyBtn[targetIndex].childNodes[0].hash;

      $(buttonID).addClass("nav-item giphyButton active");
      $(divID).addClass("d-flex flex-row flex-wrap align-self-start tab-pane fade in active giphyImages"); 
    }
    resetSearchBox();
  }       
});
