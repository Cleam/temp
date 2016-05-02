var root = "/" + window.document.location.pathname.split("/")[1];

$(document)
		.ready(
				function() {
					var flag = true;
					var miniImgflag = false;
					var updateImgflag = false;
					var writeHtmlflag = false;
					var updateHtmlflag = false;
					var saveHbaseflag = false;
					var isViewflag = false;
					var bool = false;
					// 提交网址采集网页
					$("#submit")
							.click(
									function() {
										var url = $("#url").val();
										if (url.trim().length > 0) {
											if (flag == true) {
												flag = false;
												// 提交网址后初始化所有按钮
												$("#img").html("");// 初始化
												$("#content").html("");// 初始化
												$("#miniImg").css({
													"background" : "red",
													"color" : "white"
												});
												$("#miniImg").val("生成缩略图");
												$("#updateImg").css({
													"background" : "red",
													"color" : "white"
												});
												$("#updateImg").val("上传图片");
												$("#writeHtml").css({
													"background" : "red",
													"color" : "white"
												});
												$("#writeHtml").val("生成HTML");
												$("#saveHbase").css({
													"background" : "red",
													"color" : "white"
												});
												$("#saveHbase").val("存HBASE");
												$("#updateHtml").css({
													"background" : "red",
													"color" : "white"
												});
												$("#updateHtml").val("上传HTML");
												$
														.ajax({
															type : "POST",
															url : root
																	+ "/toCrawler.json",
															data : {
																"url" : url
															},
															dataType : "json",
															contentType : "application/x-www-form-urlencoded; charset=utf-8",
															success : function(
																	data) {
																flag = true;
																miniImgflag = true;
																if (data.Msg == false) {
																	alert("采集失败！");
																} else if (data.Msg == true) {
																	var page = data.page;
																	$("#title")
																			.val(
																					page.contenttitle);
																	$(
																			"#maintype")
																			.val(
																					page.urlmaintype)
																	$("#source")
																			.val(
																					page.source);
																	$("#author")
																			.val(
																					page.author);
																	$(
																			"#pagedate")
																			.val(
																					page.pagedate);
																	$(
																			"#content")
																			.html(
																					page.content);
																} else {
																	alert(data.Msg);
																}

															},
															error : function() {
																alert("error!");
																flag = true;
																// miniImgflag =
																// true;
															}
														});
											}
										} else {
											alert("请输入网址！");
											$("#url").focus();
										}
									});

					// 生成缩略图
					$("#miniImg").click(function() {
						miniImg();
					});
					// 上传图片
					$("#updateImg").click(function() {
						updateImg();
					});
					// 生成HTML
					$("#writeHtml").click(function() {
						writeHtml();
					});
					// 存Hbase
					$("#saveHbase").click(function() {
						saveHbase();
					});
					// 上传HTML文件
					$("#updateHtml").click(function() {
						updateHtml();
					});

					// 一键生成
					$("#onekey").click(function() {
						if (miniImgflag) {
							miniImg();
						}
						if (updateImgflag) {
							updateImg();
						}
						if (writeHtmlflag) {
							writeHtml();
						}
						if (saveHbaseflag) {
							saveHbase();
						}
						if (updateHtmlflag) {
							updateHtml();
						}
					});

					// 开启关闭显示
					$("#view")
							.click(
									function() {
										var isView = $("#view").val();
										if (isView.indexOf("开启") >= 0) {
											isView = 0;
										} else if (isView.indexOf("关闭") >= 0) {
											isView = 1;
										} else {
											isView = -1;
										}
										if (isViewflag == true) {
											isViewflag = false;
											$
													.ajax({
														type : "POST",
														url : root
																+ "/toisView.json",
														data : {
															"isView" : isView
														},
														dataType : "json",
														contentType : "application/x-www-form-urlencoded; charset=utf-8",
														success : function(data) {
															isViewflag = true;
															if (data.Msg == false) {
																alert("发生错误");
															} else if (data.Msg == true) {
																if (data.state == 1) {
																	$("#view")
																			.val(
																					"关闭显示");
																} else if (data.state == 0) {
																	$("#view")
																			.val(
																					"开启显示");
																}
															} else {
																alert(data.Msg);
															}

														},
														error : function() {
															alert("error!");
															saveHbaseflag = true;
														}
													});
										}
									});

					// 生成缩略图
					function miniImg() {
						if (miniImgflag == true) {
							miniImgflag = false;
							$
									.ajax({
										type : "POST",
										async : false,
										url : root + "/toMiniImage.json",
										data : {},
										dataType : "json",
										contentType : "application/x-www-form-urlencoded; charset=utf-8",
										success : function(data) {
											miniImgflag = true;
											if (data.Msg == false) {
												alert("生成缩略图失败成功~");
											} else if (data.Msg == true) {
												$("#miniImg").css({
													"background" : "green",
													"color" : "white"
												});
												$("#miniImg").val("生成缩略图成功");
												updateImgflag = true;
												miniImgflag = false;
												$("#img").html("↓缩略图预览↓");// 初始化
												for (var i = 0; i < data.lunbo.length; i++) {
													$("#img")
															.append(
																	"<img src='/miniimage/"
																			+ data.lunbo[i].imgname
																			+ "'>");
												}
												for (var j = 0; j < data.mini.length; j++) {
													$("#img")
															.append(
																	"<img src='/miniimage/"
																			+ data.mini[j].imgname
																			+ "'>");
												}
											} else {
												alert("fail!");
											}

										},
										error : function() {
											alert("error!");
											miniImgflag = true;
										}
									});
						}
					}
					// 上传图片
					function updateImg() {
						if (updateImgflag == true) {
							updateImgflag = false;
							$
									.ajax({
										type : "POST",
										async : false,
										url : root + "/toupdateImg.json",
										data : {},
										dataType : "json",
										contentType : "application/x-www-form-urlencoded; charset=utf-8",
										success : function(data) {
											updateImgflag = true;
											if (data.result == false) {
												alert("上传图片失败~");
											} else if (data.result == true) {
												$("#updateImg").css({
													"background" : "green",
													"color" : "white"
												});
												$("#updateImg").val("上传图片成功");
												writeHtmlflag = true;
												updateImgflag = false;
											} else {
												alert(data.result);
											}

										},
										error : function() {
											alert("error!");
											updateImgflag = true
										}
									});
						}
					}

					// 生成HTML
					function writeHtml() {
						var maintype = $("#maintype").val();
						var title = $("#title").val();
						var source = $("#source").val();
						var author = $("#author").val();
						var pagedate = $("#pagedate").val();
						if (writeHtmlflag == true) {
							writeHtmlflag = false;
							$
									.ajax({
										type : "POST",
										async : false,
										url : root + "/towriteHtml.json",
										data : {
											"maintype" : maintype,
											"title" : title,
											"source" : source,
											"author" : author,
											"pagedate" : pagedate
										},
										dataType : "json",
										contentType : "application/x-www-form-urlencoded; charset=utf-8",
										success : function(data) {
											writeHtmlflag = true;
											if (data.Msg == false) {
												alert("出错了~~");
											} else if (data.Msg == true) {
												$("#writeHtml").css({
													"background" : "green",
													"color" : "white"
												});
												$("#writeHtml").val("生成HTML成功");
												saveHbaseflag = true;
												writeHtmlflag = false;
											} else {
												alert("fail!");
											}

										},
										error : function() {
											alert("error!");
											writeHtmlflag = true;
										}
									});
						}
					}
					// 存Hbase
					function saveHbase() {
						if (saveHbaseflag == true) {
							saveHbaseflag = false;
							$
									.ajax({
										type : "POST",
										async : false,
										url : root + "/toSaveHbase.json",
										data : {},
										dataType : "json",
										contentType : "application/x-www-form-urlencoded; charset=utf-8",
										success : function(data) {
											saveHbaseflag = true;
											if (data.Msg == false) {
												alert("失败");
											} else if (data.Msg == true) {
												$("#saveHbase").css({
													"background" : "green",
													"color" : "white"
												});
												$("#saveHbase").val("存HBASE成功");
												updateHtmlflag = true;
												saveHbaseflag = false;
											} else {
												alert(data.Msg);
											}

										},
										error : function() {
											alert("error!");
											saveHbaseflag = true;
										}
									});
						}
					}
					// 上传HTML
					function updateHtml() {
						if (updateHtmlflag == true) {
							updateHtmlflag = false;
							$
									.ajax({
										type : "POST",
										async : false,
										url : root + "/toupdateHtml.json",
										data : {},
										dataType : "json",
										contentType : "application/x-www-form-urlencoded; charset=utf-8",
										success : function(data) {
											updateHtmlflag = true;
											if (data.result == false) {
												alert("失败");
											} else if (data.result == true) {
												$("#updateHtml").css({
													"background" : "green",
													"color" : "white"
												});
												$("#updateHtml")
														.val("上传HTML成功");
												$("#img").html("↓访问地址↓");// 初始化
												$("#img").append(data.url);
												updateHtmlflag = false;
												isViewflag = true;
											} else {
												alert(data.result);
											}

										},
										error : function() {
											alert("error!");
											updateHtmlflag = true;
										}
									});
						}
					}

				});
