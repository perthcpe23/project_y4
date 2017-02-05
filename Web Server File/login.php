<?php
// Start the session
session_start();
?>
<!DOCTYPE html>
<html>
	<title>Log In</title>
	<link rel="stylesheet" type="text/css" href="css.css">
	<link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css">
	<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Raleway">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
	<link href='http://fonts.googleapis.com/css?family=Varela+Round' rel='stylesheet' type='text/css'>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.13.1/jquery.validate.min.js"></script>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

<style>
body,h1 {font-family: "Raleway", Arial, sans-serif}
h1 {letter-spacing:7px}
.menu {position: absolute;top: 25px;right: 25px;}
.text-center {padding:50px 0;position: absolute;top: 25%;
    left: 10%;right: 10%;}

#custom-search-input{
    padding: 3px;
    border: solid 1px #E4E4E4;
    border-radius: 6px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    right: -60%;
}

#custom-search-input input{
    border: 0;
    box-shadow: none;
}

#custom-search-input button{
    margin: 2px 0 0 0;
    background: none;
    box-shadow: none;
    border: 0;
    color: #666666;
    padding: 0 8px 0 10px;
    border-left: solid 1px #ccc;
}

#custom-search-input button:hover{
    border: 0;
    box-shadow: none;
    border-left: solid 1px #ccc;
}

#custom-search-input .glyphicon-search{
    font-size: 23px;
}

[type="checkbox"]:checked + label:after {
  content: '✔';
  top: 0;
  left: 2px;
  font-size: 14px;
}
</style>

<body>

	<!-- !PAGE CONTENT! -->
	<div class="w3-content" style="max-width:1500px">


	<!-- Header -->
	<header class="w3-panel w3-padding-128 w3-center w3-opacity">
	  <h1>Tagvisor</h1>
	</header>



	 <div class="menu">
		<div class="w3-btn-bar w3-border w3-show-inline-block">
		  <a href="http://www.thaiautotag.win/mainpage.php" class="w3-btn">Home</a>
		  <a href="http://www.thaiautotag.win/login.php" class="w3-btn">Log In</a>
		  <a href="http://www.thaiautotag.win/regis.php" class="w3-btn">Registration</a>
		</div>
	  </div>

	<!-- LOGIN FORM -->
	<div class="text-center" >
		<div class="logo">login</div>
		<!-- Main Form -->
		<div class="login-form-1">
			<form id="login-form" class="text-left" action="http://www.thaiautotag.win/check_login.php" method="POST">
				<div class="login-form-main-message"></div>
				<div class="main-login-form">
					<div class="login-group">
						<div class="form-group">
							<label for="lg_username" class="sr-only">Username</label>
							<input type="text" class="form-control" id="lg_username" name="lg_username" placeholder="username">
						</div>
						<div class="form-group">
							<label for="lg_password" class="sr-only">Password</label>
							<input type="password" class="form-control" id="lg_password" name="lg_password" placeholder="password">
						</div>
						<div class="form-group login-group-checkbox">
							<input type="checkbox" id="lg_remember" name="lg_remember">
							<label for="lg_remember">remember</label>
						</div>
					</div>
					<button type="submit" class="login-button"><i class="fa fa-chevron-right"></i></button>
					
					
				</div>
				<div class="etc-login-form">
					<p>forgot your password? <a href="http://www.thaiautotag.win/forget_password.html">click here</a></p>
					<p>new user? <a href="http://www.thaiautotag.win/regis.php">create new account</a></p>
				</div>
			</form>
		</div>
		<!-- end:Main Form -->
	</div>
	</div>

	<script>
	(function($) {
    "use strict";
	
	// Options for Message
	//----------------------------------------------
  var options = {
	  'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
	  'btn-success': '<i class="fa fa-check"></i>',
	  'btn-error': '<i class="fa fa-remove"></i>',
	  'msg-success': 'All Good! Redirecting...',
	  'msg-error': 'Wrong login credentials!',
  };

	// Login Form
	//----------------------------------------------
	// Validation
  $("#login-form").validate({
  	rules: {
      lg_username: "required",
  	  lg_password: "required",
    },
  	errorClass: "form-invalid"
  });


	// Loading
	//----------------------------------------------
  function remove_loading($form)
  {
  	$form.find('[type=submit]').removeClass('error success');
  	$form.find('.login-form-main-message').removeClass('show error success').html('');
  }

  function form_loading($form)
  {
    $form.find('[type=submit]').addClass('clicked').html(options['btn-loading']);
  }
  
  function form_success($form)
  {
	  $form.find('[type=submit]').addClass('success').html(options['btn-success']);
	  $form.find('.login-form-main-message').addClass('show success').html(options['msg-success']);
  }

  function form_failed($form)
  {
  	$form.find('[type=submit]').addClass('error').html(options['btn-error']);
  	$form.find('.login-form-main-message').addClass('show error').html(options['msg-error']);
  }
	
})(jQuery);
	
	</script>
	
</body>
</html>