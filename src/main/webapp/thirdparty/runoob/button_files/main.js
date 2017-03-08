function NewWindow(text) {
  win=window.open(text,'','top=0,left=0,width=400,height=350');
}
jQuery(document).ready(function ($){
//$(function(){

	//搜索
	$(".search-reveal").click(function() {
        $(".row-search-mobile").slideToggle("400",
        function() {});
    });
	
	$('.placeholder').on('blur',function(){
	    if($(this).val() == ""){
	     $(this).val("搜索……");
	     }
	});
	$('.placeholder').on('focus',function(){
	 if($(this).val() == '搜索……') {
	      $(this).val('');
	   }
	});
	$('#feed_email').on('blur',function(){
	    if($(this).val() == ""){
	     $(this).val("输入邮箱 订阅笔记");
	     }
	});
	$('#feed_email').on('focus',function(){
	 if($(this).val() == '输入邮箱 订阅笔记') {
	      $(this).val('');
	   }
	});
	
	//代码高亮
	if(!$("pre").hasClass("prettyprint")) {
		$("pre").addClass("prettyprint");
	}
	

	// 列表
	color_flag = false; //配色标记
	prev_title_flag = false;
	next_title_flag = false;
 	href = window.location.href;
 	var total = $("#leftcolumn a").length;
	$("#leftcolumn").find("a").each(function(index, value){
		if(next_title_flag) {
				return false; //结束循环
		} 
		
		
		cur_href = $(this).attr("href");
		
		cur_obj = $(this);

		//if(href.match(cur_href) != null) {
		if(href.indexOf(cur_href) != -1) {
			console.log('cur_href', cur_href);
		if(index==0) {
			$(".previous-design-link").hide();
		}
		if(index==(total-1)) {
			$(".next-design-link").hide();
		}
			
			
			if(cur_href.indexOf('/') == -1) { //第二重判断
				tmp_url = href.substring(0, href.lastIndexOf('/')+1) + cur_href;
				
				if(href != tmp_url) return;
			}
			if(!color_flag) {
				$(this).css({"background-color":"#96b97d","font-weight":"bold", "color":"#fff"});
				color_flag = true;
			}
			prev_href = $(this).prev("a").attr("href");
			prev_title = $(this).prev("a").attr("title");
			if(!prev_title) prev_title=$(this).prev("a").text();
			next_href = $(this).next("a").attr("href");
			next_title = $(this).next("a").attr("title");
			if(!next_title) next_title=$(this).next("a").text();
			if(!prev_title_flag) {
				if( prev_title ) {
					$(".previous-design-link a").attr("href", prev_href);
					$(".previous-design-link a").attr("title", prev_title);
					$(".previous-design-link a").text( prev_title);
				} else {
					if(typeof(prev_obj) != 'undefined') {
						prev_href = prev_obj.attr("href");
						prev_title = prev_obj.attr("title");
						if(!prev_title) prev_title=prev_obj.text();
						if(prev_title) {
							$(".previous-design-link a").attr("href", prev_href);
							$(".previous-design-link a").attr("title", prev_title);
							$(".previous-design-link a").text( prev_title);
						}
					}
					
				}
				prev_title_flag = true;
			}
			if(next_title) {
				if($(".next-design-link a").attr("href")) {
					$(".next-design-link a").attr("href", next_href);
					$(".next-design-link a").attr("title", next_title);
					$(".next-design-link a").text( next_title);
				} else {
					$(".next-design-link").html("<a href=\"" + next_href + "\" rel=\"next\" title=\"" + next_title + "\">" + next_title + "</a> &raquo;");
				}
				
				next_title_flag = true;
				
			}
			//return false; 
		} else {
			prev_obj = cur_obj;
			if(next_title_flag) {
				return false;
			} else {
				if(prev_title_flag) {
					next_href = $(this).attr("href");
					next_title = $(this).attr("title");
					if(!next_title) next_title=$(this).text();
					if(next_title) {
						if($(".next-design-link a").attr("href")) {
							$(".next-design-link a").attr("href", next_href);
							$(".next-design-link a").attr("title", next_title);
							$(".next-design-link a").text( next_title);
						} else {
							$(".next-design-link").html("<a href=\"" + next_href + "\" rel=\"next\" title=\"" + next_title + "\">" + next_title + "</a> &raquo;");
						}
						next_title_flag = true;
					}
				}
			}
		}
	});
	
	// 侧栏
	$(".sidebar-tree > ul > li").hover(function(){
		$(this).addClass("selected");
		$(this).children("a:eq(0)").addClass("h2-tit");
		$(this).children("ul").show();
	},function(){
		$(this).removeClass("selected");
		$(this).children(".tit").removeClass("h2-tit");
		$(this).children("ul").hide();
	})
	// 关闭QQ群
	$(".qqinfo").hide();
	//$.getJSON("/try/qqinfo.php", function(data) {
	//	$("#qqid").text(data.qqid);
	//	$("#qqhref").attr("href", data.qqhref);
	//});
	// 首页导航
	$("#index-nav li").click(function(){
		$(this).find("a").addClass("current");
		$(this).siblings().find("a").removeClass("current");
		id = $(this).find("a").attr("data-id");
		if(id == 'index') {
			
		}
		if(id == 'note') {
			
		} else if(id == 'tool') {
			
		} else if(id == 'quiz') {
			$("#tool").hide();
			$("#manual").hide();
			$("#" + id).show();
			$(".sub-navigation-articles").show();
		} else if(id == 'manual') {
			$("#tool").hide();
			$("#quiz").hide();
			$("#" + id).show();
			$(".sub-navigation-articles").show();
		} else {
			$("#tool").hide();
			$("#quiz").hide();
			$("#manual").hide();
		}
    });
	$("#cate0").click(function() {
		$(".codelist-desktop").show();
	})
	$(".design").click(function() {
		id = $(this).attr("id");
		$("." + id).show();
		$("." + id).siblings().hide();
	})
	//移动设备点击链接	
	$('a').on('click touchend', function(e) {
		if(screen.availHeight==548 && screen.availHeight==320) {
	  		var el = $(this);
	  		var link = el.attr('href');
	  		window.location = link;
  		}
	});
	
	$("#pull").click(function() {
		$(".left-column").slideToggle("400",function() {});
	})
	$(".qrcode").hover(function(){
		$("#bottom-qrcode").show();
		},function(){
			$("#bottom-qrcode").hide();
	});
	$(window).scroll(function () {
	    if($(window).scrollTop()>=100) {
	        $(".go-top").fadeIn();
	    }else {
	    	$(".go-top").fadeOut();
	    }
	});


	$(".go-top").click(function(event){	
		$('html,body').animate({scrollTop:0}, 100);
		return false;
	});
	
});
// 百度自动推送
(function(){
    var bp = document.createElement('script');
    bp.src = '//push.zhanzhang.baidu.com/push.js';
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();