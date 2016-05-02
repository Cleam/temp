var basePath = "/" + window.document.location.pathname.split("/")[1];

$(document).ready(function() {
	
});

var pingbi = false;//屏蔽


//回车查询
function on_return() {
	var tmp =$("#urlid").is(":focus");
	if(tmp) {
		if (event.keyCode == 13) {
			search()
		}
	}
}
	

/**
 * 查询
 * param urlid
 * 返回 基础rowkeyList，pagewap
 * */
function search(){
	//初始化
	$("#returncontent").html("");
	pingbi = false	;//屏蔽
	var flag = true;
	var urlId = $("#urlid").val();
	if(urlId==""){
		 alert("请输入urlid");
		 flag = false;
	}
	else {
		flag = true;
	}
	if(flag){
		$("body").showLoading();  
		setTimeout(function(){
			flag = false;
			$.ajax({
				type : "POST",
				url : basePath + "/addblack/search.do",
				data : {
					"urlid" : urlId
				},
				dataType : "json",
				contentType : "application/x-www-form-urlencoded; charset=utf-8",
				success : function(data) {
					
					if(data.state=="error"){
						window.parent.location.href=basePath+"/index.jsp";
					}
					
					
					flag = true;
					if (data.state == false) {
						alert(data.msg)
					} else if (data.state == true) {
						var pagewap = data.data[0];
						var html="";
						
						 html+='<table class="table table-bordered table-hover tile" style="width:40%">';
						 html+='<thead>';
						 html+=' <tr>';
						 html+='  <th width="100px">标题</th><td>'+pagewap.contenttitle+'</td>';
						 html+=' </tr>';
						 html+='<tr>';
						 html+='<th>来源</th><td>'+pagewap.source+'</td>';
						 html+=' </tr>';
						 html+=' <tr>';
						 html+=' <th>作者</th><td>'+pagewap.author+'</td>';
						 html+='</tr>';
						 html+=' <tr>';
						 html+='<th>url</th><td>'+pagewap.url+'</td>';
						 html+=' </tr>';
						 html+=' </thead>';
						 html+='  </table>';
						 html+='<div id="returnstate"><iframe src="'+pagewap.url+'" style="width:600px;height:900px;"></iframe></div>';
						
						 $("#returncontent").html(html);
						pingbi = true;//屏蔽
						$("#rowkey").val(pagewap.rowkey)
						$("body").hideLoading();  
					} else {
						alert(data.msg);
					}
				},
				error : function() {
					$("body").hideLoading();  
					alert("error!");
					flag = true;
				}
			});
			
		},500);
	}
}


/**
 * 屏蔽
 * param  urlid,isblack
 * 返回 
 * */
function pb(){
	if(pingbi){
		if (confirm("确认要屏蔽吗？一旦确认后将无法恢复！")) {
			$("body").showLoading();  
			$("#returnstate").html("");
			$.ajax({
				type : "POST",
				url : basePath + "/addblackdfw/pingbi.do",
				data : {
					"rowkey" : $("#rowkey").val(),
					"ispc" : -1 
				},
				dataType : "json",
				contentType : "application/x-www-form-urlencoded; charset=utf-8",
				success : function(data) {
					$("body").hideLoading();  
					pingbi = true;//屏蔽
					if(data.state=="error"){
						window.parent.location.href=basePath+"/index.jsp";
					}
					if (data.state == false) {
						alert(data.msg)
					} else if (data.state == true) {
						$("#returnstate").html("<br><br><h1 style='padding-left:100px;'>新闻屏蔽成功~~</h1>");
						pingbi = false;//屏蔽
					} else {
						alert(data.msg);
					}
				},
				error : function() {
					$("body").hideLoading();  
					alert("error!");
					pingbi = true;//屏蔽
				}
			});
		}
	}
}
