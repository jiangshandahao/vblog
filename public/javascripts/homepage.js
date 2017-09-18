//获取频道服务
app.factory('homeService', ['$http', function($http) {
	var factoryDefinitions = {
		getArticles: function(type, nowPage, requid) {
			var url = "http://localhost:3000/getarticles?type=" + type ;
			if(requid){
				url += "&requid="+ requid;
			}
			if(nowPage){
				url += "&nowpage=" + nowPage;
			}
			console.log(url);
			var res = $http.get(url);
			res.success(function(data, status, headers, config) {
				if(!data.error) {
					return data;
				}
			});
			return res;
		},
		handleArticles: function(type, pid) {
			var url = "http://localhost:3000/update_article?type="+type+"&pid=" + pid ;		
			var res = $http.post(url);
			res.success(function(data, status, headers, config) {
				if(!data.error) {
					return data;
				}
			});
			return res;
		},
		getUserInfo:function(nowPage,requid){
			var url = "http://localhost:3000/getuserinfo?uid=";
			if(requid) {
				url +=  requid;
			}
			if(nowPage) {
				url += "&nowpage=" + nowPage;
			}
			var res = $http.get(url);
			res.success(function(data, status, headers, config) {
				if(!data.error) {
					return data;
				}
			});
			return res;
		},
		getUserMarks:function(nowPage, requid){
			var url = "http://localhost:3000/usermarks?requid=";
			if(requid) {
				url += requid;
			}
			if(nowPage) {
				url += "&nowpage=" + nowPage;
			}
			console.log(url);
			var res = $http.get(url);
			res.success(function(data, status, headers, config) {
				if(!data.error) {
					return data;
				}
			});
			return res;
		},
		getUserGoods:function(nowPage, requid){
			var url = "http://localhost:3000/usergoods?requid=";
			if(requid) {
				url +=  requid;
			}
			if(nowPage) {
				url += "&nowpage=" + nowPage;
			}
			console.log(url);
			var res = $http.get(url);
			res.success(function(data, status, headers, config) {
				if(!data.error) {
					return data;
				}
			});
			return res;
		}
	};
	return factoryDefinitions;
}]);

