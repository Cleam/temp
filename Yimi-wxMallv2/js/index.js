$(function() {


    var page = {
        init: function() {
            var me = this;
            me.render();
            me.bindEvent();
            me.clearStorage();
            me.locate();
        },
        render: function() {
            var _this = this;

            // 页面的Android全局兼容
            if ($.os.android) {
                $('header #title').html('首页');
            }

            // 轮播图插件启动
            _this.swipeSlide();

            //  精品预售初始状态重置
            $.ls('curSaleList', null);

            // 撤销遮罩
            $.hideLoading();
        },
        bindEvent: function() {
            //扫码
            window.FFT_QRCode_Service_CallBack = function(result) {
                $('#loading').show();
                var v;
                try {
                    var obj = JSON.parse(result);
                    v = (obj.constructor == Object) ? obj.crcodeResult : result;
                } catch (e) {
                    v = result;
                }

                var code, type;

                if(v.indexOf('http') != -1 && v.indexOf('/') != -1) {
                    var parObj = $.getRequestData(v); 
                    type = parObj.type;
                    code = parObj.id;
                } else {
                    var resArr = v.split(';');
                    code = resArr[0];
                    type = resArr[1];
                }

                var goPage = {
                    '3': 'cheapDetail', //团购
                    '4': 'boutiqueSaleDetail.html', //预售
                    '5': 'famousGoodsDetail.html', //名优特惠
                    '6': 'creditGoodsDetail.html', //在线积分兑换
                    '7': 'creditGoodsDetail.html' //线下积分兑换
                };
                if (goPage[type]) {
                    $.gotoUrl(goPage[type] + '?productId=' + code);
                    return false;
                }

                if (type == '9') {
                    return $.gotoUrl({
                        url: 'fastPayConfirm.html',
                        outletId: code
                    }, $.createUrl({
                        url: 'fastPayConfirm.html',
                        outletId: code
                    }));
                }

                // todo 兼容老模块
                // if (type != '0') {
                //     $("#loading").hide();
                //     $.alert('扫描的二维码错误或不存在', 3000);
                //     return false;
                // }

                $.commonAjax({
                    url: "I180",
                    async: "false",
                    isShowError: true,
                    data: {
                        content: code
                    },
                    success: function(data) {
                        data.url = 'f2fCashier.html';
                        data.code = code;
                        $.gotoUrl(data, $.createUrl(data));
                    },
                    error: function(error) {
                        $("#loading").hide();
                        $.alert(error.message, 3000);
                        return false;
                    }
                });
            };

            window.CBank.qrcodecallback = window.FFT_QRCode_Service_CallBack;

            $('body').on('tap', '#searchAll', function() {
                $.gotoUrl('search.html');
            });

            $('body').on('tap', '#chooseCity', function() {
                $.gotoUrl('gpsPrivate.html');
            });

            $('body').on('tap', '.js-icon', function() {
                
                var type = $(this).data('type'),
                    url = $.getFunctionUrlBytype(type);
                if (url === 'scanCode') {
                    return BASE.clientSocket('FFT_QRCode_Service', {
                        'need_manual_input': 'false'
                    }, 'FFT_QRCode_Service_CallBack');
                }
                if (type == '3') {
                    url =  $(this).data('href');
                }

                $.gotoUrl(url);
            });

            $('body').on('tap', '#secList .goods-box', function() {
                window.location.href = $(this).data("href");
            });

            $('body').on('tap', '.js-sec-list', function() {
                $.gotoUrl('secList.html');
            });

            $('body').on('tap', '.js-ad', function(){
                $.gotoUrl($(this).data('href'));
            });


            $('body').on('tap', '.js-recommend', function(){
                var that = $(this);
                $.gotoUrl({
                    url:'recommendList.html',
                    id: that.data('id'),
                    type: that.data('name')
                });
            }); 

        },
        clearStorage: function() {
            // 清除本地数据
            for (var i = 0; i < (window.localStorage || window.sessionStorage).length; i++) {
                var key = (window.localStorage || window.sessionStorage).key(i);
                if (key.indexOf(".html") != -1) {
                    (window.localStorage || window.sessionStorage).removeItem(key);
                }
            }
        },
        locate: function() {

            // if it's the first time to enter the app, in this session
            if(!sessionStorage.getItem('isNoFirstAPP')) {

                // if enter, set isNoFirstApp to true
                sessionStorage.setItem('isNoFirstAPP', true);

                // 调用GPS来确定当前cityId和后台的是否相同
                // data structure is
                // {
                //     cityId: CITY_ID
                //     cityName: CITY_NAME,
                //     isSupprot: TRUE,
                //     gpsLocation: GPS_LOCATION,
                //     gpsCityCode: GPS_CITYCODE,
                //     gpsCityName: GPS_CITYNAME
                // }
                $.getCurCityInfo().done(function(data) {

                    $.cookie('isSupprot',  data.isSupprot, { expires: 'd365', domain: 'ubank365.com' });

                    if(data.isSupprot) { // plz, ignore the typo error

                        // 如果cookie当中的areaId和data当中的cityId不相同
                        if($.cookie('areaId') !== data.cityId) {

                            // 弹框说！是否切否至GPS城市
                            if(data.gpsCityName) {
                                $.dialog({
                                    content: '<p style="font-size:14px;">是否切换至GPS定位城市？</p>',
                                    title: 'null',
                                    ok: function() {
                                        // set cityId to cookie:areaId
                                        $.cookie('areaId', data.cityId, { expires: 'd365', domain: 'ubank365.com' });
                                        $.cookie('cityCode', data.gpsCityCode, { expires: 'd365', domain: 'ubank365.com'});
                                        $.cookie('cityName', data.gpsCityCode, { expires: 'd365', domain: 'ubank365.com'});
                                        $.ls('curCityName', data.cityName);

                                        // reload this page
                                        window.location.reload();
                                    },
                                    cancel: function() {
                                        // do nothing
                                    },
                                    lock: true
                                });
                            }

                        }

                    } else {
                        // if curCity is not supported, keep the page the same
                        // do nothing
                        $.cookie('longitude', null, { expires: 'd365', domain: 'ubank365.com' });
                        $.cookie('latitude', null, { expires: 'd365', domain: 'ubank365.com' });
                    }
                })
                    .fail(function() {

                        $.ls('_gpsCityCode', null);
                        $.ls('_gpsLocation', {});
                        $.ls('_gpsCityName', null);
                        $.cookie('longitude', null, { expires: 'd365', domain: 'ubank365.com' });
                        $.cookie('latitude', null, { expires: 'd365', domain: 'ubank365.com' });
                    });

            } else {

                // it's not the first time to enter the index in this session
                // do nothing
            }
        },

        swipeSlide: function() {
            // 初始化图片轮播
            $('#slide').swipeSlide({
                continuousScroll: true,
                speed: 2000,
                transitionType: 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
                callback: function(i) {
                    $('.dot2').children().eq(i).addClass('cur').siblings().removeClass('cur');
                }
            });
        }

    };

    // 页面初始化
    page.init();

});

