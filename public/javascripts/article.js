var app = angular.module("articleModule",[]);

app.controller("articleController",function($scope){
	$scope.adate = article.adate;
});

app.controller("commentController",function($scope, $http){  
	$scope.commentsData = [];
	var res = $http.get("http://localhost:3000/getcomment?pid="+ article._id);
	res.success(function(data, status, headers, config) {
		if(!data.error){
			data.forEach(function(v, i) {
				if(v.like.indexOf(user._id) !== -1){
					v.like_active = true; 
				}else{
					v.like_active = false;  
				}
				if(v.unlike.indexOf(user._id) !== -1){
					v.nolike_active = true; 
				}else{
					v.nolike_active = false;  
				}
			});
			$scope.commentsData = data;
		}
		
	});

});

 app.directive("comments",function($timeout,$http){
        return {
            restrict:'AEC',
            replace:true,
            templateUrl:'../template/comments.html',
            scope:{
				commentsData:'=commentsAttr'
			},
			//scope: true,//父元素继承也无法实现双向绑定,必须使用“=”
            link:function(scope, elem, attrs){
				scope.errorshow = false;
				scope.error_message = "";
				scope.info = "";
				scope.errorif = false; 
				scope.successif = false; 
				
				scope.article = article;
				scope.user = user;							
				scope.content  = "";
				
				scope.showInfo  = function(type, info){
					scope.content = info;
					if(type == "success" ){
						scope.successif = true;
						scope.info = info;
						$timeout(function() {
							scope.successif = false;
							scope.info = "";
						}, 2000);
					}else if(type == "error" ){
						scope.errorif = true;
						scope.error_message = info;
						$timeout(function() {
							scope.errorif = false;
							scope.error_message = "";
						}, 2000);
					}
					
				};
				
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
								scope.showInfo("success" , "添加评论成功");
							}else {
								scope.showInfo("error" , "添加评论失败");
							}
								
						}).error(function(data, status, headers, config) {
							scope.showInfo("error" , "添加评论失败");
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
                						scope.showInfo("success", "点赞成功");
                					}else{
                						comment.like.splice(comment.like.indexOf(commentInfo.uid),1);
                						scope.showInfo("error", "取消点赞成功");
                					}
                					scope.commentsData[index] = comment;
                					
                				} else {
                					if(comment.like_active){
                						scope.showInfo("success", "取消点赞失败");
                					}else{
                						scope.showInfo("error", "点赞失败");
                					}
                				}
                			
                			}).error(function(data, status, headers, config) {
                				if(comment.like_active) {
                					scope.showInfo("success", "取消点赞失败");
                				} else {
                					scope.showInfo("error", "点赞失败");
                				}
                			});
                			console.log(commentInfo);
                		}else{
                			scope.showInfo("error" , "此操作需要登录");
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
                						scope.showInfo("success", "踩评论成功");
                					}else{
                						comment.unlike.splice(comment.unlike.indexOf(commentInfo.uid),1);
                						scope.showInfo("error", "取消踩评论成功");
                					}
                					scope.commentsData[index] = comment;
                					
                				} else {
                					if(comment.nolike_active){
                						scope.showInfo("success", "取消踩评论失败");
                					}else{
                						scope.showInfo("error", "踩评论失败");
                					}
                				}
                			
                			}).error(function(data, status, headers, config) {
                				if(comment.nolike_active) {
                					scope.showInfo("success", "取消踩评论失败");
                				} else {
                					scope.showInfo("error", "踩评论失败");
                				}
                			});
                			console.log(commentInfo);
                		}else{
                			scope.showInfo("error" , "此操作需要登录");
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
                					scope.showInfo("success", "删除评论成功");
                				}else{
                					scope.showInfo("error", "删除评论失败");
                				}
                			}).error(function(data, status, headers, config) {
                				scope.showInfo("error", "删除评论失败");
                			});
				};
				
            }
        }
});


