angular.module('mekanbul', ['ionic', 'models', 'controllers', 'leaflet-directive', 'ngCordova']) // Leaflet ve ngCordova direktiflerini ekledik

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
    .state('app.harita', {
      url: "/harita",
      views: {
        'menuContent' :{
          templateUrl: "templates/harita.html",
          controller: 'HaritaCtrl'
        }
      }
    })
   .state('app.liste', {
      url: "/liste",
      views: {
        'menuContent' :{
          templateUrl: "templates/liste.html",
          controller: 'ListeCtrl'
        }
      }
    })
    .state('app.mekan', {
      url: "/mekan/:mekanId", //liste veya haritadan gönderilecek mekanId parametresine göre mekan gösterilecek
      views: {
        'menuContent' :{
          templateUrl: "templates/mekan.html",
          controller: 'MekanCtrl'
        }
      }
    });
  $urlRouterProvider.otherwise('/app/harita'); //uygulama başladığında veya olmayan bir sayfa çağrıldığında harita sayfasına yönlendirir
});

