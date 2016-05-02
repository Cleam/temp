/**
 * 首页js
 * Created by lizhigao on 2016/1/12.
 */
$(function(){
	/**
	 * 轮播功能
	 */
	(function(){
		//轮播图
		var _banner_current = 0;
		var prev = null;
		var next = null;
		var _banner_time = null;
		var $body = $('body');
        // 左侧按钮点击事件
		$body.on('click','.btn_l',function(){
			if(_banner_current == 0){
				prev = $('.banner_act div').length - 1;
			}else{
				prev = _banner_current-1
			}
			$('.banner_act div span:eq('+prev+')').trigger('mouseenter');
		});
        // 右侧按钮点击事件
		$body.on('click','.btn_r',function(){
			if(_banner_current == $('.banner_act div').length - 1){
				next = 0;
			}else{
				next = _banner_current+1
			}
			$('.banner_act div span:eq('+next+')').trigger('mouseenter');
		});
		$body.on('mouseover','.banner_act div',function(e){
			$('.banner_act div span').removeClass('now');
			$(this).find('span').addClass('now');
			$('.banner .img_a').hide();
			$('.banner .img_a:eq('+$(this).index()+')').show();
			$('.banner_txt a').text($('.banner .img_a:eq('+$(this).index()+')').attr('data-title'));
			$('.banner_txt a').attr('href', $('.banner .img_a:eq('+$(this).index()+')').attr('href'));
			_banner_current = $(this).index();
			e.stopPropagation();
		});
		// $('.banner_act div span:eq(0)').trigger('mouseenter');
		$body.on('mouseenter','.banner',function(){
			$('.btn_l, .btn_r').stop();
			$('.btn_l').animate({
				left:'20px'
			});
			$('.btn_r').animate({
				right:'20px'
			});
			clearInterval(_banner_time);
		});
		$body.on('mouseleave','.banner',function(){
			$('.btn_l, .btn_r').stop();
			$('.btn_l').animate({
				left:'-50px'
			});
			$('.btn_r').animate({
				right:'-50px'
			});
			_banner_time = setInterval(function(){
				$('.btn_r').trigger('click');
			}, 6000);
		});	
		$(window).load(function(){
			$('.banner').trigger('mouseleave');	
		});
	})();

	/**
	 * 热点要闻、个性推荐切换功能
	 */
	(function(){
		var $hotPersonalityNav = $('#J_hot_personality_nav'),
            $line = $hotPersonalityNav.children('.J-bt-line'),
			$hotNews = $('#J_hot_news'),
			$personalityRecommend = $('#J_personality_recommend');
		$hotPersonalityNav.on('click', '.J-nav', function(){
			var $this = $(this);
			$hotPersonalityNav.find('.J-nav').removeClass('active');
			$this.addClass('active');
			if($this.data('target') == 'hn'){	// 热点要闻
				$personalityRecommend.stop().fadeOut(400, function(){
                    $hotNews.fadeIn();
                });
                $line.animate({
                    'left': 0
                });
			} else {	// 个性化推荐
                /*
                分析： 首次点击时无内容，需要先加载内容
                 */

                $.getJSON('/json/index/personal.json', function(data){
                    console.info(data);
                });
				$hotNews.stop().fadeOut(400, function(){
                    $personalityRecommend.fadeIn();
                });
				//$personalityRecommend.fadeIn();
                $line.animate({
                    'left': '120px'
                });
			}

		});
	})();

	/**
	 * 阅读排行（今天、昨天切换功能）
	 */
	(function(){
		var $readRateTab = $('#J_read_rate_tab'),
			$tabToday = $('#J_tab_today'),
			$tabYesterday = $('#J_tab_yesterday');
		$readRateTab.on('click', 'a', function(){
			var $this = $(this);
			$readRateTab.find('a').removeClass('active');
			$this.addClass('active');
			if($this.data('target') == 'today'){
				$tabYesterday.fadeOut(400, function(){
                    $tabToday.fadeIn();
                });
			} else {
				$tabToday.fadeOut(400, function(){
                    $tabYesterday.fadeIn();
                });
			}
		});
	})();

});