var basePath = "/" + window.document.location.pathname.split("/")[1];
var imgurl = "";
var map = new Array();
$(document)
		.ready(
				function() {
					
			
});

// 回车查询
function on_return() {
	var tmp = $("#urlid").is(":focus");
	if (tmp) {
		if (event.keyCode == 13) {
			search()
		}
	}
}


/**
 * 查询 param urlid 返回 基础rowkeyList，pagewap
 */
function search() {

	// 初始化
	$("#preview").removeAttr("style");
	$("#updatehtml").removeAttr("style");
	$("#zw").html("");

	var flag = true;
	var urlId = $("#urlid").val();
	if (urlId == "") {
		alert("请输入urlid");
		flag = false;
	} else {
		flag = true;
	}
	if (flag) {
		flag = false;
		$("body").showLoading(); 
		$
				.ajax({
					type : "POST",
					url : basePath + "/editpage02/search.do",
					data : {
						"urlid" : urlId
					},
					dataType : "json",
					contentType : "application/x-www-form-urlencoded; charset=utf-8",
					success : function(data) {
						$("body").hideLoading(); 

						if (data.state == "error") {
							window.location.href = basePath + "/index.jsp";
						}

						flag = true;
						if (data.state == false) {
							alert(data.msg)
						} else if (data.state == true) {

							createhtml = true;

							var pagewap = data.data[0];
							var html = "";
							$("#title").val(pagewap.contenttitle);
							$("#source").val(pagewap.source);
							
//							html += "标题：<input type='text' size='50' value='"
//									+ pagewap.contenttitle + "' id='title'><br><br>";
//							html += "来源：<input type='text' size='25' value='"
//									+ pagewap.source
//									+ "' id='contentfrom'><br><br>";
//							html +="日期：<input class='Wdate' type='text' size='25'  id='date' onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',autoPickDate:true})\" readonly='readonly'><br><br>";
//							$("#rowkeyList").html(html);
							
							
//							$("#maintype").val(pagewap.urlmaintype);
							
							//缩略图
							var miniimg = pagewap.imgminilist;
							for(var i=0;i<miniimg.length;i++){
								html="";
								html +="<img src='"+miniimg[i].src+"' localimage='"+miniimg[i].imgname+"'>";
								$("#image"+(i+1)).find(".fileupload-preview:eq(0)").html(html);
								$("#image"+(i+1)).attr("class","fileupload fileupload-exists")
							}
							
							
							//正文部分
							html="";
							var content = pagewap.content;
							for(var x=0 ; x<pagewap.imgs.length;x ++ ){
								 var idx =parseInt(pagewap.imgs[x].idx);
								 var imgidx = ""+idx;
                                 var idxtmp = "";
                                 for(var y=1;y<=4-imgidx.length;y++)
                                 {
                                         idxtmp+="0";
                                 }
                                 imgidx =  idxtmp + imgidx;
                                 imgidx = "$#imgidx="+imgidx+"#$";
                                 content = content.replace(imgidx,"<img src='"+pagewap.imgs[x].src+ "' width='100%'>");
							}
							var contenttext = content.split("!@#!@");
							if (contenttext.length > 0) {
								var j = 0;
								for (var i = 0; i < contenttext.length; i++) {
									if (contenttext[i].length != 0) {
										if(contenttext[i].indexOf("$#imgidx=")!=-1){
											continue;
										}
										html =html+ contenttext[i]+"<br><br>";
									}
								}
							}
							console.log(html);
//							UE.getEditor('editor').execCommand('insertHtml', html);
							$('.wysiwye-editor').code(html);
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
	}
}



//*****************************************预览********************************************
function preview(){
	var title=$("#title").val();	
	var source=$("#source").val();
	var date = $("#date").val();
	if(title == null || title==""){
		layer.tips('标题不能为空', '#title');
		$("#title").focus();
		return;
	}
	if(source == null || source==""){
		layer.tips('来源不能为空', '#source');
		$("#source").focus();
		return;
	}
	var img1 = $("#image1").find("img:eq(0)").attr("localimage");
	if(img1==undefined){
		img1=$("#tmpimg1").val();
		if(img1.length>0 && img1.indexOf("data:image/")==0){
			layer.tips('url不符合格式', '#tmpimg1');
			return;
		}
	}
	var img2 = $("#image2").find("img:eq(0)").attr("localimage");
	if(img2==undefined){
		img2=$("#tmpimg2").val();
		if(img2.length>0 && img2.indexOf("data:image/")==0){
			layer.tips('url不符合格式', '#tmpimg2');
			return;
		}
	}
	var img3 = $("#image3").find("img:eq(0)").attr("localimage");
	if(img3==undefined){
		img3=$("#tmpimg3").val();
		if(img3.length>0 && img3.indexOf("data:image/")==0){
			layer.tips('url不符合格式', '#tmpimg3');
			return;
		}
	}
	if(img1.trim().length==0 && img2.trim().length==0 && img2.trim().length==0){
		layer.msg("缩略图不能是空的",function(){
			//关闭后的操作
		});
		return;
	}
	var content = $(".note-editable");
	var tmpcontent=content.clone(true);
	var a = tmpcontent.find("img:eq(0)");
	if(a.length<=0){
		layer.msg("正文必须要有图片",function(){
			//关闭后的操作
		});
		return;
	}
	tmpcontent.find("img").each(function(){
		if($(this).attr("src").indexOf("data:image/")==0){
			 $(this).removeAttr("src");
		}
	});
	content = tmpcontent.html();
	if(content.trim()==null || content.trim() == "<p><br></p>" || content.trim()==	""){
		$(".note-editable").focus();
		return;
	}
	$("body").showLoading(); 
	$.ajax({
		type : "POST",
		url : basePath + "/editpage02/test1.do",
		data : {
			"img1" : img1,
			"img2" : img2,
			"img3" : img3,
			"title" : title,
			"source" : source,
			"content" : content,
			"date" : date
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
				$("body").hideLoading();  
				layer.open({
					  type: 2,
					  title: '新闻预览',
					  shadeClose: true,
					  shade: 0.8,
					  area: ['500px', '90%'],
					  content: '/html/'+data.data.filepath //iframe的url
					}); 
			} else {
				$("body").hideLoading();  
				alert(data.msg);
			}
		},
		error : function() {
			alert("error!");
			$("body").hideLoading();  
		}
	});
	
}

//**********************************保存*************************************************
function save(){
	$("body").showLoading();  
	setTimeout(function(){
		$.ajax({
			type : "POST",
			url : basePath + "/editpage02/test2.do",
			data : {
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
					layer.msg(data.msg,function(){
						//关闭后的操作
					});
				} else if (data.state == true) {
					$("body").hideLoading();
					layer.msg(data.msg)
					$("#title").before("<h2>URL------>"+data.data.url+"</h2>");
				} else {
					$("body").hideLoading();  
					layer.msg(data.msg);
				}
			},
			error : function() {
				layer.msg("error",function(){
					//关闭后的操作
				});
				$("body").hideLoading();  
			}
		});
	},500);
}

