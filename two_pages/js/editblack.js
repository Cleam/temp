var basePath = "/" + window.document.location.pathname.split("/")[1];

$(document).ready(function() {
	$.ajax({
		type : "POST",
		url : basePath + "/addblack/checkcmsblack.do",
		data : {
		},
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			if(data.state=="error"){
				window.parent.location.href=basePath+"/index.jsp";
			}
			if (data.state == true) {
				if(data.data!=1){
					$("#isban").css("display", "");
				}
			}
		},
		error : function() {
		}
	});
	
	
	//修改标题
	$("#returncontent").on("click","#edittitle",function(){
		$(this).css("display","none");//隐藏编辑按钮
		$("#savetitle").css('display', 'block');//显示保存按钮
		var tmptitle =  $(this).parent().find("p:eq(0)").text();//取得当前标题
		$(this).parent().find("p:eq(0)").text("");//清空当前表格内标题
		$("#savetitle").before('<input type="text" id="newtitle" style="width:83%;float:left" class="form-control m-b-10" placeholder="请输入标题……" value="'+tmptitle+'">');
	});
	
	//修改来源
	$("#returncontent").on("click","#editsource",function(){
		$(this).css("display","none");//隐藏编辑按钮
		$("#savesource").css('display', 'block');//显示保存按钮
		var tmptitle =  $(this).parent().find("p:eq(0)").text();//取得当前来源
		$(this).parent().find("p:eq(0)").text("");//清空当前表格内标题
		$("#savesource").before('<input type="text" id="newsource" style="width:83%;float:left" class="form-control m-b-10" placeholder="请输入来源……" value="'+tmptitle+'">');
	});
	
	
	//保存标题
	$("#returncontent").on("click","#savetitle",function(){
		var title = $("#newtitle").val();
		var contentfrom = "";
	 	if(title=="" || title==undefined){
	 		alert("请输入标题");
	 		return;
	 	}
	 	update(title, contentfrom);
		$(this).css("display","none");//隐藏保存按钮
		$("#edittitle").css('display', 'block');//显示编辑按钮
		$(this).parent().find("p:eq(0)").text(title);
		$("#newtitle").remove();
	});
	
	
	//保存来源
	$("#returncontent").on("click","#savesource",function(){
		var title = "";
		var contentfrom =$("#newsource").val();
	 	if(contentfrom=="" || contentfrom==undefined){
	 		alert("请输入来源");
	 		return;
	 	}
	 	update(title, contentfrom);
		$(this).css("display","none");//隐藏保存按钮
		$("#editsource").css('display', 'block');//显示编辑按钮
		$(this).parent().find("p:eq(0)").text(contentfrom);
		$("#newsource").remove();
	});
	
});

