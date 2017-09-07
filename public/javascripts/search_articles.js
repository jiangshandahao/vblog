
app.controller("searchArticleController",function($scope){
	$scope.articles = articles;
});

 app.directive("sarticles",function($http){
        return {
            restrict:'AEC',
            replace:true,
            templateUrl:'../template/myarticle.html',
            scope:{
				myarticles:'=articlesAttr'
			},
			link:function(scope, elem, attrs){
			 	scope.completed = true; 
			 	scope.page_title = page_title;
			}
            
        };
});


