// Viewer OpenSeadragon
var viewer = OpenSeadragon({
	id: "foto",
	prefixUrl: "/js/images/",
	minZoomLevel: 78,
	viewportMargins: {
		left: 0,
		top: 0,
		right: 0,
		bottom: 0
	},
	tileSources: "/iipsrv/iipsrv.fcgi?DeepZoom=lcct.tif.dzi",
	overlays: Object.values(overlays),
	visibilityRatio: 1.0,
	constrainDuringPan: true,
	showNavigator: false,
	navigatorPosition: 'BOTTOM_RIGHT',
	showNavigationControl: false
});

// Bind a note
function bindtooltip(el){
	var tip = $(el);
	// console.log('tip=',tip);
	var laser = $('#lasers');
	console.log('laser=',laser);
	var mask = $('#mask');
	var id = tip.prop('id').replace(/^N(\d+)$/,'P$1','ig');
	// console.log('id='+id);
	var showTip = function(e){
		var bounds = viewer.viewport.getBounds(); 
		// console.log('bounds=',bounds);
		var viewerTopLeft = viewer.viewport.viewportToWindowCoordinates(bounds.getTopLeft());
		// console.log('viewerTopLeft=',viewerTopLeft);
		var viewerBottomRight = viewer.viewport.viewportToWindowCoordinates(bounds.getBottomRight());
		// console.log('viewerBottomRight=',viewerBottomRight);
		var mousex = e.pageX, //Get X coodrinates
			mousey = e.pageY, //Get Y coordinates
			tipWidth = tip.width(), //Find width of tooltip
			tipHeight = tip.height(); //Find height of tooltip

		if ( mousex < (viewerTopLeft.x + viewerBottomRight.x)/2 ) { // left
			// console.log('left');
			var tipVisX = mousex + 20;
		}
		else { // right
			// console.log('right');
			var tipVisX = mousex - tipWidth - 60 > 40 ? mousex - tipWidth - 60 : 40;
		}
		var tipVisY = viewerTopLeft.y + (viewerBottomRight.y - viewerTopLeft.y - tipHeight)/2;
		tip.css({ left: tipVisX, top: tipVisY, position: 'absolute' });
		tip.show(); //Show tooltip
	};
	var showLasers = function(e){
		var bounds = viewer.viewport.getBounds(); 
		// console.log('bounds=',bounds);
		var viewerTopLeft = viewer.viewport.viewportToWindowCoordinates(bounds.getTopLeft());
		// console.log('viewerTopLeft=',viewerTopLeft);
		var viewerBottomRight = viewer.viewport.viewportToWindowCoordinates(bounds.getBottomRight());
		// console.log('viewerBottomRight=',viewerBottomRight);
		var mousex = e.pageX, //Get X coodrinates
			mousey = e.pageY; //Get Y coordinates

		var lasersX = mousex - ( viewerBottomRight.x - viewerTopLeft.x ) + laser1_delta_x;
		console.log('lasersX=',lasersX);
		var lasersY = mousey - ( viewerBottomRight.y - viewerTopLeft.y ) + laser1_delta_y;
		console.log('lasersY=',lasersY);
		laser.css({left: lasersX, top: lasersY, width: ( viewerBottomRight.x - viewerTopLeft.x )*2, height: ( viewerBottomRight.y - viewerTopLeft.y )*2, position: 'absolute' });
		laser.show();
	};
	console.log('is touch: '+window.matchMedia("(pointer: coarse)").matches);
	if (window.matchMedia("(pointer: coarse)").matches){
		$("#"+id).on('click', function(e) {
			if( tip.filter(':visible').length > 0 ){
				tip.hide(); //Hide tooltip
				laser.hide();
				mask.hide();
			}
			else {
				mask.show();
				showLasers(e); //Show lasers
				showTip(e); //Show tooltip
			}
		});
	}
	else {
		$("#"+id).hover(function(e){
			mask.show();
			showLasers(e);
			showTip(e);
		}, function() {
			tip.hide(); //Hide tooltip
			laser.hide();
			mask.hide();
		});
	}
};