var addblack = false;//加黑
var add404 = false;//404
var cancelAllblack =false;//撤销
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
	//初始化
	//撤销404禁用
	$("#chexiao").removeAttr("disabled");
	addblack = false;//加黑
	add404 = false;//404
	cancelAllblack =false;//撤销
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
		$("#returncontent").html("");
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
					$("body").hideLoading();  
					alert(data.msg)
				} else if (data.state == true) {
					var pagewap = data.data[0];
					
					//如果已经404   禁用撤销按钮
					if(pagewap.isban==1){
						$("#chexiao").attr("disabled","true");
					}
					//如果没有404  禁用404按钮  等加黑后接触禁用
					else {
						$("#isban").attr("disabled","true");
					}
					
					
					var html="";
					
					 html+='<table class="table table-bordered table-hover tile" style="width:40%">';
					 html+='<thead>';
					 html+=' <tr>';
					 html+='  <th width="100px">源网址</th><td>'+pagewap.purl+'</td>';
					 html+=' </tr>';
					 html+=' <tr>';
					 html+='  <th>标题</th><td><p style="float:left">'+pagewap.contenttitle+'</p><button style="float:right;display:none" class="btn btn-alt m-r-5" id="savetitle">保存</button><button style="float:right;" class="btn btn-alt m-r-5" id="edittitle">修改</button></td>';
					 html+=' </tr>';
					 html+='<tr>';
					 html+='<th>来源</th><td><p style="float:left">'+pagewap.source+'</p><button style="float:right;display:none" class="btn btn-alt m-r-5" id="savesource">保存</button><button style="float:right;" class="btn btn-alt m-r-5" id="editsource">修改</button></td>';
					 html+=' </tr>';
					 html+=' <tr>';
					 html+=' <th>作者</th><td>'+pagewap.author+'</td>';
					 html+='</tr>';
					 html+=' <tr>';
					 html+='<th>url</th><td>'+pagewap.url+'</td>';
					 html+=' </tr>';
					 html+=' <tr>';
					 html+='<th>rowkey</th><td>'+pagewap.rowkey+'</td>';
					 html+=' </tr>';
					 html+=' </thead>';
					 html+='  </table>';
					 html+='<div id="returnrowkey"><iframe src="'+pagewap.url+'" style="width:600px;height:900px;"></iframe></div>';
					
					 $("#returncontent").html(html);
					addblack = true;//加黑
					add404 = true;//404
					cancelAllblack =true;//撤销
					$("#urlID").val(data.urlId);
					$("#oldtitle").val(pagewap.contenttitle);
					$("#oldsource").val(pagewap.source);
					$("#rowkey").val(pagewap.rowkey);
					$("body").hideLoading();  
				} else {
					$("body").hideLoading();  
					layer.msg(data.msg);
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
 * 加黑
 * param  urlid,isblack
 * 返回 
 * */
function addBlack(){
	if(addblack){
		$("body").showLoading();  
		$("#returnrowkey").html("");
		$.ajax({
			type : "POST",
			url : basePath + "/addblack/addblackall.do",
			data : {
				"rowkey" : $("#rowkey").val(),
				"ispc" : $("#type").val()
				//"title" :$("#oldtitle").val(),
				//"source" :$("#oldsource").val()
			},
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				addblack = true;//加黑
				if(data.state=="error"){
					window.parent.location.href=basePath+"/index.jsp";
				}
				if (data.state == false) {
					alert(data.msg)
				} else if (data.state == true) {
					
					//撤销404禁用
					$("#isban").removeAttr("disabled");
					
					if(data.stat==1){
						$("body").hideLoading();  
						alert(data.msg);
					}
					var rowkeyList = data.data;
					var html="";
					if(rowkeyList.length>0){
					 html+='<table class="table table-bordered table-hover tile" style="width:40%">';
					 html+='<thead>';
					 for(var i=0;i<rowkeyList.length;i++){
						 if(i==0){
							 html+=' <tr>';
							 html+='  <th width="150px" rowspan="'+rowkeyList.length+'" style="vertical-align: middle;">加黑成功rowkey列表</th><td>'+rowkeyList[i]+'</td>';
							 html+=' </tr>'; 
						 }
						 else {
							 html+=' <tr>';
							 html+=' <td>'+rowkeyList[i]+'</td>';
							 html+=' </tr>';
						 }
						 
						}
					 html+=' </thead>';
					 html+='  </table>';
					}
					 $("#returnrowkey").html(html);
					addblack = false;//加黑
					$("body").hideLoading();  
				} else {
					$("body").hideLoading();  
					alert(data.msg);
				}
			},
			error : function() {
				$("body").hideLoading();  
				alert("error!");
				addblack = true;//加黑
			}
		});
	}
}

/**
 * 404
 * param urlid
 * 返回
 * */
function addFOF(){
	if(add404){
		//禁用撤销功能
		$("#chexiao").attr("disabled","true");
		if (confirm("确认要执行404？一旦确认后将无法恢复！")) {
			$("body").showLoading();  
			$("#returnrowkey").html("");
			$.ajax({
				type : "POST",
				url : basePath + "/addblack/add404.do",
				data : {
					"rowkey" : $("#rowkey").val(),
					"ispc" : $("#type").val(),
					"title" :$("#oldtitle").val(),
					"source" :$("#oldsource").val()
				},
				dataType : "json",
				contentType : "application/x-www-form-urlencoded; charset=utf-8",
				success : function(data) {
					add404 = true;//404
					if(data.state=="error"){
						window.parent.location.href=basePath+"/index.jsp";
					}
					if (data.state == false) {
						//取消禁用撤销功能
						$("#chexiao").removeAttr("disabled");
						$("body").hideLoading();  
						alert(data.msg)
					} else if (data.state == true) {
						add404 = false;//404
						var rowkeyList = data.data;
						var html="";
						if(rowkeyList.length>0){
							 html+='<table class="table table-bordered table-hover tile" style="width:40%">';
							 html+='<thead>';
							 for(var i=0;i<rowkeyList.length;i++){
								 if(i==0){
									 html+=' <tr>';
									 html+='  <th width="150px" rowspan="'+rowkeyList.length+'" style="vertical-align: middle;">404成功rowkey列表</th><td>'+rowkeyList[i]+'</td>';
									 html+=' </tr>'; 
								 }
								 else {
									 html+=' <tr>';
									 html+=' <td>'+rowkeyList[i]+'</td>';
									 html+=' </tr>';
								 }
								 
								}
							 html+=' </thead>';
							 html+='  </table>';
							}
							 $("#returnrowkey").html(html);
							 $("body").hideLoading();  
						
					} else {
						$("body").hideLoading();  
						alert(data.msg);
					}
				},
				error : function() {
					//取消禁用撤销功能
					$("body").hideLoading();  
					$("#chexiao").removeAttr("disabled");
					add404 = true;//404
					alert("error!");
				}
			});
		}
		else{
			//取消禁用撤销功能
			$("#chexiao").removeAttr("disabled");
		}
	}
}

