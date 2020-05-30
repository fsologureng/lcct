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
	showNavigator: true,
	navigatorId: 'navigator',
	navigatorMaintainSizeRatio: true,
	navigatorAutoResize: true,
	navigatorAutoFade: false,
	navigatorDisplayRegionColor: '#14FF64',
	showNavigationControl: true,
	navigationControlAnchor: 'BOTTOM_RIGHT'
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

		var tipVisX,
			tipVisY,
			x_pan = ( viewerBottomRight.x - mousex )/( mousex - viewerTopLeft.x),
			y_pan = ( viewerBottomRight.y - mousey )/( mousey - viewerTopLeft.y);
		console.log('x_pan=',x_pan,' y_pan=',y_pan);
		if ( x_pan > 1.5 ) { // left
			console.log('mouse on left');
			tipVisX = mousex + (viewerBottomRight.x - mousex - tipWidth)*0.5;
			tipVisY = (viewerBottomRight.y - tipHeight)/2;
		}
		else if ( x_pan < 0.66666666 ) { // right
			console.log('mouse on right');
			tipVisX = (mousex - tipWidth)/2;
			tipVisY = (viewerBottomRight.y - tipHeight)/2;
		}
		else { // horizontal center
			console.log('on horizontal center');
			if ( y_pan > 1.5 ) { // top 
				console.log('mouse on top');
				tipVisX = (viewerBottomRight.x - tipWidth)/2;
				tipVisY = mousey + (viewerBottomRight.y - mousey - tipHeight)/2;
			}
			else if ( y_pan < 0.66666666 ) { // bottom
				console.log('mouse on bottom');
				tipVisX = (viewerBottomRight.x - tipWidth)/2;
				tipVisY = (mousey - tipHeight)/2;
			}
			else { // vertical center
				console.log('on vertical center');
				if ( x_pan > 1 ) { // center left
					console.log('mouse on left');
					tipVisX = viewerTopLeft.x + (viewerBottomRight.x - viewerTopLeft.x)*0.55;
				}
				else { // center right
					console.log('mouse on right');
					tipVisX = (viewerBottomRight.x - viewerTopLeft.x)/9;
				}
				if ( y_pan > 1 ) { // center top
					console.log('mouse on top');
					tipVisY = mousey + (viewerTopLeft.y - mousey - tipHeight)/2;
				}
				else { // center bottom
					console.log('mouse on bottom');
					tipVisY = (mousey - tipHeight)/2;
				}
			}
		}
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

		var lasersX = mousex - 2500/2 + laser1_delta_x;
		console.log('lasersX=',lasersX);
		var lasersY = mousey - 2130/2 + laser1_delta_y;
		console.log('lasersY=',lasersY);
		laser.css({left: lasersX, top: lasersY, width: 2500, height: 2130, position: 'absolute' });
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

// send email
function sendMail(){
	var subject = encodeURIComponent('Mensaje desde LCCT');
	var body = encodeURIComponent(document.forms.feedback.message.value);
	window.open("mailto:laciudadcomotexto2019@gmail.com?subject="+subject+"&body="+body,"_blank");
	return false;
}

viewer.addHandler('canvas-drag-end', function(event) {
	$('div.reduced').addClass('phantom').removeClass('reduced');
});

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
function goToNote(note){ // invariant: always fitted vertically
	// Starting point
	var oldBounds = viewer.viewport.getBounds();
	console.log('oldBounds=',oldBounds);
	// fit always with displacement
	var X = overlays[note].x < oldBounds.width*0.3 ? 0 : overlays[note].x > lcct_width - oldBounds.width*0.3 ? lcct_width - oldBounds.width : overlays[note].x-oldBounds.width*0.3;
	var newBounds = new OpenSeadragon.Rect(X, oldBounds.y, oldBounds.width, oldBounds.height,0); 
	console.log('newBounds=',newBounds);
	viewer.viewport.fitBoundsWithConstraints(newBounds, true);
}

function isPointCentered(leftPos, rightPos){
//	console.log('leftPos=',leftPos);
//	console.log('rightPos=',rightPos);
//	console.log('leftSquarePos=',$('#foto').width()*0.3);
//	console.log('rightSquarePos=',$('#foto').width()*0.7);
	if (leftPos > $('#foto').width()*0.1 && rightPos < $('#foto').width()*0.9){ // center
		console.log('point centered');
		return true;
	}
	else {
		console.log('point not centered');
		return false;
	}
}

// inicio del viewer
viewer.addHandler('open', function(event) {
	// fit vertically
	viewer.viewport.fitVertically();
	// bind center square
	$('.lcct-point div+div').each(function(i,el){
		$(el).hover(function(e){
			console.log('enter square');
			var leftPos = e.target.getBoundingClientRect().left + $(window)['scrollLeft']();
			var rightPos = e.target.getBoundingClientRect().right + $(window)['scrollLeft']();
			if (isPointCentered(leftPos, rightPos)){ // center
				if ( leftPos > ($('#foto').width() - rightPos ) ) {
					// mover a la izquierda 
					console.log('move to left');
					viewer.viewport.panBy(new OpenSeadragon.Point(-5/lcct_width,0), false);
				}
				else {
					// mover a la derecha 
					console.log('move to right');
					viewer.viewport.panBy(new OpenSeadragon.Point(5/lcct_width,0), false);
				}
			}
			else {
				$(e.target).addClass('reduced');
			}
			e.stopImmediatePropagation();
			$(e.target).removeClass('phantom');
		},function(e){
			console.log('leave square');
			$(e.target).not('.reduced').addClass('phantom');
		});
	});
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
		var oldBounds = viewer.viewport.getBounds();
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
