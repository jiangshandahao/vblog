var app = angular.module('homePageModule',['ui.router']);

app.controller("homeController",function($scope, $http, $timeout){
	$scope.follow_state_text = "关注";
	$scope.follow_state = 1;
	if(user && !is_now_user ){//如果是访问他人的主页
		
		var res = $http.get("http://localhost:3000/getuserinfo");
		res.success(function(data, status, headers, config) {
			if(!data.error){
				var now_user_idol_active = data.idols.some(function(v) {
					return v._id === req_user._id;
				});
				var page_user_idol_active = data.followers.some(function(v) {
					return v._id === req_user._id;
				});
				if(now_user_idol_active){
					if(page_user_idol_active){
						$scope.follow_state_text = "互相关注";
						$scope.follow_state = 4;
					}else{
						$scope.follow_state_text = "已关注";
						$scope.follow_state = 3;
					}
				}else{
					if(page_user_idol_active) {
						$scope.follow_state_text = "关注";
						$scope.follow_state = 2;
					} else {
						$scope.follow_state_text = "关注";
						$scope.follow_state = 1;
					}
				}
			}else{
				console.log("获取页面用户关注列表失败");
			}
			
		}).error(function(data, status, headers, config) {
			console.log("获取当前用户关注列表失败");
		});
		
	}


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
	
	$scope.follow = function(){
		if(user._id){
			
			if($scope.follow_state  === 1 || $scope.follow_state  === 2){
				var type  = "follow"	;
			}else{
				var type  = "canclefollow"	;
			}
			var uInfo = {
				now_user: user,
				req_user: req_user,
				type:type
			};
		
			$http({
				method: "POST",
				url: "http://localhost:3000/"+ uInfo.type,
				data: uInfo
			}).success(function(data, status, headers, config) {
				if(data.success) {
					if(uInfo.type === 'follow'){
						$scope.alertInfo.showInfo("success", "关注成功");
						if($scope.follow_state == 2){
							$scope.follow_state_text = "互相关注";
							$scope.follow_state = 4;
						}else if($scope.follow_state == 1){
							$scope.follow_state_text = "已关注";
							$scope.follow_state = 3;
						}
						
					}else{
						$scope.alertInfo.showInfo("success", "取消关注成功");
						if($scope.follow_state == 3) {
							$scope.follow_state_text = "关注";
							$scope.follow_state = 1;
						} else if($scope.follow_state == 4) {
							$scope.follow_state_text = "关注";
							$scope.follow_state = 2;
						}
					}
					
				} else {
					if(uInfo.type === 'follow') {
						$scope.alertInfo.showInfo("error", "关注失败");
					}else{
						$scope.alertInfo.showInfo("error", "取消关注失败");
					}
				}
			}).error(function(data, status, headers, config) {
				if(uInfo.type === 'follow') {
					$scope.alertInfo.showInfo("error", "关注失败");
				} else {
					$scope.alertInfo.showInfo("error", "取消关注失败");
				}
			});
			
			
		}else{
			$scope.alertInfo.showInfo("error", "此操作需要登录");
		}
	};
});

//开始配置单页路由
app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/myarticle');

	$stateProvider.state("myarticle", {
		url:"/myarticle",
		templateUrl:"../template/myarticle.html",
		controller:function($scope,$http){
			$scope.page_title = "文章列表";
			var res = $http.get("http://localhost:3000/getarticles?type=drafts&requid="+$scope.requid);
			res.success(function(data, status, headers, config) {
				$scope.completed = true;
				$scope.myarticles = data; 
			}).error(function(data, status, headers, config) {
				console.log("获取文章列表失败");
			});
		}
	});
	
	$stateProvider.state("mydrafts", {
		url:"/mydrafts",
		templateUrl:"../template/myarticle.html",
		controller:function($scope, $http){
			$scope.page_title = "草稿箱";
			var res = $http.get("http://localhost:3000/getarticles?type=drafts");
			res.success(function(data, status, headers, config) {
				$scope.completed = true;
				$scope.myarticles = data; 
			}).error(function(data, status, headers, config) {
				console.log("获取草稿箱列表失败");
			});
		}
	});
	
	$stateProvider.state("mychecking", {
		url:"/mychecking",
		templateUrl:"../template/myarticle.html",
		controller:function($scope,$http){
			$scope.page_title = "待审核文章";
			var res = $http.get("http://localhost:3000/getarticles?type=checking");
			res.success(function(data, status, headers, config) {
				$scope.completed = true;
				$scope.myarticles = data; 
			}).error(function(data, status, headers, config) {
				console.log("获取草稿箱列表失败");
			});
		}
	});
	
	$stateProvider.state("marks", {
		url: "/marks",
		templateUrl: "../template/myarticle.html",
		controller: function($scope, $http) {
			$scope.page_title = "收藏的文章";
			var res = $http.get("http://localhost:3000/usermarks?requid=" + $scope.requid);
			res.success(function(data, status, headers, config) {
				$scope.completed = true;
				$scope.myarticles = data;
			}).error(function(data, status, headers, config) {
				console.log("获取文章列表失败");
			});
		}
	});
	
	$stateProvider.state("goods", {
		url: "/goods",
		templateUrl: "../template/myarticle.html",
		controller: function($scope, $http) {
			$scope.page_title = "收藏的文章";
			var res = $http.get("http://localhost:3000/usergoods?requid=" + $scope.requid);
			res.success(function(data, status, headers, config) {
				$scope.completed = true;
				$scope.myarticles = data;
			}).error(function(data, status, headers, config) {
				console.log("获取文章列表失败");
			});
		}
	});
	
});
