var map = L.map('map').setView([17.04, 100.50], 8);
var osm1 = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
var osm2 = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');

var DisabledLayers = L.Control.Layers.extend({
    onAdd: function(map) {
        this._map = map;
        map.on('zoomend', this._update, this);
        return L.Control.Layers.prototype.onAdd.call(this, map);
    },
    
    onRemove: function(map) {
        map.off('zoomend', this._update, this);
        L.Control.Layers.prototype.onRemove.call(this, map);
    },
    
    _addItem: function(obj){
        var item = L.Control.Layers.prototype._addItem.call(this, obj);
        
        // implement your logic here
        // in this example layers are disabled below zoom 12
        if (this._map.getZoom() < 12) {
            $(item).find('input').prop('disabled', true);
        }
        
        return item;
    }
})

var disabledLayers = new DisabledLayers({osm1: osm1, osm2: osm2}, null, {collapsed: false});
disabledLayers.addTo(map);