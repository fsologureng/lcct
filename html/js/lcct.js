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
	navigationControlAnchor: 'BOTTOM_RIGHT',
	animationTime: 0.8,
	gestureSettingsMouse: {
		scrollToZoom: true,
		clickToZoom: false,
		dblClickToZoom: false,
		pinchToZoom: true,
		flickEnabled: true
	},
	gestureSettingsTouch: {
		scrollToZoom: true,
		clickToZoom: false,
		dblClickToZoom: false,
		pinchToZoom: true,
		flickEnabled: true
	},
	gestureSettingsPen: {
		scrollToZoom: true,
		clickToZoom: false,
		dblClickToZoom: false,
		pinchToZoom: true,
		flickEnabled: true
	},
	gestureSettingsUnknown: {
		scrollToZoom: true,
		clickToZoom: false,
		dblClickToZoom: false,
		pinchToZoom: true,
		flickEnabled: true
	}
});

// show a note
function show_note(){
}
function hide_note(){
}

function showTip(point){
	var tip = $('#'+$(point).attr('aria-controls'));
	var bounds = viewer.viewport.getBounds(); 
	var viewerTopLeft = viewer.viewport.viewportToWindowCoordinates(bounds.getTopLeft());
	console.log('[showTip] viewerTopLeft=',viewerTopLeft);
	var viewerBottomRight = viewer.viewport.viewportToWindowCoordinates(bounds.getBottomRight());
	console.log('[showTip] viewerBottomRight=',viewerBottomRight);
	var asterisk = $(point).children('div.asterisk').get(0);
	console.log('[showTip] point=',point);
	var leftPos = asterisk.getBoundingClientRect().left + $(window)['scrollLeft']();
	console.log('[showTip] leftPos=',leftPos);
	var rightPos = asterisk.getBoundingClientRect().right + $(window)['scrollLeft']();
	console.log('[showTip] rightPos=',rightPos);
	var tipWidth = tip.outerWidth(); //Find width of tooltip
	console.log('[needPanTip] tipWidth=',tipWidth);
	var tipHeight = tip.outerHeight(); //Find height of tooltip
	var tipVisX;
	var tipVisY = (viewerBottomRight.y - tipHeight)/2;
	if ( leftPos - viewerTopLeft.x < viewerBottomRight.x - rightPos ) {
		tipVisX = rightPos + (viewerBottomRight.x - rightPos - tipWidth)/2;
	}
	else {
		tipVisX = viewerTopLeft.x + (leftPos - tipWidth - viewerTopLeft.x)/2;
	}
	tip.css({
		left: tipVisX,
		top: tipVisY,
		position: 'absolute'
	});
	tip.show(); //Show tooltip
}
function needPanTip(e){
	var point = e.target
	console.log('[needPanTip] point=',point);
	var bounds = viewer.viewport.getBounds(); 
	// console.log('bindtooltip] bounds=',bounds);
	var viewerTopLeft = viewer.viewport.viewportToWindowCoordinates(bounds.getTopLeft());
	console.log('[needPanTip] viewerTopLeft=',viewerTopLeft);
	var viewerBottomRight = viewer.viewport.viewportToWindowCoordinates(bounds.getBottomRight());
	console.log('[needPanTip] viewerBottomRight=',viewerBottomRight);
	var asterisk = $(point).children('div.asterisk').get(0);
	console.log('[needPanTip] asterisk=',asterisk);
	var leftPos = asterisk.getBoundingClientRect().left + $(window)['scrollLeft']();
	console.log('[needPanTip] leftPos=',leftPos);
	var rightPos = asterisk.getBoundingClientRect().right + $(window)['scrollLeft']();
	console.log('[needPanTip] rightPos=',rightPos);
	var tip = $('#'+$(point).attr('aria-controls'));
	var tipWidth = tip.outerWidth(); //Find width of tooltip
	console.log('[needPanTip] tipWidth=',tipWidth);
	var marginFactor = 1.05;
	var tipHeight = tip.outerHeight(); //Find height of tooltip
	var tipVisX;
	var tipVisY = (viewerBottomRight.y - tipHeight)/2;
	// debug
	/*
	var debug1 = document.createElement('div');
	point.appendChild(debug1);
	$(debug1).css({
		position: 'fixed',
		left: leftPos,
		top: 0,
		width: rightPos - leftPos,
		height: viewerBottomRight.y-1,
		border: 'red solid 1px',
		'pointer-events': 'none'
	});*/

	// panning to give space
	if ( ( viewerBottomRight.x - rightPos < tipWidth*marginFactor ) && ( leftPos - viewerTopLeft.x < tipWidth*marginFactor ) ){ // center
		if ( leftPos - viewerTopLeft.x < viewerBottomRight.x - rightPos ) {
			// mover punto de vista hacia la derecha 
			console.log('[needPanTip] move asterisk to left');
			var delta = new OpenSeadragon.Point(Math.min(tipWidth*marginFactor - (viewerBottomRight.x - rightPos),Math.ceil(e.pageX+(rightPos-leftPos))),0);
			console.log('[needPanTip] delta=',delta);
			viewer.viewport.panBy(viewer.viewport.deltaPointsFromPixels(delta), false);
		}
		else {
			// mover punto de vista hacia la izquierda 
			console.log('[needPanTip] move point to right');
			var delta = new OpenSeadragon.Point(tipWidth*marginFactor - (leftPos - viewerTopLeft.x),0);
			console.log('[needPanTip] delta=',delta);
			viewer.viewport.panBy(viewer.viewport.deltaPointsFromPixels(delta.rotate(180)), false);
		}
		$(point).addClass('pending');
		return true;
	}
	else {
		console.log('[needPanTip] no panning');
		return false;
	}
}

