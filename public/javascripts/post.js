var ue = UE.getEditor('editor');
function submitFun(s)
{
	articleForm.status.value = s;
	articleForm.submit();
};
$().ready(function() {
  // 验证文章发布界面（输入和点击提交按钮时）
  $("#articleForm").validate({
     rules: {
      title:{
         required: true,
         minlength: 1,
         maxlength : 30 
      },
      abrief:{
      	required: true,
        minlength: 1,
        maxlength : 80 
      },
      channel:{
      	required: true
      }
    },
    messages: {
      title: {
        required : "请输入文章标题",
        minlength : "文章标题不能小于1个字符",
        maxlength : "文章标题不能多于30个字符"      
      },
      abrief: {
        required : "请输入文章摘要",
        minlength : "文章摘要不能小于1个字符",
        maxlength : "文章摘要不能多于80个字符"      
      },
      channel: {
        required : "请输入文章摘要"    
      }
    }
  });
 
});

app.controller("EditController",function($scope, $http){
	
	var res = $http.get("http://localhost:3000/getarticles?type=drafts");
	res.success(function(data, status, headers, config) {
		$scope.drafts = data;
		$scope.completed = true;
		if(data.length == 0){
			var newArticle = {
				atitle: '无文章标题',
				abrief: '无文章摘要',
				content: '<p></p>',
				keywords: ['', '', '', ''],
				mychannel: '',
				modified_date: new Date()
			};
			$scope.drafts.unshift(newArticle);	
		}
		//设置初始状态
		$scope.drafts[0].active = "active";
		$scope.nowarticle = {
			_id:$scope.drafts[0]._id,
			atitle: $scope.drafts[0].atitle,
			mychannel: $scope.drafts[0].mychannel,
			abrief: $scope.drafts[0].abrief,
			keywords: $scope.drafts[0].keywords
		};
		
		//当UEditor组件渲染好了之后（直接赋值会导致找不到组件）， 设置初始值
		ue.addListener('ready', function(e) {
			ue.setContent($scope.drafts[0].content);
		}); //加选择改变事件监听
		
	}).error(function(data, status, headers, config) {
		console.log("获取文章列表失败");
	});	
	
	$scope.Channels = [{ id: 1, name: '互联网资讯', group: '文章分类' }, { id: 2, name: '干货分享', group: '文章分类' }, { id: 3, name: '码农进阶',group:'文章分类' }];
	
	
});

app.controller('ImgController', ['$scope', 'FileUploader', function($scope, FileUploader) {
	var uploader = $scope.uploader = new FileUploader({
		url: 'http://localhost:3000/uploadimg?action=uploadimage'
	});
	$scope.progresson = false;
	$scope.uploadok = false;
	// FILTERS

	uploader.filters.push({
		name: 'imageFilter',
		fn: function(item /*{File|FileLikeObject}*/ , options) {
			var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
			return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
		}
	});

	// CALLBACKS

	uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
		console.info('onWhenAddingFileFailed', item, filter, options);
	};
	uploader.onAfterAddingFile = function(fileItem) {
		console.info('onAfterAddingFile', fileItem);
		$scope.progresson = true;
		fileItem.upload();

	};
	uploader.onAfterAddingAll = function(addedFileItems) {
		console.info('onAfterAddingAll', addedFileItems);
	};
	uploader.onBeforeUploadItem = function(item) {
		console.info('onBeforeUploadItem', item);
	};
	uploader.onProgressItem = function(fileItem, progress) {
		console.info('onProgressItem', fileItem, progress);
	};
	uploader.onProgressAll = function(progress) {
		console.info('onProgressAll', progress);
	};
	uploader.onSuccessItem = function(fileItem, response, status, headers) {
		console.info('onSuccessItem', fileItem, response, status, headers);
		$scope.cover_src = response.url;
		$scope.progresson = false;	
		$scope.uploadok = true;
	};
	uploader.onErrorItem = function(fileItem, response, status, headers) {
		console.info('onErrorItem', fileItem, response, status, headers);
	};
	uploader.onCancelItem = function(fileItem, response, status, headers) {
		console.info('onCancelItem', fileItem, response, status, headers);
	};
	uploader.onCompleteItem = function(fileItem, response, status, headers) {
		console.info('onCompleteItem', fileItem, response, status, headers);
	};
	uploader.onCompleteAll = function() {
		console.info('onCompleteAll');
	};

	console.info('uploader', uploader);
}]);

app.directive("drafts", function() {
	return {
		restrict: 'AEC',
		replace: true,
		templateUrl: '../template/drafts.html',
		scope:{
			completed: '=completedAttr',
			drafts:'=draftsAttr',
			nowarticle:'=nowarticleAttr'
		},
		//scope: true,//父元素继承也无法实现双向绑定
		link: function(scope, elem, attrs) {
			
			scope.selectItem =  function(index){
//				console.log(scope.nowarticle);
				angular.forEach(scope.drafts, function(v) {
					v.active = '';
				});
				scope.nowarticle = {
					_id: scope.drafts[index]._id,
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
					abrief:'无文章摘要',
					content:'<p></p>',
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