var app = angular.module("articleModule",[]);

app.controller("articleController",function($scope){
	$scope.adate = adate;
});

app.controller("commentController",function($scope, $timeout, $http){  
	$scope.errorshow = false;
	$scope.error_message = "";
	$scope.info = "";
	$scope.errorif = false; 
	$scope.successif = false; 
	
	$scope.commentsData = comments;	
	$scope.avatar = avatar;
	$scope.username = username;
	$scope.newContent = "";
	
	
	$scope.newComment  = function(){	
		if($scope.newContent.trim().length < 8){
			$scope.errorshow = true;
		}else{
			$scope.errorshow = false;
			var new_comment = {
				pid: pid,
				avatar:$scope.avatar,
				username:$scope.username ,
				content:$scope.newContent,
				cdate: '刚刚'
			};
			
			$http({
			    method: "POST",
			    url:"http://localhost:3000/newcomment",
			    data:new_comment
			}).success(function(data, status, headers, config){
				if(data.success){
					
					$scope.commentsData.unshift(new_comment);
					console.log($scope.commentsData);
					
					$scope.newContent = "";
					$scope.successif = true;
					$scope.info = "添加评论成功";
					$timeout(function(){
						$scope.successif = false;
						$scope.info = "";
					},2000);	
					
				}else{
					$scope.errorif = true;
					$scope.error_message = "添加评论失败";
					$timeout(function(){
						$scope.errorif = false;
						$scope.error_message = "";
					},2000);	
				}
				
			}).error(function(data, status, headers, config){
				$scope.errorif = true;
				$scope.error_message = "添加评论失败";
				$timeout(function(){
					$scope.errorif = false;
					$scope.error_message = "";
				},2000);	
			});
		}
		
	};
});  