function showLasers(asterisk){
	var bounds = viewer.viewport.getBounds(); 
	// console.log('[showLasers] bounds=',bounds);
	var viewerTopLeft = viewer.viewport.viewportToWindowCoordinates(bounds.getTopLeft());
	// console.log('[showLasers] viewerTopLeft=',viewerTopLeft);
	var viewerBottomRight = viewer.viewport.viewportToWindowCoordinates(bounds.getBottomRight());
	// console.log('[showLasers] viewerBottomRight=',viewerBottomRight);
	var leftPos = asterisk.getBoundingClientRect().left + $(window)['scrollLeft']();
	console.log('[showLasers] leftPos=',leftPos);
	var rightPos = asterisk.getBoundingClientRect().right + $(window)['scrollLeft']();
	console.log('[showLasers] rightPos=',rightPos);
	var topPos = asterisk.getBoundingClientRect().top + $(window)['scrollTop']();
	console.log('[showLasers] topPos=',topPos);
	var bottomPos = asterisk.getBoundingClientRect().bottom + $(window)['scrollTop']();
	console.log('[showLasers] bottomPos=',bottomPos);

	var lasersX = (leftPos + rightPos)/2 - 2500/2 + laser1_delta_x;
	// console.log('[showLasers] lasersX=',lasersX);
	var lasersY = (topPos + bottomPos)/2 - 2130/2 + laser1_delta_y;
	// console.log('[showLasers] lasersY=',lasersY);
	$(asterisk).children('.mask').show();
	$(asterisk).children('.laser').css({
		left: lasersX,
		top: lasersY,
		width: 2500,
		height: 2130,
		position: 'fixed'
	}).show();
};

viewer.addHandler('animation-finish', function(event) {
	console.log('[animation-finish handler]');
	var point = $('div.pending');
	console.log('[animation-finish handler] point=',point);
	if ( point.length > 0 ){
		// mostrar nota asociada
		point.children('.mask').show();
		showLasers(point.get(0));
		showTip(point.get(0));
		point.removeClass('pending');
		var tip = $('#'+$(point).attr('aria-controls'));
/*		window.setTimeout(function(){
			tip.hide(); //Hide tooltip
			point.children('.laser').hide();
			point.children('.mask').hide();
		},6000);*/
	}
});

// Bind a note
function bindtooltip(note){
	var tip = $(note);
	// console.log('[bindtooltip] tip=',tip);
//	var mask = $('#mask');
	var id = tip.prop('id').replace(/^N(\d+)$/,'P$1','ig');
	// console.log('bindtooltip] id='+id);
	// console.log('[bindtooltip] is touch: '+window.matchMedia("(pointer: coarse)").matches);
	if (window.matchMedia("(pointer: coarse)").matches){ //FIXME: close lightboxes on click 
		screen.orientation.lock('landscape');
	}
	$("#"+id).on('click', function(e) {
		e.stopImmediatePropagation();
		if( tip.filter(':visible').length > 0 ){
			tip.hide(); //Hide tooltip
			$(e.target).children('.laser').hide();
			$(e.target).children('.mask').hide();
		}
		else {
			if(!needPanTip(e)){
				$(e.target).children('.mask').show();
				showLasers(e.target);
				showTip(e.target);
			}
		}
	});
/*
	if (window.matchMedia("(pointer: coarse)").matches){ //FIXME: close lightboxes on click 
		screen.orientation.lock('landscape');
		$("#"+id).on('click', function(e) {
			if( tip.filter(':visible').length > 0 ){
				tip.hide(); //Hide tooltip
				$(e.target).children('.laser').hide();
				$(e.target).children('.mask').hide();
			}
			else {
				if(!needPanTip(e)){
					$(e.target).children('.mask').show();
					showLasers(e.target);
					showTip(e.target);
				}
			}
		});
	}
	else {
		$("#"+id).hover(function(e){
			if(!needPanTip(e)){
				//mask.show();
				$(e.target).children('.mask').show();
				showLasers(e.target);
				showTip(e.target);
			}
		}, function(e) {
			tip.hide(); //Hide tooltip
			$(e.target).children('.laser').hide();
			$(e.target).children('.mask').hide();
		});
	}
	*/
}

