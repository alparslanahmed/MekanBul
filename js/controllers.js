angular.module('controllers', [])

.controller('AppCtrl', function($scope, $timeout, MekanTara, $cordovaGeolocation) {

    $scope.igneler = [
        {
            lat:40,
            lng:28,
            // ayırt etmek için farklı icon kullanıyoruz
            icon: {
                iconUrl: "img/isaretci.png",
                iconSize: [26,26],
                iconAnchor: [13,13],
                shadowUrl: "img/golge.png"
            }
        }
    ];

    // Ağ tabanlı konum (Çabuk Tanımlama İçin)
    $cordovaGeolocation.getCurrentPosition().then(function(position) {
        $scope.igneler[0].lat = position.coords.latitude; 
        $scope.igneler[0].lng = position.coords.longitude;
        $scope.konum = position.coords.latitude + ',' + position.coords.longitude;
        $scope.MekanKontrol();
    }, function(err) {
        alert(err);
    });

    // Uydu Tabanlı Konum
  var watch = $cordovaGeolocation.watchPosition({
    frequency: 1000,timeout: 10000, enableHighAccuracy: true
  });

  watch.promise.then(function() {
    }, function(err) {
        alert(err);
    }, function(position) {
        $scope.igneler[0].lat = position.coords.latitude; 
        $scope.igneler[0].lng = position.coords.longitude;
        $scope.konum = position.coords.latitude + ',' + position.coords.longitude;
  });

    // Mekanları Konuma Göre Çek Ardından 30 Saniyede Bir Konuma Göre Tekrar Çek
     $scope.MekanKontrol = function() {
        MekanTara.get($scope.konum,function(data){
            var tut = $scope.igneler.shift();  // Konum İşaretçisini Tut
            $scope.igneler = data;   // Mekanları Ekle
            $scope.igneler.unshift(tut); // Konum İşaretçisini Geri Getir
        });
        $timeout($scope.MekanKontrol, 30000);
    };
})

.controller('HaritaCtrl', function($scope, $location) {

        //leaflet harita ayarları
        $scope.map = {
        defaults: {
            //haritayı alacağımız sunucu
            tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            maxZoom: 18,
            zoomControlPosition: 'bottomleft'
        },
        //haritanın merkezi
        center: {
            lat: 40,
            lng: 29,
            zoom: 12
        }
    };

    $scope.benibul = function(){ 
        $scope.map.center.lat = $scope.igneler[0].lat;;
        $scope.map.center.lng = $scope.igneler[0].lng;;
        $scope.map.center.zoom = 18;
    }

    $scope.benibul();
    
    $scope.$on('leafletDirectiveMarker.mousedown', function(event, args){
        var markerEvent = args.leafletEvent;
        id = markerEvent.target.options.title;
        $location.path( "/app/mekan/"+id+"" );
    });
    
})

.controller('ListeCtrl', function($scope, $location) {
    $scope.git = function(id)
    {
        $location.path( "/app/mekan/"+id+"" );
    }
})

.controller('MekanCtrl', function($scope, $stateParams, MekanTara, $ionicLoading) {
    $ionicLoading.show({
      template: 'Yükleniyor...'
    });
    $scope.mekan = $scope.igneler[$stateParams.mekanId];

        MekanTara.foto($scope.mekan.id,function(data){
            $scope.mekan.fotolar = data;
            $ionicLoading.hide();
    });

});
