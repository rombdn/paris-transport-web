var Module = function() {
    this.x = 10;
    this.damap = L.map('map').setView([48.85293755, 2.35005223818182], 12);
    this.tileLayer = L.tileLayer(
        //'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',
        //'http://a.tile.openstreetmap.org/$%7Bz%7D/$%7Bx%7D/$%7By%7D.png',
        'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        {
            attribution: '&copy; OpenStreetMap'
        }
    );
    this.damap.addLayer(this.tileLayer); 
    //this.getX = this.getX.bind(this);
};

Module.prototype = {
    getX: function() { console.log(this.x); },
    showMapForPath: function(graph, path) { console.log(this); }
};



var RATPMap = function() {
    this.damap = L.map('map').setView([48.85293755, 2.35005223818182], 12);

    this.tileLayer = L.tileLayer(
        //'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',
        //'http://a.tile.openstreetmap.org/$%7Bz%7D/$%7Bx%7D/$%7By%7D.png',
        'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        {
            attribution: '&copy; OpenStreetMap'
        }
    );

    this.damap.addLayer(this.tileLayer);
    //this.showMapForPath = function() { console.log(this); };
    this.showMapForPath = this.showMapForPath.bind(this);
    console.log(this.damap);
    console.log(this);
};

RATPMap.prototype = {
    showMapForPath: function(graph, path) {
        var last_node = null;
        var marker = null;
        var content = null;
        var msg = '';

        path.forEach( function(node, index) {
            var node_loc = graph[node.node_id].loc;
            
            if(index == 0) {
                marker = L.marker(node_loc).addTo(this.damap);
                content = 'Line: ' + node.line + ', Type: ' + node.type + ', ';
                content += graph[node.node_id].name;
                marker.bindPopup(content);
            }

            
            //var last_node_loc   = graph[last_node.node_id].loc;

            //var marker = L.marker(node_loc).addTo(this.damap);

            if(last_node) {
                var last_node_loc = graph[last_node.node_id].loc;
                var color = 'red';

                if(last_node.type == 1 || last_node.type == 2) color = 'blue';
                if(last_node.type == 3) color = 'green';

                var line = L.polyline([last_node_loc, node_loc], {
                    color: color,
                    weight: 4,
                    opacity: 0.7,
                    smoothFactor: 1
                }).addTo(this.damap);
            }

            if(last_node) {

                if( index == 1 ) {
                    msg += 'Line ' + last_node.line + ', ' + graph[last_node.node_id].name + ' (' + last_node.line +  ', ' +  last_node.type +  ')';
                }
                /*if( (last_node.line != node.line ) || 
                    ( ( last_node.type != node.type ) )
                )*/
                
                if(
                    (
                        last_node.type != node.type && 
                        (
                            !((last_node.type == 1 && node.type == 2) ||
                            (last_node.type == 2 && node.type == 1))
                        )
                    )
                    ||
                    (
                        last_node.line != node.line &&
                        node.type != 4
                    )

                ) {
                    //msg += 'Last (' + graph[last_node.node_id].name + ', ' + last_node.line +  ', ' +  last_node.type +  ')<br>';
                    msg += ' => ' + graph[node.node_id].name + ' (' + node.line +  ', ' +  node.type +  ')<br>';
                    
                    marker = null;

                    if( last_node.type != 4 ) {
                        //end of line marker
                        marker = L.marker(node_loc).addTo(this.damap);
                        content = 'Line: ' + last_node.line + ', Type: ' + last_node.type + ', ';
                        content += graph[node.node_id].name;
                        marker.bindPopup(content);
                    }

                    if(node.line != -1) {
                        if( node.type != 4 ) {
                            msg += 'Line ' + node.line;
                            
                            if(marker) { 
                                marker = L.marker(node_loc).addTo(this.damap);
                                content += '<br>Correspondance<br>Line: ' + node.line + ', Type: ' + node.type + ', ';
                                content += graph[node.node_id].name;
                                marker.bindPopup(content);
                            }
                            else {
                                marker = L.marker(node_loc).addTo(this.damap);
                                content = 'Line: ' + node.line + ', Type: ' + node.type + ', ';
                                content += graph[node.node_id].name;
                                marker.bindPopup(content);
                            }
                        }
                        else
                            msg += 'A pieds';

                        msg += ', ' + graph[node.node_id].name + ' (' + node.line +  ', ' +  node.type +  ')';
                    }
                    /*
                    console.log(' => ', graph[last_node.node_id].name, 
                            ' (', last_node.line, ', ', last_node.type, '), ');*/
                }
/*
                console.log(graph[node.node_id].name, 
                    ' (', node.line, ', ', node.type, '), ');*/

/*
                if( last_node.line != node.line ) {
                    console.log(' => ', graph[node.node_id].name, 
                            ' (', node.line, ', ', node.type, '), ');
                }         */       

                /*
                        ' => ', graph[node.node_id].name,
                        ' (', node.line, ', ', node.type, ')');*/                   
                
            }
            

            //disp += graph[node.node_id].name
            /*
            if(last_node)
                disp += 'Last: ' + graph[last_node.node_id].name + ' (' + last_node.node_id + '), Line: ' + last_node.line + ', Type: ' + last_node.type + '<br>';

            disp += 'Current: ' + graph[node.node_id].name + ' (' + node.node_id + '), Line: ' + node.line + ', Type: ' + node.type + '<br><br>';
            */

/*    
            if(last_node && 
                ( (last_node.line != node.line && last_node.type != 4)
                    || (last_node.type != node.type 
                        && (last_node.type != 2 && node.type != 2) 
                        )
                ) 
              )
            {
                if(last_node.type != 4) {
                    marker = L.marker(node_loc).addTo(this.damap);
                    content = 'Line: ' + last_node.line + ', Type: ' + last_node.type + ', ';
                    content += graph[node.node_id].name;
                    marker.bindPopup(content);
                }

                marker = L.marker(node_loc).addTo(this.damap);
                content = 'Line: ' + node.line + ', Type: ' + node.type + ', ';
                content += graph[node.node_id].name;
                marker.bindPopup(content);
                                
                disp += ' => ' + graph[node.node_id].name + '<br>';
                if(last_node.type) {
                    disp += 'Correspondance: ';
                    disp += last_node.type + '<br>';
                }

                if(node.type != 4) disp += 'Line: ' + node.line + ', Type: ' + node.type;
                if(node.type == 4) disp += 'A pieds';
                
                disp += ', ' + graph[node.node_id].name;

            }*/
    
            last_node = node;
        }, this);
        
        print(msg);
    }
};