// send email
function sendMail(){
	var subject = encodeURIComponent('Mensaje desde LCCT');
	var body = encodeURIComponent(document.forms.feedback.message.value);
	window.open("mailto:laciudadcomotexto2019@gmail.com?subject="+subject+"&body="+body,"_blank");
	return false;
}

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
	// always fit with displacement
	var X = overlays[note].x < oldBounds.width*0.3 ? 0 : overlays[note].x > lcct_width - oldBounds.width*0.3 ? lcct_width - oldBounds.width : overlays[note].x-oldBounds.width*0.3;
	var newBounds = new OpenSeadragon.Rect(X, oldBounds.y, oldBounds.width, oldBounds.height,0); 
	console.log('newBounds=',newBounds);
	viewer.viewport.fitBoundsWithConstraints(newBounds, true);
}

// move point to left or right depending on focus
function panPoint(point){
	var leftPos = point.getBoundingClientRect().left + $(window)['scrollLeft']();
	var rightPos = point.getBoundingClientRect().right + $(window)['scrollLeft']();
	var note_width = $('#'+point.prop('aria-controls')).width();
	if ( ( $('#foto').width() - rightPos ) < note_width || ( $('#foto').width() - leftPos ) < note_width ){ // center
		if ( leftPos > ($('#foto').width() - rightPos ) ) {
			// mover a la izquierda 
			console.log('[panPoint] move to left');
			viewer.viewport.panBy(new OpenSeadragon.Point(-(note_width - ($('#foto').width() - leftPos))/lcct_width,0), false);
		}
		else {
			// mover a la derecha 
			console.log('[panPoint] move to right');
			viewer.viewport.panBy(new OpenSeadragon.Point((note_width - ($('#foto').width() - rightPos))/lcct_width,0), false);
		}
	}
}
// inicio del viewer
viewer.addHandler('open', function(event) {
	// fit vertically
	viewer.viewport.fitVertically();
	// Bind notes
	$('.lcct-note').each(function(idx,note){
		bindtooltip(note);
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
			$('#'+id).show("fast",function(){console.log("activa ",id)}).addClass('show');
			$('#mask').show("fast",function(){console.log("activa máscara")});
		});
		$('#'+id+' nav button').on('click',function(e){
			console.log('click cierra ',id);
			$('#mask').hide("fast",function(){console.log("desactiva máscara")});
			$('#'+id).hide("fast",function(){console.log("desactiva ",id)}).removeClass('show');
			document.location.hash='';
		});
	});
	// out with click on mask
	$('#mask').on('click',function(e){
		console.log('click mascara');
		$('.lightbox.show').hide("fast",function(){console.log("desactiva lightbox desde la máscara")}).removeClass('show');
		$('#mask').hide("fast",function(){console.log("desactiva máscara")});
		document.location.hash='';
	});
	$('.mask').on('click',function(e){
		e.stopImmediatePropagation();
		mask = e.target;
		var tip = $('#'+$(mask).parent().attr('aria-controls'));
		tip.hide(); //Hide tooltip
		$(mask).siblings('img.laser').hide();
		$(mask).hide();
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
	// click on logo
	$('#logo').on('click',function(){
		// fit vertically
		viewer.viewport.fitVertically();
		// Starting point
		var oldBounds = viewer.viewport.getBounds();
		console.log('oldBounds=',oldBounds);
		var newBounds = new OpenSeadragon.Rect(0, oldBounds.y, oldBounds.width, oldBounds.height,0); 
		console.log('newBounds=',newBounds);
		viewer.viewport.fitBoundsWithConstraints(newBounds, true);
	});
	// click on left
	$('#left').on('click',function(){
		console.log('[left]');
		viewer.viewport.panBy(viewer.viewport.deltaPointsFromPixels(new OpenSeadragon.Point(-250,0)), false);
	});
	// click on right
	$('#right').on('click',function(){
		console.log('[right]');
		viewer.viewport.panBy(viewer.viewport.deltaPointsFromPixels(new OpenSeadragon.Point(250,0)), false);
	});
});
