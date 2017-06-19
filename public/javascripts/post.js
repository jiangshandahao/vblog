var ue = UE.getEditor('editor');

$().ready(function() {
  // 验证文章发布界面（输入和点击提交按钮时）
  $("#articleForm").validate({
     rules: {
      title:{
         required: true,
         minlength: 1,
         maxlength : 30 
      }
    },
    messages: {
      title: {
        required : "请输入文章标题",
        minlength : "文章标题不能小于1个字符",
        maxlength : "文章标题不能大于30个字符"      
      }
    }
  });
});

var app = angular.module("postModule",[]);

app.controller("EditController",function($scope){
	$scope.drafts = [{
		atitle: 'aaaaa',
		abrief: 'AAA 简介',
		content: '1111sdfsfdsdfs',
		abrief: 'sss',
		keywords: ['前端', 'HTML5', 'Web', ''],
		mychannel: '互联网资讯',
		modified_date: '2017-8-8'
	}, {
		atitle: 'bbbbb',
		abrief: 'BBBB 简介',
		content: '2222sdfsfdsdfs',
		abrief: '简介',
		keywords: ['前2端', 'HTML5', 'Web', ''],
		mychannel: '互联网资讯',
		modified_date: '2017-8-8'
	}, {
		atitle: 'cccccc',
		abrief: 'CCCC 简介',
		content: '3333sdfsfdsdfs',
		abrief: '',
		keywords: ['前3端', 'HTML5', '', ''],
		mychannel: '码农进阶',
		modified_date: '2017-8-8'
	}, {
		atitle: 'ddddd',
		abrief: 'DDDDD 简介',
		content: '4444sdfsfdsdfs',
		abrief: '',
		mychannel: '',
		keywords: ['前端', 'HTML335', 'Web', ''],
		modified_date: '2017-8-8'
	}];
	
	$scope.Channels = [{ id: 1, name: '互联网资讯', group: '文章分类' }, { id: 2, name: '干货分享', group: '文章分类' }, { id: 3, name: '码农进阶',group:'文章分类' }];
	
	//设置初始状态
	$scope.drafts[0].active = "active";
	$scope.nowarticle = {
		atitle: $scope.drafts[0].atitle,
		mychannel: $scope.drafts[0].mychannel,
		abrief: $scope.drafts[0].abrief,
		keywords: $scope.drafts[0].keywords
	};
	//当UEditor组件渲染好了之后（直接赋值会导致找不到组件）， 设置初始值
	ue.addListener('ready',function(e){
		ue.setContent($scope.drafts[0].content) ;
	});//加选择改变事件监听
	
	
});


app.directive("drafts", function() {
	return {
		restrict: 'AEC',
		replace: true,
		templateUrl: '../template/drafts.html',
		scope:{
			drafts:'=draftsAttr',
			nowarticle:'=nowarticleAttr'
		},
		//scope: true,//父元素继承也无法实现双向绑定
		link: function(scope, elem, attrs) {
			
			scope.selectItem =  function(index){
				console.log(scope.nowarticle);
				angular.forEach(scope.drafts, function(v) {
					v.active = '';
				});
				scope.nowarticle = {
					atitle:scope.drafts[index].atitle,
					mychannel:scope.drafts[index].mychannel,
					abrief: scope.drafts[index].abrief,
					keywords: scope.drafts[index].keywords
				};
				scope.drafts[index].active = "active";
				ue.setContent(scope.drafts[index].content) ;
			};
			
			
			scope.selectDraft = function(index){
				scope.selectItem(index);
			};
			scope.newDraft = function(){
				
				var newArticle = {
					atitle:'无文章标题',
					abrief:'无简介内容',
					content:'ggggg',
					abrief:'',
					keywords: ['','','',''],
					mychannel: '',
					modified_date: new Date()
				};
				scope.drafts.unshift(newArticle);				
				scope.selectItem(0);
			};
			
		}
	}
});