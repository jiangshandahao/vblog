var app = angular.module('homePageModule',['ui.router']);

app.controller("homeController",function($scope, $http, $timeout){
	
//	var res = $http.get("http://localhost:3000/getuserinfo");
//	res.success(function(data, status, headers, config) {
//		$scope.now_user_info = data;
//		console.log(data);
//	}).error(function(data, status, headers, config) {
//		console.log("获取当前用户详细信息失败");
//	});
//	
//	if(!is_now_user){//如果是访问他人的主页
//		
//	}
//	
	$scope.follow_state = "关注";
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
			var uInfo = {
				now_user: user,
				req_user: req_user,
				type:'follow'
			};
		
			$http({
				method: "POST",
				url: "http://localhost:3000/follow",
				data: uInfo
			}).success(function(data, status, headers, config) {
				if(data.success) {
					
					$scope.alertInfo.showInfo("success", "关注成功");
					
				} else {
					$scope.alertInfo.showInfo("error", "关注失败");
				}
			}).error(function(data, status, headers, config) {
				$scope.alertInfo.showInfo("error", "关注失败");
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
				console.log($scope.follow_state);
			}).error(function(data, status, headers, config) {
				console.log("获取文章列表失败");
			});
		}
	});
	
	$stateProvider.state("mydrafts", {
		url:"/mydrafts",
		templateUrl:"../template/myarticle.html",
		controller:function($scope,$http){
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
