
app.controller("searchArticleController",function($scope){
	$scope.articles = articles;
	$scope.nowPageNum = 1;
	$scope.canGetMore = true;
	$scope.getMoreText = "点击加载更多";

	if(articles.length < 8) {
		$scope.canGetMore = false;
		$scope.getMoreText = "已经没有更多了";
	}
});

 app.directive("sarticles",function($http, $location){
        return {
            restrict:'AEC',
            replace:true,
            templateUrl:'../template/myarticle.html',
            scope:{
				myarticles:'=articlesAttr',
				getMoreText:'=getMoreText',
				canGetMore : '=canGetMore',
				nowPageNum: '=nowPageNum'
			},
			link:function(scope, elem, attrs){
			 	scope.completed = true; 
			 	scope.page_title = page_title;
			
			 	scope.getMore = function() {
			 		if(scope.canGetMore) {
			 			scope.nowPageNum++;
			 			var url = $location.absUrl();
			 			url += "&nowpage=" + scope.nowPageNum + "&asyn=asyn";
			 			var res = $http.get(url);
			 			res.success(function(data, status, headers, config) {
			 				scope.completed = true;
			 				scope.myarticles = scope.myarticles.concat(data);
			 				if(data.length < 8) {
			 					scope.canGetMore = false;
			 					scope.getMoreText = "已经没有更多了";
			 				}
			 			});
			 				
			 			
			 		}
			 	};
			}
            
        };
});