/**
 * 撤销
 * param urlid,isblack
 * 返回
 * */
function cancelBlack(){
	if(cancelAllblack){
		//撤消后禁用404
		$("#isban").attr("disabled","disabled");
		$("body").showLoading();  
		 $("#returnrowkey").html("");
		$.ajax({
			type : "POST",
			url : basePath + "/addblack/rmblackall.do",
			data : {
				"rowkey" : $("#rowkey").val(),
				"ispc" : $("#type").val()
			},
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				cancelAllblack = true;//加黑
				if(data.state=="error"){
					window.parent.location.href=basePath+"/index.jsp";
				}
				
				if (data.state == false) {
					//撤销失败取消禁用404
					$("#isban").removeAttr("disabled");
					$("body").hideLoading();  
					alert(data.msg)
				} else if (data.state == true) {
					if(data.stat==1){
						$("body").hideLoading();  
						alert(data.msg);
					}
					var rowkeyList = data.data;
					var html="";
					if(rowkeyList.length>0){
					 html+='<table class="table table-bordered table-hover tile" style="width:40%">';
					 html+='<thead>';
					 for(var i=0;i<rowkeyList.length;i++){
						 if(i==0){
							 html+=' <tr>';
							 html+='  <th width="150px" rowspan="'+rowkeyList.length+'" style="vertical-align: middle;">撤销成功rowkey列表</th><td>'+rowkeyList[i]+'</td>';
							 html+=' </tr>'; 
						 }
						 else {
							 html+=' <tr>';
							 html+=' <td>'+rowkeyList[i]+'</td>';
							 html+=' </tr>';
						 }
						 
						}
					 html+=' </thead>';
					 html+='  </table>';
					}
					 $("#returnrowkey").html(html);
					cancelAllblack = false;//加黑
					$("body").hideLoading();  
				} else {
					$("body").hideLoading();  
					alert(data.msg);
				}
			},
			error : function() {
				$("body").hideLoading();  
				//撤销失败取消禁用404
				$("#isban").removeAttr("disabled");
				alert("error!");
				cancelAllblack = true;//加黑
			}
		});
	}
}

/**
 * 修改标题来源
 * param urlid,contentfrom,title,oldtitle,oldsource,rowkey
 * 返回
 * */
var editflag = true;
function update(title,contentfrom) {
	if(editflag){
		$("body").showLoading();  
		editflag = false;
		$("#returnrowkey").html("");
		$.ajax({
			type : "POST",
			url : basePath + "/addblack/edittitle.do",
			data : {
				"title" : title,
				"source" : contentfrom,
				"ispc" : $("#type").val(),
				"rowkey" : $("#rowkey").val()
			},
			dataType : "json",
			contentType : "application/x-www-form-urlencoded; charset=utf-8",
			success : function(data) {
				editflag = true;
				if(data.state=="error"){
					window.parent.location.href=basePath+"/index.jsp";
				}
				if (data.state == false) {
					$("body").hideLoading();  
					$("#savetitle").parent().find("p:eq(0)").text($("#oldtitle").val());
					$("#savesource").parent().find("p:eq(0)").text($("#oldtitle").val());
					alert(data.msg)
				} else if (data.state == true) {
					$("body").hideLoading();  
					if(data.data.length > 0 ) {
						if(data.stat==1){
							alert(data.msg);
						}
						layer.msg("success");
						var html="";
						if(data.data.length>0){
							 html+='<table class="table table-bordered table-hover tile" style="width:40%">';
							 html+='<thead>';
							 for(var i=0;i<data.data.length;i++){
								 if(i==0){
									 html+=' <tr>';
									 html+='  <th width="150px" rowspan="'+data.data.length+'" style="vertical-align: middle;">修改成功rowkey列表</th><td>'+data.data[i]+'</td>';
									 html+=' </tr>'; 
								 }
								 else {
									 html+=' <tr>';
									 html+=' <td>'+data.data[i]+'</td>';
									 html+=' </tr>';
								 }
								 
								}
							 html+=' </thead>';
							 html+='  </table>';
						}
						$("#returnrowkey").html(html);
					}
				} else {
					$("#savetitle").parent().find("p:eq(0)").text($("#oldtitle").val());
					$("#savesource").parent().find("p:eq(0)").text($("#oldtitle").val());
					alert(data.msg);
				}

			},
			error : function() {
				$("body").hideLoading();  
				$("#savetitle").parent().find("p:eq(0)").text($("#oldtitle").val());
				$("#savesource").parent().find("p:eq(0)").text($("#oldtitle").val());
				alert("error!");
				editflag = true;
			}
		});
	}
}
