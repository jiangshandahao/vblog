
var homePageModule = angular.module('homePageModule',['ui.router']);
//开始配置单页路由
homePageModule.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/myarticle');
	
	$stateProvider.state("myarticle", {
		url:"/myarticle",
		templateUrl:"../template/myarticle.html",
		controller:function($scope,$http){
			$scope.page_title = "文章列表";
			var res = $http.get("http://localhost:3000/getarticles?type=articles&requid="+$scope.requid);
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
	
});