app.controller("homeController",function($scope, $http, $timeout, homeService, $uibModal, $log){
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
	
	$scope.open = function() {
		var modalInstance = $uibModal.open({
			animation: 'true',
			templateUrl: 'myModalContent.html',
			controller: 'ModalInstanceController',
			resolve: { //传到模态窗口的对象
				text: function(){
					return $scope.text;
				}
			}
		});
		modalInstance.result.then(function() {
			homeService.handleArticles($scope.type,$scope.pid).then(function(result) {
				if(result.data.success) {
					$scope.alertInfo.showInfo("success", $scope.text + "文章成功");
				} else {
					$scope.alertInfo.showInfo("error", $scope.text + "文章失败");
				}
			});

		}, function() {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.handleArticles = function(type, pid) {
		$scope.pid = pid;
		$scope.type = type;
		switch(type) {
			case 'delete':
				$scope.text = "删除";
				break;
			case 'regret':
				$scope.text = "还原";
				break;
			case 'trashdelete':
				$scope.text = "彻底删除";
				break;
			default:
				$scope.text = "操作";
				break;
		}
		$scope.open();
	};

});
app.controller('ModalInstanceController', function($scope, $uibModalInstance, text) {
	$scope.text = text;
	$scope.ok = function() {
		$uibModalInstance.close();
	};
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
});
//开始配置单页路由
app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/myarticle');

	$stateProvider.state("myarticle", {
		url:"/myarticle",
		templateUrl:"../template/myarticle.html",
		controller:function($scope, $http, homeService){
			$scope.page_title = "文章列表";
			$scope.is_now_user = is_now_user;
			$scope.status = 3;
			$scope.nowPageNum = 1; 
			$scope.canGetMore = true;
			$scope.getMoreText = "点击加载更多";
			homeService.getArticles("drafts",1,$scope.requid).then(function(result) {
				$scope.completed = true;
				$scope.myarticles = result.data;
				if(result.data.length < 8) {
					$scope.canGetMore = false;
					$scope.getMoreText = "已经没有更多了";
				}
			});
			
			$scope.getMore = function(){
				if($scope.canGetMore){
					$scope.nowPageNum++;
					homeService.getArticles("drafts", $scope.nowPageNum, $scope.requid).then(function(result) {
						$scope.completed = true;
						$scope.myarticles = $scope.myarticles.concat(result.data);
						if(result.data.length < 8) {
							$scope.canGetMore = false;
							$scope.getMoreText = "已经没有更多了";
						}
					});
				}
			};
			
		}
	});
	
	$stateProvider.state("mydrafts", {
		url:"/mydrafts",
		templateUrl:"../template/myarticle.html",
		controller:function($scope,$http,homeService){
			$scope.page_title = "草稿箱";
			$scope.is_now_user = is_now_user;
			$scope.status = 1;
			$scope.nowPageNum = 1;
			$scope.canGetMore = true;
			$scope.getMoreText = "点击加载更多";
			homeService.getArticles("drafts").then(function(result) {
				$scope.completed = true;
				$scope.myarticles = result.data;
				if(result.data.length < 8) {
					$scope.canGetMore = false;
					$scope.getMoreText = "已经没有更多了";
				}
			});
			$scope.getMore = function() {
				if($scope.canGetMore) {
					$scope.nowPageNum++;
					homeService.getArticles("drafts",$scope.nowPageNum).then(function(result) {
						$scope.completed = true;
						$scope.myarticles = $scope.myarticles.concat(result.data);
						if(result.data.length < 8) {
							$scope.canGetMore = false;
							$scope.getMoreText = "已经没有更多了";
						}
					});
				}
			};
		}
	});
	
	$stateProvider.state("mychecking", {
		url:"/mychecking",
		templateUrl:"../template/myarticle.html",
		controller:function($scope,$http,homeService){
			$scope.page_title = "待审核文章";
			$scope.is_now_user = is_now_user;
			$scope.status = 2;
			$scope.nowPageNum = 1;
			$scope.canGetMore = true;
			$scope.getMoreText = "点击加载更多";
			homeService.getArticles("checking").then(function(result) {
				$scope.completed = true;
				$scope.myarticles = result.data;
				if(result.data.length < 8) {
					$scope.canGetMore = false;
					$scope.getMoreText = "已经没有更多了";
				}
			});
			$scope.getMore = function(){
				if($scope.canGetMore){
					$scope.nowPageNum++;
					homeService.getArticles("checking", $scope.nowPageNum).then(function(result) {
						$scope.completed = true;
						$scope.myarticles = $scope.myarticles.concat(result.data);
						if(result.data.length < 8) {
							$scope.canGetMore = false;
							$scope.getMoreText = "已经没有更多了";
						}
					});
				}
			};
		}
	});
	
	$stateProvider.state("myfail", {
		url: "/myfail",
		templateUrl: "../template/myarticle.html",
		controller: function($scope, $http,homeService) {
			$scope.page_title = "未通过文章";
			$scope.is_now_user = is_now_user;
			$scope.status = 5;
			$scope.nowPageNum = 1;
			$scope.canGetMore = true;
			$scope.getMoreText = "点击加载更多";
			homeService.getArticles("fail").then(function(result) {
				$scope.completed = true;
				$scope.myarticles = result.data;
				if(result.data.length < 8) {
					$scope.canGetMore = false;
					$scope.getMoreText = "已经没有更多了";
				}
			});
			$scope.getMore = function() {
				if($scope.canGetMore) {
					$scope.nowPageNum++;
					homeService.getArticles("fail", $scope.nowPageNum).then(function(result) {
						$scope.completed = true;
						$scope.myarticles = $scope.myarticles.concat(result.data);
						if(result.data.length < 8) {
							$scope.canGetMore = false;
							$scope.getMoreText = "已经没有更多了";
						}
					});
				}
			};
		}
	});
	
	$stateProvider.state("mytrash", {
		url:"/mytrash",
		templateUrl:"../template/myarticle.html",
		controller:function($scope,$http,homeService){
			$scope.page_title = "回收站";
			$scope.is_now_user = is_now_user;
			$scope.status = 4;
			$scope.nowPageNum = 1;
			$scope.canGetMore = true;
			$scope.getMoreText = "点击加载更多";
			
			homeService.getArticles("trash").then(function(result) {
				$scope.completed = true;
				$scope.myarticles = result.data;
				if(result.data.length < 8) {
					$scope.canGetMore = false;
					$scope.getMoreText = "已经没有更多了";
				}
			});
			$scope.getMore = function() {
				if($scope.canGetMore) {
					$scope.nowPageNum++;
					homeService.getArticles("trash", $scope.nowPageNum).then(function(result) {
						$scope.completed = true;
						$scope.myarticles = $scope.myarticles.concat(result.data);
						if(result.data.length < 8) {
							$scope.canGetMore = false;
							$scope.getMoreText = "已经没有更多了";
						}
					});
				}
			};
		}
	});
	
	$stateProvider.state("marks", {
		url: "/marks",
		templateUrl: "../template/myarticle.html",
		controller: function($scope, $http, homeService) {
			$scope.page_title = "收藏的文章";
			$scope.nowPageNum = 1;
			$scope.canGetMore = true;
			$scope.getMoreText = "点击加载更多";
			homeService.getUserMarks().then(function(result) {
				$scope.completed = true;
				$scope.myarticles = result.data;
				if(result.data.length < 8) {
					$scope.canGetMore = false;
					$scope.getMoreText = "已经没有更多了";
				}
			});
			$scope.getMore = function() {
				if($scope.canGetMore) {
					$scope.nowPageNum++;
					homeService.getUserMarks($scope.nowPageNum).then(function(result) {
						$scope.completed = true;
						$scope.myarticles = $scope.myarticles.concat(result.data);
						if(result.data.length < 8) {
							$scope.canGetMore = false;
							$scope.getMoreText = "已经没有更多了";
						}
					});
				}
			};
		}
	});
	
	$stateProvider.state("goods", {
		url: "/goods",
		templateUrl: "../template/myarticle.html",
		controller: function($scope, $http, homeService) {
			$scope.page_title = "点赞的文章";
			$scope.nowPageNum = 1;
			$scope.canGetMore = true;
			$scope.getMoreText = "点击加载更多";
			homeService.getUserGoods().then(function(result) {
				$scope.completed = true;
				$scope.myarticles = result.data;
				if(result.data.length < 8) {
					$scope.canGetMore = false;
					$scope.getMoreText = "已经没有更多了";
				}
			});
			$scope.getMore = function() {
				if($scope.canGetMore) {
					$scope.nowPageNum++;
					homeService.getUserGoods($scope.nowPageNum).then(function(result) {
						$scope.completed = true;
						$scope.myarticles = $scope.myarticles.concat(result.data);
						if(result.data.length < 8) {
							$scope.canGetMore = false;
							$scope.getMoreText = "已经没有更多了";
						}
					});
				}
			};
		}
	});
	
	$stateProvider.state("idols", {
		url: "/idols",
		templateUrl: "../template/friends.html",
		controller: function($scope, $http, homeService) {
			$scope.page_title = "我的关注";
			$scope.nowPageNum = 1;
			$scope.numPerPage = 8;
			$scope.canGetMore = true;
			$scope.getMoreText = "点击加载更多";
			homeService.getUserInfo().then(function(result) {
				$scope.completed = true;
				$scope.datas = result.data;
				var start = ($scope.nowPageNum - 1) * $scope.numPerPage;
				var pend = start + $scope.numPerPage;
				var end = (pend > result.data.idols.length) ? result.data.idols.length : pend;
				
				var nowData = result.data.idols.slice(start, end);
				
				nowData.forEach(function(v){//遍历每一个关注了的用户对象
					var fOrNot = result.data.followers.some(function(follower){
						return follower._id === v._id;
					});
					v.statusText = fOrNot ? '互相关注': '已关注';
				});
				$scope.myfriends = nowData;
				if(nowData.length < 8) {
					$scope.canGetMore = false;
					$scope.getMoreText = "已经没有更多了";
				}
			});
			$scope.getMore = function() {
				if($scope.canGetMore) {
					$scope.nowPageNum++;
					var start = ($scope.nowPageNum - 1) * $scope.numPerPage;
					var pend = start + $scope.numPerPage;
					var end = (pend > $scope.datas.idols.length) ? $scope.datas.idols.length : pend;
					
					console.log(start, end);
					var nowData = $scope.datas.idols.slice(start, end);
					console.log(nowData);
					nowData.forEach(function(v){//遍历每一个关注了的用户对象
						var fOrNot = $scope.datas.followers.some(function(follower){
							return follower._id === v._id;
						});
						v.statusText = fOrNot ? '互相关注': '已关注';
					});
					$scope.myfriends = $scope.myfriends.concat(nowData);
					if(nowData.length < 8) {
						$scope.canGetMore = false;
						$scope.getMoreText = "已经没有更多了";
					}
				}
			};
		}
	});
	
	$stateProvider.state("followers", {
		url: "/followers",
		templateUrl: "../template/friends.html",
		controller: function($scope, $http, homeService) {
			$scope.page_title = "我的粉丝";
			$scope.nowPageNum = 1;
			$scope.numPerPage = 8;
			$scope.canGetMore = true;
			$scope.getMoreText = "点击加载更多";
			homeService.getUserInfo().then(function(result) {
				$scope.completed = true;
				$scope.datas = result.data;
				var start = ($scope.nowPageNum - 1) * $scope.numPerPage;
				var pend = start + $scope.numPerPage;
				var end = (pend > result.data.followers.length) ? result.data.followers.length : pend;
				
				var nowData = result.data.followers.slice(start, end);
				
				nowData.forEach(function(v){//遍历每一个关注了的用户对象
					var fOrNot = result.data.idols.some(function(idol){
						return idol._id === v._id;
					});
					v.statusText = fOrNot ? '互相关注': '已关注';
				});
				$scope.myfriends = nowData;
				if(nowData.length < 8) {
					$scope.canGetMore = false;
					$scope.getMoreText = "已经没有更多了";
				}
			});
			$scope.getMore = function() {
				if($scope.canGetMore) {
					$scope.nowPageNum++;
					var start = ($scope.nowPageNum - 1) * $scope.numPerPage;
					var pend = start + $scope.numPerPage;
					var end = (pend > $scope.datas.followers.length) ? $scope.datas.followers.length : pend;
					
					console.log(start, end);
					var nowData = $scope.datas.followers.slice(start, end);
					console.log(nowData);
					nowData.forEach(function(v){//遍历每一个关注了的用户对象
						var fOrNot = $scope.datas.idols.some(function(idol){
							return idol._id === v._id;
						});
						v.statusText = fOrNot ? '互相关注': '已关注';
					});
					$scope.myfriends = $scope.myfriends.concat(nowData);
					if(nowData.length < 8) {
						$scope.canGetMore = false;
						$scope.getMoreText = "已经没有更多了";
					}
				}
			};
		}
	});
	
});
