/*! angular-csv-import - v0.0.15 - 2015-04-08
* Copyright (c) 2015 ; Licensed  */
'use strict';

var csvImport = angular.module('ngCsvImport', []);

csvImport.directive('ngCsvImport', function() {
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope:{
			content:'=',
			header: '=',
			headerVisible: '=',
			separator: '=',
			result: '='
		},
		template: '<div><div ng-show="header && headerVisible"><div class="label">Header</div><input type="checkbox" ng-model="header"></div>'+
			'<div ng-hide="separator" ><div class="label">Seperator</div><input type="text" ng-change="changeSeparator" ng-model="separator"></div>'+
			'<div>Please upload your CSV file here..... <div class="space"></div><input data-ui-file-upload class="btn-primary" title="Choose File" type="file" accept=".csv"/></div></div>',
		link: function(scope, element) {
			element.on('keyup', function(e){
				//console.log(scope.content);										 
				if ( scope.content != null ) {
					var content = {
						csv: scope.content,
						header: scope.header,
						separator: e.target.value
					};
					scope.result = csvToJSON(content);
					scope.$apply();
				}
			});

			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();
				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						var content = {
							csv: onLoadEvent.target.result.replace(/\r\n|\r/g,'\n'),
							header: scope.header,
							separator: scope.separator
						};

						scope.content = content.csv;
						scope.result = csvToJSON(content);
					});
				};
				if ( (onChangeEvent.target.type === "file") && (onChangeEvent.target.files != null || onChangeEvent.srcElement.files != null) )  {
					reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
				} else {
					if ( scope.content != null ) {
						var content = {
							csv: scope.content,
							header: !scope.header,
							separator: scope.separator
						};
						scope.result = csvToJSON(content);
					}
				}
			});

			var csvToJSON = function(content) {
				var lines=content.csv.split('\n');
				var result = [];
				var start = 0;
				var columnCount = lines[0].split(content.separator).length;

				var headers = [];
				if (content.header) {
					headers=lines[0].split(content.separator);
					start = 1;
				}

				for (var i=start; i<lines.length; i++) {
					var obj = {};
					var currentline=lines[i].split(new RegExp(content.separator+'(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));
					if ( currentline.length === columnCount ) {
						if (content.header) {
							for (var j=0; j<headers.length; j++) {
								obj[headers[j]] = currentline[j];
							}
						} else {
							for (var k=0; k<currentline.length; k++) {
								obj[k] = currentline[k];
							}
						}
						result.push(obj);
					}
				}
				return result;
			};
		}
	};
});
