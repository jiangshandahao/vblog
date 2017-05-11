$().ready(function() {

  $("#btnSendCode").attr("disabled", "true");
 
// 手机号码验证
  jQuery.validator.addMethod("isMobile", function(value, element) {
      var length = value.length;
      var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
      // optional(element)，用于表单控件的值不为空时才触发验证
      return this.optional(element) || (length == 11 && mobile.test(value));
  }, "请正确填写您的手机号码");

  // 验证注册界面（输入和点击提交按钮时）
  $("#signupForm").validate({
     rules: {
      mobile:{
         required: true,
         minlength : 11,
         isMobile : true,
         remote:{   //验证用户名是否存在
           type:"POST",
           url:"/is_mobile_not_exist",             
           data:{
             phone:function(){return $("#regphone").val();}
           } 
         } 
      },
      username: {
        required: true,
        minlength: 3,
        maxlength:16,
        remote:{   //验证用户名是否存在
           type:"POST",
           url:"/is_username_not_exist",             
           data:{
             name:function(){return $("#username").val();}
           } 
         } 
      },
      password: {
        required: true,
        minlength: 6
      },
      password_repeat: {
        equalTo: "#password"
      },
      email: {
        required: true,
        email: true
      }
    },
    messages: {
      mobile: {
        required : "请输入手机号",
        minlength : "手机号码不能小于11个字符",
        isMobile : "请正确填写您的手机号码",
        remote:"该手机号码已经被注册"
      },
      username: {
        required: "请输入用户名",
        minlength: "用户名的长度必须在3-16字符之间",
        maxlength:"用户名的长度必须在3-16字符之间",
        remote:"该用户名已经被注册"
      },
      password: {
        required: "请输入密码",
        minlength: "密码长度至少为6个字符"
      },
      password_repeat: {
        required: "请再次输入密码",
        minlength: "密码长度至少为6个字符",
        equalTo: "两次输入的密码不一致"
      },
      email: "请输入正确的电子邮件格式"
    }
  });

  /*
   * 阿里大鱼－－发送验证码
   */
  
  var InterValObj; //timer变量，控制时间
  var count = 60; //间隔函数，1秒执行
  var curCount;//当前剩余秒数
  
  $('body').on("click",'#btnSendCode',function(){
    　curCount = count;
  　　//设置button效果，开始计时
       $("#btnSendCode").attr("disabled", "true");
       $("#btnSendCode").val("请在" + curCount + "秒内输入");
       InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
  　　  //向后台发送处理数据
       $.ajax({
       　　type: "GET", //用POST方式传输
       　　dataType: "text", //数据格式:JSON
       　　url: '/phonecpatha', //目标地址
      　　 data: "phonenum=" + $("#regphone").val(),
      　　 error: function (XMLHttpRequest, textStatus, errorThrown) { return;},
       　　success: function (msg){
              if(msg == 'error'){
                $.session.remove('captha');
              }
              else{
                $.session.set('captha', msg);
              }
              return;
           }
       });
  });

  //timer处理函数
  function SetRemainTime() {
      if (curCount == 0) {                
          window.clearInterval(InterValObj);//停止计时器
          $("#btnSendCode").removeAttr("disabled");//启用按钮
          $("#btnSendCode").val("点击获取验证码");
      }
      else {
          curCount--;
          $("#btnSendCode").val("请在" + curCount + "秒内输入");
      }
  };

  
});