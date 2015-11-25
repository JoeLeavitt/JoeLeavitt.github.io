var lastState = "home";
var speed = 1;
var order = [0,1,2];
//var expanded = false;
var expandCount = 0;

var pastScrollY = 0;
var pastScrollX = 0;

var timer;

$(window).load(function(){
//    if (IE) return;
    
//    fetchBackground();
    
    $(".m1icon").not("[data-title=home]").show();
    tweenToDefault("m1", order);

    
    // check if a page needs to be loaded
    if (location.hash != "#" && location.hash!="")
    {
        setTimeout(function(){
            speed = 2;
            $(".m1icon[data-title="+location.hash.substring(1)+"]").trigger("mouseover");
            $(window).hashchange();
        }, 2200/speed);
    }
    else
    {
//        $(".m1icon[data-title=home]").unbind("click");
        $(".m1icon[data-title=home]").click(function(e){
          tweenToRandom("m1");            
      });
    }
    
    $(window).on('scroll', function(e){
          pastScrollY = window.scrollY;
    });
});

$(function(){
    
      $(window).hashchange( function(){
          
          if (location.hash == "#!" || location.hash == "home")
          {
              location.hash = "#";
              return;
          }

          if (lastState == "home" && (location.hash == "#" || location.hash == ""))
          {
              // we clicked home from home
              return;
          }
          var icons = $(".m1icon");
          var chosen;
          
          speed = 2;
          
          // stop all animations everywhere on hash change
          $(".m1icon, .m1logo").stop().clearQueue();
          
          var curPage = location.hash.substring(1);
          
          // find the integer of the current page
          for (var x=0; x<order.length; x++)
              if (icons[order[x]].getAttribute("data-title") == curPage)
                  chosen = x;
          
          // reset all the z-indices around the current choice (creates the stacking illusion)
          if (location.hash == "#" || location.hash == "")
              chosen = parseInt(order.length/2);      
          for (var x=0; x<order.length; x++)
              $(icons[order[x]]).css("z-index", 1000 - Math.abs(200*(x - chosen)));
          
          // when home is pressed
          if (location.hash == "#" || location.hash == "")
          {              
                       
              // prevent juttering when returning to home
              window.scrollTo(pastScrollX, pastScrollY);
              
              // animate all icons into the home button
              $(".m1icon").animate({"top": "0", "left": "0", "position": "relative", "margin-top": "10px", "margin-left": "40px"}, 500);
              
              // animate all the icons back to the origin
              $(".m1icon").animate({"top": "50%", "left": "50%", "position": "fixed", "margin-top": "-55px", "margin-left": "-158px"}, 500);

              // make the other icons visible again
              $(".m1icon:not([data-title=home])").fadeIn(0);
              
              // fade the home logo in after the animation is complete
              $(".m1logo[data-title=home]").delay(1000).fadeIn(500);
              
              // make the logos wait to appear
              $(".m1logo:not([data-title=home], [data-title="+lastState+"])").delay(1000);
              
              // fade out the current logo
              $(".m1logo[data-title="+lastState+"]").fadeOut(500).delay(500);

              // fade out the content here
              $("#content1").fadeOut(500);
              
              lastState = "home";
              
              $(".m1logo:not([data-title=home])").mouseout();
              $(".m1logo[data-title=home]").attr("src", "pages/home.page/logo.png");
              
              // bind the easter egg to home
              $(".m1icon[data-title=home]").click(function(){
                  tweenToRandom("m1");
              });
              
             // fade in the card bg if it exists
          if (expandCount >= 10)
          {
        $("#backgroundDiv, .card").delay(500).fadeIn(1000);
        $(".spacer").fadeOut(500);
//              $("#bg2").fadeOut(500);
          }
              
              $(".return").fadeOut(500);
              
              tweenToDefault("m1", order);
              return;
          }
          
          // for every other menu button pushed
          
          // Fade out all other logos, except the one pushed
          $(".m1logo:not([data-title="+curPage+"])").fadeOut(500);
          
          // animate all icons converging to the clicked icon
          $(".m1icon").animate({
                           "margin-top": $(".m1icon[data-title="+location.hash.substring(1)+"]").css("margin-top"), top:"50%", left:"50%", "margin-left": "-158", position:"fixed"
                           }, 500 );
          
          // hide the not visible icons (to make the transition smoother)
          $(".m1icon:not([data-title=home], [data-title="+curPage+"])").fadeOut(0);
          
          // animate the appropriate logo to the top left (with a delay start once they are all hidden)
          $(".m1logo[data-title="+curPage+"]").delay(500).animate({"margin-left":"150px", "margin-top":"10px", "position":"relative", "top":0, "left":0}, 500);
          // animate all icons to the top left
          $(".m1icon").animate({
                           "margin-top": "10px", top:"0", left:"0", "margin-left": "100px", position:"relative"
                           }, 500 );
          
          // animate the return home button out after it goes to the left
          $(".m1icon[data-title=home]").animate({
                           "margin-left": "40px"
                           }, 500 );
          
          // update the last state
          lastState = curPage;
          
          $(".return").delay(1500).fadeIn(500);
          
          // unbind the click listener on home
           $(".m1icon[data-title=home]").unbind("click");
          
          // fade out the card bg if it exists
          if (expandCount >= 10)
          {
//                $("#bg2").fadeIn(500);
              $("#backgroundDiv, .card").fadeOut(500);
              $(".spacer").fadeIn(500);
          }
                    
          // load the target page
          loadPage("content1", curPage);
          
//          $(".m1icon[data-title=home]").parent().attr("href", "javascript:window.history.back()");
      });
    
    // check if a page needs to be loaded
    if (location.hash != "#" && location.hash != "")
        speed = 3;
    
    // position the menu items initially all at the origin
    positionMenu("m1", order);
});

