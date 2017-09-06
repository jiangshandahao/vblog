var app = angular.module("articleModule",[]);

app.controller("articleController",function($scope, $http, $timeout){
	$scope.article = article;
	$scope.commentsData = [];
	$scope.goodActive  = (article.agood.indexOf(user._id) !== -1);
	$scope.markActive = (article.amark.indexOf(user._id) !== -1);
	$scope.alertInfo = {
		type: 'success',
		info:"",
		show:false,
		showInfo: function(type, info) {
			$scope.alertInfo.type = type; 
			$scope.alertInfo.info = info;
			$scope.alertInfo.show = true; 
			$timeout(function() {
				$scope.alertInfo.show = false;
				$scope.alertInfo.info  = "";
			}, 2000);
		}
	};
	
	
	var res = $http.get("http://localhost:3000/getcomment?pid=" + article._id);
	res.success(function(data, status, headers, config) {
		if(!data.error) {
			data.forEach(function(v, i) {
				if(v.like.indexOf(user._id) !== -1) {
					v.like_active = true;
				} else {
					v.like_active = false;
				}
				if(v.unlike.indexOf(user._id) !== -1) {
					v.nolike_active = true;
				} else {
					v.nolike_active = false;
				}
			});
			$scope.commentsData = data;
		}
	
	});
	
	$scope.goodArticle = function(){
		if(user._id){
			if($scope.goodActive){
				var type = 'cancelgood';
			}else{
				var type = 'good';
			}
			var pInfo = {
				article:article,
				pid: article._id,
				uid: user._id,
				type:type
			};
			
			$http({
				method: "POST",
				url: "http://localhost:3000/goodarticle",
				data: pInfo
			}).success(function(data, status, headers, config) {
				if(data.success) {	
					$scope.goodActive = !$scope.goodActive;
					if($scope.goodActive) {
						 $scope.article.agood.push(pInfo.uid);
						 $scope.alertInfo.showInfo("success", "文章点赞成功");
					} else {
						$scope.article.agood.splice($scope.article.agood.indexOf(pInfo.uid), 1);
						$scope.alertInfo.showInfo("success", "取消点赞成功");
					}					
				} else {
					$scope.alertInfo.showInfo("error", "文章点赞失败");
				}
			}).error(function(data, status, headers, config) {
				$scope.alertInfo.showInfo("error", "文章点赞失败");
			});
		}else{
			$scope.alertInfo.showInfo("error", "此操作需要登录");
		}
	};
	
	
	$scope.markArticle = function() {
		if(user._id) {
			if($scope.markActive) {
				var type = 'cancelmark';
			} else {
				var type = 'mark';
			}
			var pInfo = {
				article: article,
				pid: article._id,
				uid: user._id,
				type: type
			};
	
			$http({
				method: "POST",
				url: "http://localhost:3000/markarticle",
				data: pInfo
			}).success(function(data, status, headers, config) {
				if(data.success) {
					$scope.markActive = !$scope.markActive;
					if($scope.markActive) {
						$scope.article.amark.push(pInfo.uid);
						$scope.alertInfo.showInfo("success", "文章收藏成功");
					} else {
						$scope.article.amark.splice($scope.article.amark.indexOf(pInfo.uid), 1);
						$scope.alertInfo.showInfo("success", "取消收藏成功");
					}
				} else {
					$scope.alertInfo.showInfo("error", "取消收藏成功");
				}
			}).error(function(data, status, headers, config) {
				$scope.alertInfo.showInfo("error", "取消收藏成功");
			});
		} else {
			$scope.alertInfo.showInfo("error", "此操作需要登录");
		}
	};
});

 app.directive("comments",function($http){
        return {
            restrict:'AEC',
            replace:true,
            templateUrl:'../template/comments.html',
            scope:{
				commentsData:'=commentsAttr',
				alertInfo: '=alertAttr'
			},
			//scope: true,//父元素继承也无法实现双向绑定,必须使用“=”
            link:function(scope, elem, attrs){

				scope.errorshow = false;
				scope.article = article;
				scope.user = user;							
				scope.content  = "";
				
                scope.newComment = function() {

                   if(scope.content.trim().length < 8){
                   		scope.errorshow = true;
                   }else{
                   		scope.errorshow = false;
                   		var new_comment = {
							pid: scope.article._id,
							avatar: scope.user.avatar,
							username: scope.user.username,
							content: scope.content
						};
						
						$http({
							method: "POST",
							url: "http://localhost:3000/newcomment",
							data: new_comment
						}).success(function(data, status, headers, config) {
							if(data.success){
								scope.commentsData.unshift(data.comment);
								scope.alertInfo.showInfo("success" , "添加评论成功");
								scope.content = "";
							}else {
								scope.alertInfo.showInfo("error" , "添加评论失败");
							}
								
						}).error(function(data, status, headers, config) {
							scope.alertInfo.showInfo("error" , "添加评论失败");
						});
                   }
                };
                
                
                	scope.goodHandler = function(comment){
                		if(scope.user._id){
                			var commentInfo = {
                				cid: comment._id,
                				uid: scope.user._id
                			};
                			$http({
                				method: "POST",
                				url: "http://localhost:3000/goodcomment",
                				data: commentInfo
                			}).success(function(data, status, headers, config) {
                				if(data.success) {
                					var index = scope.commentsData.indexOf(comment);
                					comment.like_active = !comment.like_active;
                					
                					if(comment.like_active){
                						comment.like.push(commentInfo.uid);
                						scope.alertInfo.showInfo("success", "点赞成功");
                					}else{
                						comment.like.splice(comment.like.indexOf(commentInfo.uid),1);
                						scope.alertInfo.showInfo("error", "取消点赞成功");
                					}
                					scope.commentsData[index] = comment;
                					
                				} else {
                					if(comment.like_active){
                						scope.alertInfo.showInfo("success", "取消点赞失败");
                					}else{
                						scope.alertInfo.showInfo("error", "点赞失败");
                					}
                				}
                			
                			}).error(function(data, status, headers, config) {
                				if(comment.like_active) {
                					scope.alertInfo.showInfo("success", "取消点赞失败");
                				} else {
                					scope.alertInfo.showInfo("error", "点赞失败");
                				}
                			});
                			console.log(commentInfo);
                		}else{
                			scope.alertInfo.showInfo("error" , "此操作需要登录");
                		}
					
				};
				
				scope.badHandler = function(comment){
                		if(scope.user._id){
                			var commentInfo = {
                				cid: comment._id,
                				uid: scope.user._id
                			};
                			$http({
                				method: "POST",
                				url: "http://localhost:3000/badcomment",
                				data: commentInfo
                			}).success(function(data, status, headers, config) {
                				if(data.success) {
                					var index = scope.commentsData.indexOf(comment);
                					comment.nolike_active = !comment.nolike_active;
                					
                					if(comment.nolike_active){
                						comment.unlike.push(commentInfo.uid);
                						scope.alertInfo.showInfo("success", "踩评论成功");
                					}else{
                						comment.unlike.splice(comment.unlike.indexOf(commentInfo.uid),1);
                						scope.alertInfo.showInfo("error", "取消踩评论成功");
                					}
                					scope.commentsData[index] = comment;
                					
                				} else {
                					if(comment.nolike_active){
                						scope.alertInfo.showInfo("success", "取消踩评论失败");
                					}else{
                						scope.alertInfo.showInfo("error", "踩评论失败");
                					}
                				}
                			
                			}).error(function(data, status, headers, config) {
                				if(comment.nolike_active) {
                					scope.alertInfo.showInfo("success", "取消踩评论失败");
                				} else {
                					scope.alertInfo.showInfo("error", "踩评论失败");
                				}
                			});
                			console.log(commentInfo);
                		}else{
                			scope.alertInfo.showInfo("error" , "此操作需要登录");
                		}
					
				};
				
				scope.deleteComment = function(comment){
					$http({
                				method: "POST",
                				url: "http://localhost:3000/deletecomment",
                				data: comment
                			}).success(function(data, status, headers, config) {
                				if(data.success) {
                					var index = scope.commentsData.indexOf(comment);
                					scope.commentsData.splice(index,1);
                					scope.alertInfo.showInfo("success", "删除评论成功");
                				}else{
                					scope.alertInfo.showInfo("error", "删除评论失败");
                				}
                			}).error(function(data, status, headers, config) {
                				scope.alertInfo.showInfo("error", "删除评论失败");
                			});
				};
				
            }
        }
});


