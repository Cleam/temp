$(function(){

	//懒加载 
	$("img.lazy").lazyload({effect: "fadeIn"});
	
	//点击加入购物车icon动画效果
	$('.turn').on('click',function(){
            if($(this).hasClass('turn-around-a')){
               
                $(this).removeClass('turn-around-a').removeClass('turn-around');
           
            }else{
                $(this).addClass('turn-around-a').addClass('turn-around');
            }
        
    });



	//分类点击tab切换样式
	$('.togglon .swiper-slide').on('click',function(){
		$(this).addClass('on').siblings().removeClass('on');
	});
// 加入购物车
    $('#addcart').on('tap', function() {

                    $(this).securityTap({
                        isIllegal: function(){
                            return !$.isLogin();
                        },
                        ajax: {
                            url: '/user/cart/add',
                            type: 'POST',
                            data: {
                                productId: productId,
                                merchantId: merchantId,
                                num: $('#num').val()
                            }
                        },
                        isNotJump: true,
                        success: function() {
                            $.alert('加入购物车成功');
                        },
                        error: function(error) {
                            $.alert(error.message);
                        }
                    });
                });
  //版本切换
  $('.tap-vs p').on('click',function(){
    $(this).addClass('on').siblings().removeClass('on');
  })
})