// performance拼接上报
if (('performance' in window) && ('getEntriesByType' in window.performance) &&
    (window.performance.getEntriesByType('resource') instanceof Array)) {
    window.addEventListener('load', timingSmt);
    function timingSmt(){
        var timing = window.performance.timing,
            resources = window.performance.getEntriesByType('resource');

        var praObj = {
            option: 'performance',
            page: location.protocol + '//' + location.host + location.pathname,

            dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
            tcpTime: timing.connectEnd - timing.connectStart,
            reqTime: timing.responseEnd - timing.responseStart,
            domParseTime: timing.domComplete - timing.domInteractive,
            whiteTime: timing.responseStart - timing.navigationStart,
            domreadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
            onloadTime:  timing.loadEventEnd - timing.navigationStart
        };

        // 确保正确获取timing各项值
        if(timing.loadEventEnd <= 0){
            setTimeout(function(){
                timingSmt();
            }, 200);
            return;
        }

        if(timing.loadEventEnd > 0){
            for(var obj in resources) {
                var praArr = [];
                if(resources[obj]['initiatorType'] == 'img') {
                    //for(var properties in resources[obj]) {
                    //    list.push(properties + '=' + resources[obj][properties]);
                    //}

                    for(var p in praObj){
                        praArr.push(p + '=' + praObj[p]);
                    }

                    // 发送get请求
                    var image = new Image();
                    image.src = CONFIG.logUrl + '/report.gif?' + praArr.join('&');
                }
            }
        }
    }
}
