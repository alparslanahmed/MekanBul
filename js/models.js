angular.module('models', [])
    .factory('MekanTara', function($http) {
        var client_id = 'CLIENT_ID';
        var client_secret = 'CLIENT_SECRET';
        return {
            get: function(konum, callback) {

                var mm = [];

                //Verileri foursquare'den çek
                $http({
                        method: 'GET',
                        url: 'https://api.foursquare.com/v2/venues/explore?client_id='+ client_id +'&client_secret='+ client_secret +'&v=20130815&ll='+konum
                    })
                    .success(function(data) {

                        //Mekan bilgilerini leaflet marker için düzenle
                        var mekanlar_f = data.response.groups[0].items;

                        for (i = 0; i < mekanlar_f.length; i++) {
                            var marker = mekanlar_f[i];
                            mm.push({
                                lat: marker.venue.location.lat,
                                lng: marker.venue.location.lng,
                                isim: marker.venue.name,
                                id: marker.venue.id,
                                here: marker.venue.hereNow.summary,
                                users: marker.venue.stats.usersCount,
                                title: i+1
                            });
                        }
                        callback(mm);
                    })
                    .error(function() {
                      
                        alert("Foursquare sunucusuna bağlanırken hata oluştu.");
                    
                    });
            },

            foto: function(id, callback){
                var ff = [];
                //id Mekanının fotoğraflarını foursquare'den çek
                $http({
                        method: 'GET',
                        url: 'https://api.foursquare.com/v2/venues/'+ id +'/photos?client_id='+ client_id +'&client_secret='+ client_secret +'&v=20130815'
                    })
                    .success(function(data) {
                        var fotolar = data.response.photos.items;
                        for(i=0; i < fotolar.length; i++)
                        {
                            ff.push({
                                url: fotolar[i].prefix + '600x600' + fotolar[i].suffix,
                                kullanici: fotolar[i].user.firstName,
                                kullanici_foto: fotolar[i].user.photo.prefix + '100x100' + fotolar[i].user.photo.suffix + '?client_id='+ client_id +'&client_secret='+ client_secret +'&v=20130815'
                            })

                        }
                        callback(ff);
                    })
                    .error(function() {
                      
                        alert("Foursquare sunucusuna bağlanırken hata oluştu.");
                    
                    });
            }
        }
    });