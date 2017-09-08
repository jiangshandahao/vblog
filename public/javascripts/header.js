
function checkinput(){
	var input = $("#search-input").val();
	if(input ==  null || input == ''){
		return false;
	}
        return true;
}
var app = angular.module("rootModule",['ui.router']);

app.filter("toTimeDiff",function(){
        return function(inputTime){
	        	var now = new Date(),
	        		hisTime = Date.parse(inputTime),
	        		diffValue = now - hisTime,
	        		result = '',
	        		minute = 1000 * 60,
	        		hour = minute * 60,
	        		day = hour * 24,
	        		halfamonth = day * 15,
	        		month = day * 30,
	        		year = month * 12,
	        	
	        		_year = diffValue / year,
	        		_month = diffValue / month,
	        		_week = diffValue / (7 * day),
	        		_day = diffValue / day,
	        		_hour = diffValue / hour,
	        		_min = diffValue / minute;
	        	if(_year >= 1) result = parseInt(_year) + "年前";
	        	else if(_month >= 1) result = parseInt(_month) + "个月前";
	        	else if(_week >= 1) result = parseInt(_week) + "周前";
	        	else if(_day >= 1) result = parseInt(_day) + "天前";
	        	else if(_hour >= 1) result = parseInt(_hour) + "个小时前";
	        	else if(_min >= 1) result = parseInt(_min) + "分钟前";
	        	else result = "刚刚";
	        	return result;
        };
 });
 
 //Factories
 app.factory('channelServices', ['$http', function($http) {
 	var factoryDefinitions = {
 		getChannels: function() {
 			var res = $http.get("http://localhost:3000/getchannels?showtype=header");		
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
 
 
app.controller("headerController",function($scope, $http, channelServices){
	$scope.modalOpen = false;
	$scope.channelsData = [];
	
	channelServices.getChannels().then(function(result) {
		if(!result.error) {
			$scope.channelsData = result.data;
		}
	});
	
	$scope.searchContent = function(){
		$scope.modalOpen = !$scope.modalOpen;
	};
});


app.directive("searchbox", function($http) {
	return {
		restrict: 'AEC',
		replace: true,
		templateUrl:"../template/search.html",
		scope:{
			modalOpen:'=modalOpen'
		},
		//scope: true,//父元素继承也无法实现双向绑定,必须使用“=”
        link:function(scope, elem, attrs){
        		scope.closeBox = function(){
        			scope.modalOpen =  false;
        		};
        }

	};
});