viewer.addHandler('animate', function(event) {
	// The canvas-click event gives us a position in web coordinates.
	var webPoint = event.position;

	// Convert that to viewport coordinates, the lingua franca of OpenSeadragon coordinates.
	var viewportPoint = viewer.viewport.pointFromPixel(webPoint);

	// Convert from viewport coordinates to image coordinates.
	var imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);

	// Show the results.
	console.log('web=',webPoint.toString(),'viewport=', viewportPoint.toString(), 'image=',imagePoint.toString());
});

// focus on a note
function goToNote(note){
	// Starting point
	var oldBounds = viewer.viewport.getBounds();  //FIXME: posición no depende
	console.log('oldBounds=',oldBounds);
	var X = overlays[note].x < oldBounds.width ? 0 : overlays[note].x > lcct_width - oldBounds.width ?lcct_width - oldBounds.width : overlays[note].x-oldBounds.width/2;
	var newBounds = new OpenSeadragon.Rect(X, oldBounds.y, oldBounds.width, oldBounds.height,0); 
	console.log('newBounds=',newBounds);
	viewer.viewport.fitBoundsWithConstraints(newBounds, true);
}

// inicio del viewer
viewer.addHandler('open', function(event) {
	// fit vertically
	viewer.viewport.fitVertically();
	// Bind notes
	$('.lcct-note').each(function(i,el){
		bindtooltip(el);
	});
	// Posicionamiento en nota
	var fragment = document.location.hash;
	console.log('fragment=',fragment);
	if ( fragment.match(/^\#N\d\d/g) && fragment >= '#N01' && fragment <= '#N37' ){
		console.log('fragment is a valid point');
		goToNote(fragment.replace(/^\#(N\d\d)$/,'$1'));
	}
	else {
		// Starting point
		var oldBounds = viewer.viewport.getBounds(); // FIXME: arreglar el zoom para diferentes dispositivos 
		console.log('oldBounds=',oldBounds);
		var newBounds = new OpenSeadragon.Rect(0, oldBounds.y, oldBounds.width, oldBounds.height,0); 
		console.log('newBounds=',newBounds);
		viewer.viewport.fitBoundsWithConstraints(newBounds, true);
	}
});

$(document).ready(function(){
	// bind menú button
	$('#button').on('click',function(e){
		$('#menu').toggle("fast",function(){console.log("menu click")});
		return false;
	});
	// access and exit from each section
	$('.lightbox').each(function(idx,el){
		var id = el.id;
		console.log('id=',id);
		$('#menu a[href="#'+id+'"]').on('click',function(e){
			console.log('click ',id);
			$('#menu').hide("fast",function(){console.log("esconde menu")});
			$('#'+id).show("fast",function(){console.log("activa ",id)});
			$('#mask').show("fast",function(){console.log("activa máscara")});
		});
		$('#'+id+' nav button').on('click',function(e){
			console.log('click cierra ',id);
			$('#mask').hide("fast",function(){console.log("desactiva máscara")});
			$('#'+id).hide("fast",function(){console.log("desactiva ",id)});
			document.location.hash='';
		});
	});
	// bind notes access
	$('a.lcct-link').on('click',function(e){
		console.log('click ',e);
		var fragment = e.target.hash;
		console.log('fragment=',fragment);
		// fit vertically
		viewer.viewport.fitVertically();
		goToNote(fragment.replace(/^\#(N\d+)$/,'$1'));
		$('#mask').hide("fast",function(){console.log("desactiva máscara")});
		$('#notas').hide("fast",function(){console.log("desactiva notas")});
	});
	// Posicionamiento en sección
	var fragment = document.location.hash;
	console.log('fragment=',fragment);
	if ( $(''+fragment+'.lightbox').length > 0 ){
		$('#menu a[href="'+fragment+'"]').trigger('click');
	}
});
