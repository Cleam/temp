var basePath = "/" + window.document.location.pathname.split("/")[1];
var contentAll = "";
var urlandtype = "";
var map = new Array();
var bool = true;
$(document).ready(function() {
	/*$(".localupload").change(function(){
		 var that = this;
		    var base64str = "";
		    lrz(that.files[0], {
		        width: 400
		    })
		        .then(function (rst) {
		        	console.log(rst.base64);
		            base64str = rst.base64;
		        });
	});*/
});

//预览
function preview(){
	var url = $("#url").val();
	var title=$("#title").val();	
	var source=$("#source").val();
	var maintype = $("#maintype").val();
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
		url : basePath + "/editpage01/test1.do",
		data : {
			"img1" : img1,
			"img2" : img2,
			"img3" : img3,
			"title" : title,
			"source" : source,
			"content" : content,
			"purl" : url,
			"maintype" : maintype
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
			url : basePath + "/editpage01/test2.do",
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
					$("#url").before("<h2>URL------>"+data.data.url+"</h2>");
				} else {
					$("body").hideLoading();  
					layer.msg(data.msg)
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



