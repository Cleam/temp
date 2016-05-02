var basePath = "/" + window.document.location.pathname.split("/")[1];
$(document).ready(function() {
	$("body").bind('keyup',function(event) {  
	    if(event.keyCode==13){  
	    	userlogin();
	    }     
	});     
});

var flag = true;
function userlogin(){
	var account = $("#account").val();
	var pwd = $("#pwd").val();
	if(!logincheck()){
		return;
	}
	if(flag){
		flag = false;
		$("html").showLoading(); 
		setTimeout(function(){
			$.ajax({
			       type: "POST",
			       url: basePath+"/login.json",
			       data:{"account":account,"pwd":pwd},
			       dataType: "json",
			       contentType: "application/x-www-form-urlencoded; charset=utf-8",
			       success: function(data){
			    	   $("html").hideLoading();  
			    	   flag = true;
			    	   miniImgflag = true;
			    	   if(data.au == false){
			    		   alert("对不起，您没有权限访问此系统");
			    	   }
			    	   else {
			    		  if(data.Msg == true){
		 		    		   window.location.href=basePath+"/main";
		 		    	   }
		 		    	   else {
		 		    		  layer.tips(data.Msg, '#account');
//		 		    		  $("#pwd-msg").html(data.Msg);
		 		    	   }
			    	   }
			    	   	
			       },
			       error : function(){
			    	   $("body").hideLoading();  
			    	   alert("error!");
			    	   flag = true;
			       }
			 });
		},500);
	}
}
function logincheck(){
	var account = $("#account").val();
	var pwd = $("#pwd").val();
	if(account==""){
		layer.tips("账号不能为空", '#account');
//		$("#account-msg").html("账号不能为空");
		return;
	}
	$("#account-msg").html("");
	if(pwd==""){
		layer.tips("密码不能为空", '#pwd');
//		$("#pwd-msg").html("密码不能为空");
		return;
	}
	$("#pwd-msg").html("");
	return true;
}