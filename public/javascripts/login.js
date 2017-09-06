//极验GeeTest验证码
var handlerEmbed = function(captchaObj) {
	$("#embed-submit").click(function(e) {
		var validate = captchaObj.getValidate();
		if(!validate) {
			$("#notice")[0].className = "show";
			setTimeout(function() {
				$("#notice")[0].className = "hide";
			}, 2000);
			e.preventDefault();
		}else{
			$('form').submit();
		}
	});
	// 将验证码加到id为captcha的元素里，同时会有三个input的值：geetest_challenge, geetest_validate, geetest_seccode
	captchaObj.appendTo("#embed-captcha");
	captchaObj.onReady(function() {
		$("#wait")[0].className = "hide";
	});
	// 更多接口参考：http://www.geetest.com/install/sections/idx-client-sdk.html
};
$.ajax({
	// 获取id，challenge，success（是否启用failback）
	url: "/pc-geetest/register?t=" + (new Date()).getTime(), // 加随机数防止缓存
	type: "get",
	dataType: "json",
	success: function(data) {
		// 使用initGeetest接口
		// 参数1：配置参数
		// 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
		initGeetest({
			gt: data.gt,
			challenge: data.challenge,
			product: "float", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
			offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
			// 更多配置参数请参见：http://www.geetest.com/install/sections/idx-client-sdk.html#config
		}, handlerEmbed);
	}
});

$().ready(function() {
  // 手机号码验证
  jQuery.validator.addMethod("isMobile", function(value, element) {
      var length = value.length;
      var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
      // optional(element)，用于表单控件的值不为空时才触发验证
      return this.optional(element) || (length == 11 && mobile.test(value));
  }, "请正确填写您的手机号码");
	
  $("#loginForm").validate({
    rules: {
      mobile:{
        required: true,
        isMobile : true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      mobile: {
        required: "用户名不能为空",
        isUsername: "用户名格式错误"
      },
      password: {
        required: "密码不能为空",
        minlength: "密码长度至少为6个字符"
      }
    }
  });
});
