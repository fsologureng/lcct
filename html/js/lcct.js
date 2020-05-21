// Viewer OpenSeadragon
var viewer = OpenSeadragon({
	id: "foto",
	prefixUrl: "/js/images/",
	defaultZoomLevel: 79,
	viewportMargins: {
		left: 0,
		top: 0,
		right: 0,
		bottom: 0
	},
	tileSources: "/iipsrv/iipsrv.fcgi?DeepZoom=lcct.tif.dzi",
	overlays: Object.values(overlays),
	showNavigator: false,
	navigatorPosition: 'BOTTOM_RIGHT',
	showNavigationControl: false
});

// Bind a note
function bindtooltip(el){
	var tip = $(el);
	console.log('tip=',tip);
	var id = tip.prop('id').replace(/^N(\d+)$/,'P$1','ig');
	console.log('id='+id);
	$("#"+id).hover(function(e){
		var bounds = viewer.viewport.getBounds(); 
		console.log('bounds=',bounds);
		var viewerTopLeft = viewer.viewport.viewportToWindowCoordinates(bounds.getTopLeft());
		console.log('viewerTopLeft=',viewerTopLeft);
		var viewerBottomRight = viewer.viewport.viewportToWindowCoordinates(bounds.getBottomRight());
		console.log('viewerBottomRight=',viewerBottomRight);
		var mousex = e.pageX, //Get X coodrinates
			mousey = e.pageY, //Get Y coordinates
			tipWidth = tip.width(), //Find width of tooltip
			tipHeight = tip.height(); //Find height of tooltip

		if ( mousex < (viewerTopLeft.x + viewerBottomRight.x)/2 ) { // left
			console.log('left');
			var tipVisX = mousex + 20;
		}
		else { // right
			console.log('right');
			var tipVisX = mousex - tipWidth - 60;
		}
		var tipVisY = viewerTopLeft.y + (viewerBottomRight.y - viewerTopLeft.y - tipHeight)/2;

		/*
		if ( tipVisX < 20 ) { //If tooltip exceeds the X coordinate of viewport
			// mousex = e.pageX - tipWidth - 20;
			mousex = e.pageX - tipWidth/2;
		} if ( tipVisY < 20 ) { //If tooltip exceeds the Y coordinate of viewport
			// mousey = e.pageY - tipHeight - 20;
			mousey = e.pageY + 20;
		}
		*/
		tip.css({ left: tipVisX, top: tipVisY, position: 'absolute' });
		tip.show(); //Show tooltip
	}, function() {
		tip.hide(); //Hide tooltip
	});
};

viewer.addHandler('canvas-scroll', function(event) {
	// The canvas-click event gives us a position in web coordinates.
	var webPoint = event.position;

	// Convert that to viewport coordinates, the lingua franca of OpenSeadragon coordinates.
	var viewportPoint = viewer.viewport.pointFromPixel(webPoint);

	// Convert from viewport coordinates to image coordinates.
	var imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);

	// Show the results.
	console.log('web=',webPoint.toString(),'viewport=', viewportPoint.toString(), 'image=',imagePoint.toString());
});
viewer.addHandler('open', function(event) {
	// Bind notes
	$('.lcct-note').each(function(i,el){
		bindtooltip(el);
	});
	// Starting point
	var oldBounds = viewer.viewport.getBounds(); 
	console.log('oldBounds=',oldBounds);
	var fragment = document.location.hash;
	console.log('fragment=',fragment);
	var n_point = Number(fragment.replace(/^\#N(\d+)$/,'$1'));
	console.log('n_point=',n_point);
	if ( !Number.isNaN(n_point) && n_point> 0 && n_point < 38 ){
		console.log('fragment is a valid point');
		var X = overlays['N'+n_point].x < oldBounds.width ? 0 : overlays['N'+n_point].x > lcct_width - oldBounds.width ?lcct_width - oldBounds.width : overlays['N'+n_point].x-oldBounds.width/2;
		var newBounds = new OpenSeadragon.Rect(X, oldBounds.y, oldBounds.width, oldBounds.height,0); 
		console.log('newBounds=',newBounds);
		viewer.viewport.fitBounds(newBounds, true);
	}
	else {
		var newBounds = new OpenSeadragon.Rect(0, oldBounds.y, oldBounds.width, oldBounds.height,0); 
		console.log('newBounds=',newBounds);
		viewer.viewport.fitBounds(newBounds, true);
	}
});

$(document).ready(function(){
	// bind menú button
	$('#button').on('click',function(e){
		$('#menu').fadeToggle("fast",function(){console.log("menu click")});
		return false;
	});
	$('#menu a[href="#comenta"]').on('click',function(e){
		console.log('click comenta');
		$('#menu').fadeToggle("fast",function(){console.log("esconde menu")});
		$('#comenta').fadeIn("fast",function(){console.log("activa comenta")});
		$('#mask').fadeIn("fast",function(){console.log("activa máscara")});
	});
	$('#comenta nav button').on('click',function(e){
		console.log('click cierra comenta');
		$('#mask').fadeOut("fast",function(){console.log("desactiva máscara")});
		$('#comenta').fadeOut("fast",function(){console.log("desactiva comenta")});
		document.location.hash='';
	});
});