function loadPage(target, content)
{
    
    // fetch the page asynchronously
    $.ajax("pages/"+content+".page/index.html").done(function(data){
        
              // replace relative res/png links with proper locations        
            data = data.replace(/res\//g, 'pages/'+content+'.page/res/');
        
        data = data.replace(/png\//g, 'pages/'+content+'.page/png/');
        
        // remove the old menu
        var splitup = data.split("<!--space-->");
        
        // just the body
        if (splitup.length == 4)
        {
            data = splitup[3];
            
            // get the css
            if (splitup[1] != "")
                data += "<link rel='stylesheet' href='pages/"+content+"'.page/index.css'></link>";
            
            // get the js
            if (splitup[2] != "")
            {
                $.ajax("pages/"+content+".page/index.js").done(function(data){
                          eval(data);
                  }).fail(function(data){console.log("error");});
            }
        }
        
      // set the target container when done
      $("#"+target).html(data);

      // fade the container in
      $("#"+target).delay(700).fadeIn(500);
    });;
}

function positionMenu(target, order)
{
    var m2path = "";
    
    // move all the icons to the center (origin)
    $("."+target+"icon").css({"top":"50%", "left":"50%", "position": "fixed", "margin-top": "-55px",
              "margin-left": "-158px"});
    
    // move all the logos to the center
    $("."+target+"logo").css({"top":"50%", "left":"50%", "position": "fixed", "margin-top": "-55px",
              "margin-left": "-158px"});
    
    // hide everything but home and sites and its logo
    $("."+target+"icon, ."+target+"logo").not("[data-title=home], [data-title=sites]").hide();
    
    // remove the div we had only for the non-js browsers
    $("#"+target+"menu > *").unwrap();
    
    if (target != "m1")
        m2path = location.hash.substring(1)+".page/res/";
    
    var icons = $("."+target+"icon"); 
    
    // go through all the icons
    var centerLogoTop = -55 - 51*Math.floor(icons.length/2);
    for (var x=0; x<order.length; x++)
    {
        var thisValue = icons[order[x]].getAttribute("data-title");
        
        // change the href of each element to use hash loading
        icons[order[x]].parentNode.setAttribute("href", "#"+((thisValue == "home")? "" : thisValue));
        $("."+target+"logo[data-title="+thisValue+"]")[0].parentNode.setAttribute("href", "#"+((thisValue == "home")? "" : thisValue));
        
        var buffer = "";
        
        // initialize the logos to the alt (faded) forms
        if (thisValue != "home")
            $("."+target+"logo[data-title="+thisValue+"]")[0].src = "pages/"+m2path+thisValue+".page/logo_alt.png";
        else
            buffer = "_alt";
        
        // position the logo for this icon
        $("."+target+"logo[data-title="+thisValue+"]").css({"margin-top": centerLogoTop+"px",
"margin-left": "-108px"});
        centerLogoTop += 51;
            
        // preload the alternate forms of the logo
        new Image().src = "pages/"+m2path+thisValue+".page/logo"+buffer+".png";
        
        // set the appropriate z-index
        $(icons[order[x]]).css("z-index", 1000 - Math.abs(200*(x - Math.floor(icons.length/2))));
    }
    
    // attach mouseover event
    $(".m1icon, .m1logo").mouseover(function(){
        var thisValue = $(this).attr("data-title");
        
        // hide the home logo unless we are on home
        if (thisValue != "home")
            $("."+target+"logo[data-title=home]").attr("src", "pages/home.page/logo_alt.png");
        
        // set this icon's logo to active
        $("."+target+"logo[data-title="+thisValue+"]").attr("src", "pages/"+thisValue+".page/logo.png");
        
        // wiggle this icon on hover
        $("."+target+"icon[data-title="+thisValue+"]").wiggle();
    });
    
    // attach mouseout event
    $(".m1icon, .m1logo").mouseout(function(){
        var thisValue = $(this).attr("data-title");
        
//        // if not home, fade this icon
        if (thisValue != lastState)
            $("."+target+"logo[data-title="+thisValue+"]").attr("src", "pages/"+thisValue+".page/logo_alt.png");
        
        // activate the home logo after 2 seconds
        clearTimeout(timer);
        timer = setTimeout(restoreHomeLogo, 2000);
    });
    
}

function tweenToDefault(target, order)
{
    var icons = $("."+target+"icon");
    
    var centerIconTop = -55 - 51*Math.floor(icons.length/2);
    var centerIconLeft = -158;
                
    // go through all the icons and tell them to animate to the appropriate spots
    for (var x=0; x<order.length; x++)
    {
        $(icons[order[x]]).animate({"margin-top": centerIconTop+"px",
                      "margin-left": centerIconLeft+"px"}, 300*icons.length/speed);
        centerIconTop += 51;
    }
    
    positionLogos(target, order);
    
    $("."+target+"logo").delay(300*icons.length/speed).fadeIn(700/speed);
}

function tweenToRandom(target)
{
    speed = 2;
//    expanded = !expanded;
//    expandCount ++;

//    if (expanded)
//    {
          $(".m1icon, .m1logo").stop().clearQueue();
        $("."+target+"logo:not([data-title=home])").fadeOut(500);
        $("."+target+"icon").animate({"margin-left":"-158px", "margin-top":"-55px"}, 500);
        
    order = shuffle(order);
//    }
//    else
//    {
        tweenToDefault(target, order);
//    }
    
    if (expandCount == 10)
        fetchBackground();

    
//    $("#card").fadeIn(500);
//    $("body").animate({"background-image": "url(https://tcrf.net/images/thumb/4/42/NSMB_NES_Mario_Luigi_Clones.png/256px-NSMB_NES_Mario_Luigi_Clones.png)"}, 500);
    
    
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    
    var middle = parseInt(o.length/2);
    
    for (var x=0; x<o.length; x++)
        if (o[x] == middle)
        {
            var t = o[middle];
            o[middle] = o[x];
            o[x] = t;
        }
    
    return o;
};

function positionLogos(target, order)
{
    var icons = $("."+target+"icon");
    
    // go through all the icons
    var centerLogoTop = -55 - 51*Math.floor(icons.length/2);
    for (var x=0; x<order.length; x++)
    {
        var thisValue = icons[order[x]].getAttribute("data-title");
        
        // position the logo for this icon
        $("."+target+"logo[data-title="+thisValue+"]").animate({"margin-top": centerLogoTop+"px",
"margin-left": "-108px", "position":"fixed", "top":"50%", "left":"50%"}, 0);
        centerLogoTop += 51;

    }
}

function restoreHomeLogo()
{
    // activates the home logo if none of the other logos are active
    var logos = $(".m1logo");
    for (var x=0; x<logos.length; x++)
    {
        if (logos[x].src.indexOf("_alt") < 0)
            return;
    }
    
    $(".m1logo[data-title=home]")[0].src = "pages/home.page/logo.png";
}

function fetchBackground()
{
    expandCount = 10;
    
    var image = new Image();
    
    $(image).on('load', function() {
         var div = $("#backgroundDiv");
        div[0].appendChild(image);

        panBG(image, div, true);

        $("#backgroundDiv").fadeIn(1000);
        $("#bg1").fadeIn(1000);
        $(".spacer").hide();
});
    
    image.src = "png/bg.jpg";
   
}

function panBG(image, div, direction)
{
    var panVal = 0;
    if (direction)
        panVal = "-"+(image.width-parseInt(div.css("width")))+"px";
    
    $("#backgroundDiv img").animate({"margin-left": panVal}, {easing: "linear",duration:100000, complete: function(){panBG(image, div, !direction);}});

}
//
//
//function makeMenu(target)
//{
//    // get all of the pages that will be in the menu
//    var pages = $(target+" .page");
//            
//    // populate each menu element
//    for (var x=0; x<pages.length; x++)
//    {
//        // current page
//        var currentPage = pages[x].getAttribute("data-title")+".page";
//        
//        // create the icon
//        var icon = "<img src='pages/"+currentPage+"/icon.png' />";
//        
//        // create the logo that goes with this icon
//        var logo = "<img src='pages/"+currentPage+"/logo_alt.png' />";
//        
//        pages[x].innerHTML = icon + " " + logo;
//    }
//        
//}