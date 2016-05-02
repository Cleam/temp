if(!Array.indexOf){
    Array.prototype.indexOf = function(obj)
    {              
        for(var i=0; i<this.length; i++)
        {
            if(this[i]==obj)
            {
                return i;
            }
        }
        return -1;
    }
}
var coo_name = null;
var key = 'MINI_QID_COOKIE';
//渠道
var QUERY = document.location.search;
QUERY = QUERY.substr(1, QUERY.length - 1);
var QIDS = [
	'qid=114laxinwen',
	'qid=dfmini',
    'f=dfmini',
	'dftt',
    'hot',
    'qid=bottom',
    'jx',
    'tj',
	'qid=fuxin',
	'qid=kuwomini',
	'qid=16lao',
	'123',
	'mgtt',
	'mgyl',
	'2345',
	'qid=2345kz',
	'qid=uchomepage',
	'qid=uc',
	'f=uc',
	'114lq',
	'114bg',
    'm1905',
	'114lakuzhan',
	'qid=114lahomepage',
	'qid=114lahomepage1',
	'qid=114lahomepage2',
	'qid=114latoutiao',
	'sgny',
	'ay',
	'360dh',
	'qid=360dh',
	'uckuzhan',
	'qqkz',
	'qid=2345shouye',
	'qid=sougoukz',
	'qid=1188kz',
	'qid=1188kztoutiao',
	'kupingnews',
	'kupingredian',
	'qid=ayshehui',
	'qid=top81',
	'qid=sinajunshi',
	'qid=newjunshi',
	'qid=ktmini',
	'qid=rlmini',
	'rltt',
	'qid=youkunews',
	'qid=lslianmeng-01',
	'qid=lslianmeng-02',
	'qid=lslianmeng-03',
	'qid=lslianmeng-04',
	'qid=lslianmeng-05',
	'qid=lslianmeng-06',
	'qid=lslianmeng-07',
	'qid=lslianmeng-08',
	'qid=lslianmeng-09',
	'qid=lslianmeng-10',
	'qid=ucipad',
	'qid=360kjzs',
	'qid=114laneiye',
	'qid=cnxh',
	'qid=1905',
    'qid=21cn',
    'qid=qqlieqi',
    'qid=huashengribao',
    'qid=kugou',
    'qid=sinajunshi',
    'qid=uc123kz',
    'qid=favclient',
    'qid=114lamz',
    'qid=dubajunshi',
    'qid=114layule',
    'qid=qqdjdzk',
    'qid=dubakz',
    'qid=fuxin',
    'qid=ifentupian',
    'qid=youkutoutiao',
    'qid=jsdbmini',
    'qid=200net',
    'qid=sgny',
    'qid=114layule',
    'qid=ipadbrowser',
    'qid=114lahomepage1',
    'qid=114lahomepage2',
    'qid=499',
    'qid=photo',
	'qid=1616',
	'qid=6899',
    'qid=vidown',
	'qid=winrar',
	'qid=pciiss',
	'qid=ludashi',
	'www.hao123.com',
	'ipad.hao123.com',
	'cn.hao123.com',
	'qid=xunleiyingyin'
];
//来源
var REFERRER = document.referrer;
if(REFERRER.length != 0){
	if(REFERRER.indexOf('http://') >= 0){
		rf_arr = REFERRER.split('http://');
	}else{
		rf_arr = REFERRER.split('https://');
	}
	REFERRER_RESULT = rf_arr[1].split('/');
	REFERRER = REFERRER_RESULT[0];
}
var REFS = [
	'www.hao123.com',
	'ipad.hao123.com',
	'cn.hao123.com',
	'news.baidu.com',
	'daohang.6899.com',
	'yule.baidu.com',
	'guonei.news.baidu.com',
	'guoji.news.baidu.com',
	'shehui.news.baidu.com',
	'mil.news.baidu.com',
	'sports.baidu.com',
	'tech.baidu.com',
	'lady.baidu.com',
	'sh.qihoo.com',
	'hao.360.cn'
];
//检验是否在其中
var QUERY_IN_ARRAY = QIDS.indexOf(QUERY);
var REFERRER_IN_ARRAY = REFS.indexOf(REFERRER);
if(QUERY_IN_ARRAY == -1){
	if(REFERRER_IN_ARRAY != -1){
		//渠道来源在列表中
		init_cookie(REFERRER);
	}else{
		//都不在需要读取coo_name
		var cookie = document.cookie;
		if(cookie.indexOf(key) != -1){
			coo_aar = cookie.split(key);
			coo_name_arr = coo_aar[1].split(';');
			coo_name = coo_name_arr[0].substr(1, coo_name_arr[0].length - 1);
		}else{
			coo_name = null;
		}
	}
}else{
	//渠道参数在列表中
	init_cookie(QUERY);
}
function init_cookie(cookie_name){
	document.cookie = key+'='+cookie_name+';domain=.eastday.com;path=/';
	//读取
	var cookie = document.cookie;
	var coo_aar = cookie.split(key);
	coo_name_arr = coo_aar[1].split(';');
	coo_name = coo_name_arr[0].substr(1, coo_name_arr[0].length - 1);
}
var xx = GetQueryString('xx');
//获取url参数值
function GetQueryString(name)
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
}