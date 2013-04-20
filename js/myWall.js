$(function(){
	//chech browser avaliability
	if (Modernizr.draganddrop) {
	} else {
		alert("browser does not support html5 drag and drop");
	}
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  // Great success! All the File APIs are supported.
	} else {
	  alert('The File APIs are not fully supported in this browser.');
	}
	$(window).resize(function(){
		$('body').css('min-height',window.innerHeight);
		$('div').filter('.wallWrapper').css('min-height',window.innerHeight);
	});
	$('body').css('min-height',window.innerHeight);
	$('div').filter('.wallWrapper').css('min-height',window.innerHeight);

	var blockAmount=0;
	var arrowStartX=0,arrowStartY=0,arrowEndX=0,arrowEndY=0;
	var isDragging=false,startArrowing=false;
	$('div').disableSelection();

	// double click event
	$('div').filter('.wallWrapper').on('dblclick',function(e){
		startArrowing=false;
		$('<div class="newBlock"></div>')
			.css({
				left:(e.pageX-10)+'px',
				top:(e.pageY-10)+'px'
			})
			.append('<div class="newBlockContent"><textarea></textarea><p></p></div><i class="delete"></i>')
			.appendTo($(this))
			.draggable({
				start: function(){
					isDragging=true;
					$(this).css('cursor','move');
				},
				stop: function(){
					isDragging=false;
				}
			})
			.on('click','.delete',function(){
				$(this).parent().remove();
			})
		.on('click','p',function(e){
			$(this).siblings('textarea').show().focus();
			$(this).hide();
			e.stopPropagation();
		})
		.on('mousedown','textarea',function(e){
			isDragging=true;
			e.stopPropagation();
		})
		.on('mouseup','textarea',function(e){
			isDragging=false;
			e.stopPropagation();
		})
		.on('blur','textarea',function(e){
				$(this).siblings('p').css({
					width: $(this).width(),
					height: $(this).height()
				}).text($(this).val()).show();
				$(this).hide();
				isDragging=false;
				e.stopPropagation();
		})
		.on('focus','textarea',function(){
			isDragging=true;
			startArrowing=false;
		})
		.find('textarea').show().focus().autosize();
		blockAmount++;
	});
	//mousedown evnet
	$('div').filter('.wallWrapper').on('mousedown',function(e){
		if(!isDragging){
			startArrowing=true;
			$(this).css('cursor','e-resize');
			arrowStartX=e.pageX;
			arrowStartY=e.pageY;	
		}
	});
	//mouseup evnet
	$('div').filter('.wallWrapper').on('mouseup',function(e){
		$(this).css('cursor','auto');
		if(!isDragging && startArrowing){
			var arrowswithTemp=0;
			arrowEndX=e.pageX;
			arrowEndY=e.pageY;
			var arrowDistance=getDistance(arrowStartX,arrowStartY,arrowEndX,arrowEndY);
			var midX=(arrowStartX+arrowEndX)/2;
			var midY=(arrowStartY+arrowEndY)/2;
			var toRotate=Math.atan2(arrowStartY-arrowEndY,arrowStartX-arrowEndX)*180/Math.PI+180;
			var xOffset=20*Math.sin(Math.atan2(arrowStartY-arrowEndY,arrowStartX-arrowEndX)),
			yOffset=20*Math.cos(Math.atan2(arrowStartY-arrowEndY,arrowStartX-arrowEndX));
			//alert(xOffset+" "+yOffset+" "+toRotate);
			if(arrowDistance>10){
				$('<div class="arrow" draggable="true"></div>').css({
					width: arrowDistance+'px',
					left: (arrowStartX-xOffset)+'px',
					top: (arrowStartY+yOffset)+'px',
					transform:'rotate('+toRotate+'deg)'
				}).appendTo($(this))
				.append('<i class="delete"></i><i class="head" draggable="true"></i><i class="center"></i><i class="tail" draggable="true"></i>')
				.draggable({
					handle: '.center',
					start: function(){
						isDragging=true;
						$(this).css('cursor','move');
					},
					stop: function(){
						isDragging=false;
						$(this).css('cursor','default');
					}})
				.on('click','.delete',function(){
					$(this).parent().remove();
					})
				.data('arrowStartX',arrowStartX).data('arrowStartY',arrowStartY)
				.data('arrowEndX',arrowEndX).data('arrowEndY',arrowEndY);
			}
		}
	});
	
	// $( "#draggable" ).draggable({ handle: "p" });
	// $( "#draggable2" ).draggable({ cancel: "p.ui-widget-header" });

	function getDistance(X1,Y1,X2,Y2){
		return Math.sqrt( Math.pow(X1-X2,2)+Math.pow(Y1-Y2,2) );
	}


	function handleDragOver(e) {
	  if (e.preventDefault) {
	    e.preventDefault(); // Necessary. Allows us to drop.
	  }
	  // See the section on the DataTransfer object.
	  e.dataTransfer.dropEffect = 'move';
	  return false;
	}
	function handleDragEnter(e) {
	  // this / e.target is the current hover target.
	  this.classList.add('over');
	}
	function handleDragLeave(e) {
	  this.classList.remove('over');  // this / e.target is previous target element.
	}
	function handleDrop(e) {
	  var imageBlockX=e.pageX,imageBlockY=e.pageY;
	  e.stopPropagation(); // Stops some browsers from redirecting.
	  e.preventDefault();
	  var currentColumn=this;
	  var files = e.dataTransfer.files;
	  for (var i = 0, f; f = files[i]; i++) {
	    // Read the File objects in this FileList.
		var reader = new FileReader();
	    // Closure to capture the file information.
	    reader.onload = (function(theFile) {
	        return function(e) {
	        	// Render thumbnail.
		        $('<div class="imageBlock"></div>')
				.css({
					left:(imageBlockX)+'px',
					top:(imageBlockY)+'px'	})
		        .append('<img class="thumb" src="'+e.target.result+'" title="'+escape(theFile.name)+'"/>')
		        .append('<i class="delete"></i>')
				.draggable({
					start: function(){
						isDragging=true;
						$(this).css('cursor','move');
					},
					stop: function(){
						isDragging=false;
					}
				})
				.css({
					position:'absolute',
					left:(e.pageX-10)+'px',
					top:(e.pageY-10)+'px'
				})
				.appendTo('.wallWrapper')
				.on('click','.delete',function(){
					$(this).parent().remove();
					});

	        };
	    })(f);
	    // Read in the image file as a data URL.
	    reader.readAsDataURL(f);
	  }
	}

	var wallWrappers = document.querySelectorAll('.wallWrapper');
	[].forEach.call(wallWrappers, function(wallWrapper) {
	  wallWrapper.addEventListener('dragover', handleDragOver, false);
	  wallWrapper.addEventListener('drop', handleDrop, false);
	});

});