
$(document).ready(function(){
	
	//Development
	APP_URL = "http://fb-app-shemul.c9users.io/";
	APP_ID  = "153896478450737";
	
	//Production
	//APP_URL = "http://sundorborno.com/";
	//APP_ID  = "149171985589853";	
	
	
	
	$('.create_profile_pic').prop('disabled', true);
	$('.cast_vote').prop('disabled', true);
	
	// is letter click , Default False 
	flag = false;
	EDITED_PIC_URL  = "";
	SELECTED_WORD = "";
	SELECTED_STICKER = "";
    
	
	

    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
        FB.init({
          appId: APP_ID, // need to change this id .
          version: 'v2.8' // or v2.1, v2.2, v2.3, ...
        });     
        $('#loginbutton,#feedbutton').removeAttr('disabled');
        FB.getLoginStatus();
    });
    
    $("#make_share_and_pp").click(function() {
        if(flag) {
		 	FB.login(function(response){
			  FB.api(
				  	"/me?fields=id,name,email,picture.width(720)",
				    function (response) {
				    
				      if (response && !response.error) {
				        /* handle the result */
				        
				        
				        var image_uri = response.picture.data.url;
				        var user_id = response.id;
				        var fb_name = response.name;
				        var fb_email = response.email;
				        var my_current_data = {'type' : '1' , 'val_1' : SELECTED_WORD , 'image_uri' :image_uri , 'sticker' : SELECTED_STICKER , 'user_id' :user_id , 'fb_name' : fb_name , 'fb_email' : fb_email }
				        $.ajax({
				        	url: 'add_sticker.php',
				        	type: 'POST',
				        	data : my_current_data
				        })
				        .done(function(data) {
				        	
				        	console.log(data);
				        	var data = JSON.parse(data);
				        
				        	d = new Date();
				        	
				        	$("#profile_pic").attr({
					        	"src" : data.url_is + "?" +d.getTime(), //Output path ta hobe ekhan 
					        	'width' : response.picture.data.width,
					        	'height' : response.picture.data.height
					        });
					        EDITED_PIC_URL = APP_URL + data.share_able_url;
					        
					        $("#download_pic").attr("href" ,APP_URL + data.url_is);
					        $("#myModal").modal();
					        
						 
				        })
				        .fail(function(err) {
				        	
				        })
				        .always(function(done) {
				        
				        });
				      }
				    }
	
			  	);
			}, {scope: 'email'});
        } else {
        	
			$("#message").css("color", "red");
			$("#message").html("<br><br>দয়া করে আপনার পছন্দের বর্ণটিতে ক্লিক করুন  ")
	
        }
    })


});
  
$(".letter > img").click(function(){ 
    SELECTED_WORD = $(this).attr("alt");
	
	SELECTED_STICKER = $(this).attr("data-myAttri");
	
	$(".letter img").removeClass('active-letter');
	$(this).addClass('active-letter');
	
	flag =true;
	$(".create_profile_pic").attr('src' , 'images/btn/b1_r.png')
	$(".cast_vote").attr('src' , 'images/btn/b2_r.png')
	
	
	$("#message").html("");
	
})

$("#give_vote").click(function() {
	
	if(flag) {
		var my_current_data = { 'type': '0' , 'val_1' : SELECTED_WORD };
		$.ajax({
	    	url: 'add_sticker.php',
	    	type: 'POST',
	    	data : my_current_data
	    })
	    .done(function(data) {
	    	$("#message").css("color", "green");
			$("#message").html("<br><br>ধন্যবাদ   ");
	    });
	} else {
		$("#message").css("color", "red");
		$("#message").html("<br><br>দয়া করে আপনার পছন্দের বর্ণটিতে ক্লিক করুন  ")
	}
	
	
	
})

$("#share_post").click(function() {
	
    FB.ui({
	  method: 'feed',
	  link: 'http://sundorborno.com',
	  picture : EDITED_PIC_URL,
	  caption: 'www.sundorborno.com',
	  description : 'বাংলা বর্ণমালা থেকে আপনার কাছে সবচেয়ে সুন্দর বর্ণটিকে ভোট দিন',
	  name 	: 'আমার কাছে সবচেয়ে সুন্দর বাংলা বর্ণ '  + '"' + SELECTED_WORD + '"' + ', আপনার কাছে কোনটি?'
	  
	}, function(response){
		// link = "<a href='https://facebook.com/" + response.post_id + "'>Click here to see your post </a>";
		// $("#see_your_post").html(link);

		
		
	});
})

$("#download").click(function() {
	
   
})


  
