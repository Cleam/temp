var basePath = "/" + window.document.location.pathname.split("/")[1];
var zzs = /^(0|[1-9]\d*)$/;
var zeroone = /^[01]$/;

$(document).ready(function() {
	
	//添加图片url
	$("#imgurl").on("click",".addimgurl",function(){
		var html = "";
		html +="<span>图片地址：<input class='imgurl' type='text' size='70'>&nbsp;&nbsp;<a href='javascript:void(0)' class='delimgurl'>删除</a><br><br></span>"
		$("#imgurl").append(html);
	});
	//删除图片url
	$("#imgurl").on("click",".delimgurl",function(){
		$(this).parent().remove();
	});
	
	
	//添加大图片url
	$("#bigimgurl").on("click",".addbigimgurl",function(){
		var html = "";
		html +="<span>大图地址：<input class='imgurl' type='text' size='70'>&nbsp;&nbsp;<a href='javascript:void(0)' class='delbigimgurl'>删除</a><br><br></span>"
		$("#bigimgurl").append(html);
	});
	//删除大图片url
	$("#bigimgurl").on("click",".delbigimgurl",function(){
		$(this).parent().remove();
	});
	
	//是否循环
	$('#isLoop').bind('input propertychange', function() {
		var isloop = $('#isLoop').val();
		if(!zeroone.test(isloop)){
			$("#isLoop").val("");
			$("#isLoop").parent().find("i").remove();
			$("#isLoop").after("<i style='color:red'>  *只能输入0或者1</i>");
		}
		else {
			$("#isLoop").parent().find("i").remove();
		}
		
	})
	
	//循环间隔
	$('#loopInterval').bind('input propertychange', function() {
		var loopInterval = $('#loopInterval').val();
		if(!zzs.test(loopInterval)){
			$("#loopInterval").val("");
			$("#loopInterval").parent().find("i").remove();
			$("#loopInterval").after("<i style='color:red'>  *只能为非负整数</i>");
		}
		else {
			$("#loopInterval").parent().find("i").remove();
		}
		
	})
	
	//是否大图
	$('#isBigImgNews').bind('input propertychange', function() {
		var isBigImgNews = $('#isBigImgNews').val();
		if(!zeroone.test(isBigImgNews)){
			$("#isBigImgNews").val("");
			$("#isBigImgNews").parent().find("i").remove();
			$("#isBigImgNews").after("<i style='color:red'>  *只能输入0或者1</i>");
		}
		else {
			$("#isBigImgNews").parent().find("i").remove();
		}
		
	})
	
	//开始位置
	$('#startIdx').bind('input propertychange', function() {
		var startIdx = $('#startIdx').val();
		if(!zzs.test(startIdx)){
			$("#startIdx").val("");
			$("#startIdx").parent().find("i").remove();
			$("#startIdx").after("<i style='color:red'>  *只能为非负整数</i>");
		}
		else {
			$("#startIdx").parent().find("i").remove();
		}
		
	})
	
	//结束位置
	$('#endIdx').bind('input propertychange', function() {
		var startIdx = $('#endIdx').val();
		if(!zzs.test(startIdx)){
			$("#endIdx").val("");
			$("#endIdx").parent().find("i").remove();
			$("#endIdx").after("<i style='color:red'>  *只能为非负整数</i>");
		}
		else {
			$("#endIdx").parent().find("i").remove();
		}
		
	})
	
	
	//是否推广
	$('#isExtend').bind('input propertychange', function() {
		var isExtend = $('#isExtend').val();
		if(!zeroone.test(isExtend)){
			$("#isExtend").val("");
			$("#isExtend").parent().find("i").remove();
			$("#isExtend").after("<i style='color:red'>  *只能输入0或者1</i>");
		}
		else {
			$("#isExtend").parent().find("i").remove();
		}
	})
	
});


function submit(){
	var add = false;
	if(!check()){
		add = true;
		return;
	}
	if(add){
		return;
	}
	
	
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	var startIdx = $("#startIdx").val();
	var endIdx = $("#endIdx").val();
	var isLoop = $("#isLoop").val();
	var loopInterval = $("#loopInterval").val();
	var allowTypes = $("#allowTypes").val();
	var url = $("#url").val();
	var title = $("#title").val();
	var source = $("#source").val();
	var isExtend = $("#isExtend").val();
	var extendTime = $("#extendTime").val();
	var imgurlstr="";
	$(".imgurl").each(function(){
		imgurlstr+="$$"+$(this).val();
	});
	imgurlstr = imgurlstr.substring(2);
	
	var bigimgurlstr="";
	$(".bigimgurl").each(function(){
		bigimgurlstr+="$$"+$(this).val();
	});
	bigimgurlstr = bigimgurlstr.substring(2);
	var isBigImgNews = $("#isBigImgNews").val();
	
	
	$.ajax({
		type : "POST",
		url : basePath + "/extend/addadvertisement.do",
		data : {
			"startTime" : startTime,
			"endTime" : endTime,
			"startIdx" :startIdx,
			"endIdx" :endIdx,
			"allowTypes":allowTypes,
			"url":url,
			"title":title,
			"source":source,
			"isExtend":isExtend,
			"extendTime":extendTime,
			"imgurlstr" : imgurlstr,
			"isBigImgNews":isBigImgNews,
			"isLoop":isLoop,
			"loopInterval":loopInterval,
			"bigimgurlstr":bigimgurlstr
			
		},
		dataType : "json",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : function(data) {
			add = false;
			if(data.state=="error"){
				window.parent.location.href=basePath+"/index.jsp";
			}
			if (data.state == false) {
				alert(data.msg)
			} else if (data.state == true) {
				alert("提交成功");
				location.reload();
			} else {
				alert(data.msg);
			}
		},
		error : function() {
			alert("error!");
			add = false;
		}
	});
	
	
}


