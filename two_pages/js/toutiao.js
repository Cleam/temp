var basePath = "/" + window.document.location.pathname.split("/")[1];

$(document).ready(function() {
	
});

var addtoutiao = false;
var canceltoutiao = false;


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
	$("#rowkeyList").html("");
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
		flag = false;
		$.ajax({
			type : "POST",
			url : basePath + "/toSearch.json",
			data : {
				"urlid" : urlId
			},
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				
				if(data.flag=="error"){
					window.parent.location.href=basePath+"/index.jsp";
				}
				
				
				flag = true;
				if (data.flag == false) {
					alert(data.Msg)
				} else if (data.flag == true) {
					var pagewap = data.pagewap;
					$("#rowkeyList").html("rowkey:<br><br>"+pagewap.rowkey);
					var html = "";
					html += "标题来源：<br><br>";
					html +="标题：<input type='text' size = '50' value='"+pagewap.title+"' id='title'><br><br>";
					html +="来源：<input type='text' size='25' value='"+pagewap.contentfrom+"' id='contentfrom'>&nbsp;&nbsp;&nbsp;<input type='button' value='保存修改' onclick='update()'>";
					$("#returnContent").html(html);
					$("#zw").html("线上新闻详情：<br><br><iframe style='width:100%;height:100%;' src='"+pagewap.url+"'></iframe>");
					addtoutiao = true;
					canceltoutiao = true;
					$("#urlID").val(data.urlId)
					$("#rowkey").val(pagewap.rowkey)
				} else {
					alert(data.Msg);
				}
			},
			error : function() {
				alert("error!");
				flag = true;
			}
		});
	}
}



/**
 * 上头条
 * param  urlid
 * 返回 
 * */
function addToutiao(){
	if(addtoutiao){
		if (confirm("确认要上头条？")) {
			$("#rowkeyList").html("");
			$.ajax({
				type : "POST",
				url : basePath + "/toAddtoutiao.json",
				data : {
					"urlId" : $("#urlID").val(),
				},
				dataType : "json",
				contentType : "application/x-www-form-urlencoded; charset=utf-8",
				success : function(data) {
					addtoutiao = true;//加头条
					if(data.flag=="error"){
						window.parent.location.href=basePath+"/index.jsp";
					}
					if (data.flag == false) {
						alert(data.Msg)
					} else if (data.flag == true) {
						alert(data.Msg);
						$("#rowkeyList").html("基础rowkey：<br><br>"+data.rowkey);
						addtoutiao = false;//加头条
					} else {
						alert(data.Msg);
					}
				},
				error : function() {
					alert("error!");
					addtoutiao = true;//加头条
				}
			});
		}
	}
}


/**
 * 撤销头条
 * param  urlid,isblack
 * 返回 
 * */
function cancelToutiao(){
	if(canceltoutiao){
		$.ajax({
			type : "POST",
			url : basePath + "/toCanceltoutiao.json",
			data : {
				"urlId" : $("#urlID").val(),
				"isBlack" : 1 
			},
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				canceltoutiao = true;
				if(data.flag=="error"){
					window.parent.location.href=basePath+"/index.jsp";
				}
				if (data.flag == false) {
					alert(data.Msg)
				} else if (data.flag == true) {
					var toutiaorowkeyList = data.toutiao;
					$("#rowkeyList").html("");
					if(toutiaorowkeyList.length>0){
						$("#rowkeyList").append("撤销成功<br><br>基础rowkey：<br><br>"+data.rowkey+"<br><br>");
						if(toutiaorowkeyList.length>0) {
							$("#rowkeyList").append("头条rowkey：<br><br>");
							for(var i in toutiaorowkeyList){
								$("#rowkeyList").append(toutiaorowkeyList[i]+"<br><br>");
							}
						}
					}
					canceltoutiao = false;//撤销头条
				} else {
					alert(data.Msg);
				}
			},
			error : function() {
				alert("error!");
				canceltoutiao = true;
			}
		});
	}
}