/**
 * 各字段检查
 * */
function check(){
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	var startIdx = $("#startIdx").val();
	var endIdx = $("#endIdx").val();
	var isLoop = $("#isLoop").val();
	var loopInterval = $("#loopInterval").val();
	var allowTypes = $("#allowTypes").val();
	var url = $("#url").val();
	var title = $("#title").val();
	var source = $("#source").val();
	var isExtend = $("#isExtend").val();
	var extendTime = $("#extendTime").val();
	var isBigImgNews = $("#isBigImgNews").val();
	
	if(startTime==undefined || startTime==null || startTime.length<=0){
		$("#startTime").parent().find("i").remove();
		$("#startTime").after("<i style='color:red'>  *开始时间不能为空</i>");
		return false;
	}
	$("#startTime").parent().find("i").remove();
	
	if(endTime==undefined || endTime==null || endTime.length<=0){
		$("#endTime").parent().find("i").remove();
		$("#endTime").after("<i style='color:red'>  *结束时间不能为空</i>");
		return false;
	}
	$("#endTime").parent().find("i").remove();
	
	if(startIdx==undefined || startIdx==null || startIdx.length<=0){
		$("#startIdx").parent().find("i").remove();
		$("#startIdx").after("<i style='color:red'>  *开始位置不能为空</i>");
		$("#startIdx").foucus();
		return false;
	}
	$("#startIdx").parent().find("i").remove();
	
	if(endIdx==undefined || endIdx==null || endIdx.length<=0){
		$("#endIdx").parent().find("i").remove();
		$("#endIdx").after("<i style='color:red'>  *结束位置不能为空</i>");
		$("#endIdx").foucus();
		return false;
	}
	$("#endIdx").parent().find("i").remove();
	
	if(isLoop==undefined || isLoop==null || isLoop.length<=0){
		$("#isLoop").parent().find("i").remove();
		$("#isLoop").after("<i style='color:red'>  *不能为空</i>");
		$("#isLoop").foucus();
		return false;
	}
	$("#isLoop").parent().find("i").remove();
	
	
	if(loopInterval==undefined || loopInterval==null || loopInterval.length<=0){
		$("#loopInterval").parent().find("i").remove();
		$("#loopInterval").after("<i style='color:red'>  *不能为空</i>");
		$("#loopInterval").foucus();
		return false;
	}
	$("#loopInterval").parent().find("i").remove();
	
	
	if(allowTypes==undefined || allowTypes==null || allowTypes.length<=0){
		$("#allowTypes").parent().find("i").remove();
		$("#allowTypes").after("<i style='color:red'>  *分类拼音不能为空</i>");
		$("#allowTypes").foucus();
		return false;
	}
	$("#allowTypes").parent().find("i").remove();
	
	if(url==undefined || url==null || url.length<=0){
		$("#url").parent().find("i").remove();
		$("#url").after("<i style='color:red'>  *广告网址不能为空</i>");
		$("#url").foucus();
		return false;
	}
	$("#url").parent().find("i").remove();
	
	var flag = true;
	$(".imgurl").each(function(){
		var tmp = $(this).val();
		if(tmp==undefined || tmp==null || tmp.length<=0){
			$(this).parent().find("i").remove();
			$(this).after("<i style='color:red'>  *图片地址不能为空</i>");
			$(this).focus();
			flag = false;
			return false;
		}
		$(this).parent().find("i").remove();
	});
	if(!flag){
		return false;
	}
	
	flag = true;
	$(".bigimgurl").each(function(){
		var tmp = $(this).val();
		if(tmp==undefined || tmp==null || tmp.length<=0){
			$(this).parent().find("i").remove();
			$(this).after("<i style='color:red'>  *大图地址不能为空</i>");
			$(this).focus();
			flag = false;
			return false;
		}
		$(this).parent().find("i").remove();
	});
	if(!flag){
		return false;
	}
	
	
	if(isBigImgNews==undefined || isBigImgNews==null || isBigImgNews.length<=0){
		$("#isBigImgNews").parent().find("i").remove();
		$("#isBigImgNews").after("<i style='color:red'>  *是否大图不能为空</i>");
		$("#isBigImgNews").focus();
		return false;
	}
	$("#isBigImgNews").parent().find("i").remove();
	
	
	
	if(title==undefined || title==null || title.length<=0){
		$("#title").parent().find("i").remove();
		$("#title").after("<i style='color:red'>  *广告标题不能为空</i>");
		$("#title").focus();
		return false;
	}
	$("#title").parent().find("i").remove();
	
	if(source==undefined || source==null || source.length<=0){
		$("#source").parent().find("i").remove();
		$("#source").after("<i style='color:red'>  *广告来源不能为空</i>");
		$("#source").focus();
		return false;
	}
	$("#source").parent().find("i").remove();
	
	if(isExtend==undefined || isExtend==null || isExtend.length<=0){
		$("#isExtend").parent().find("i").remove();
		$("#isExtend").after("<i style='color:red'>  *是否推广不能为空</i>");
		$("#isExtend").focus();
		return false;
	}
	$("#isExtend").parent().find("i").remove();
	
	if(extendTime==undefined || extendTime==null || extendTime.length<=0){
		$("#extendTime").parent().find("i").remove();
		$("#extendTime").after("<i style='color:red'>  *推广结束时间不能为空</i>");
		return false;
	}
	$("#extendTime").parent().find("i").remove();
	return true;
}


function isLoopcheck(value){
	var zeroone = /^[01]$/;
	if(!zeroone.test(value)){
		$("#isLoop").val("");
	}
}

