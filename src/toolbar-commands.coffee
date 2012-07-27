App.Commands = {}
App.Commands.resize =  (collage_item) ->

	console.log("making image resizable")
	canvas_item = collage_item.item
	group = new Kinetic.Group({draggable:true})
	group.add(canvas_item)

	getAnchor = (x,y,name) ->
		return new Kinetic.Rect({
			x:x,
			y:y,
			name:name,
			fill:'#000000',
			width: 12,
			height: 12,
			draggable:true
		});

	item_position = canvas_item.getPosition();
	tl = getAnchor(item_position.x-6,item_position.y-6,'topLeft');
	tr = getAnchor(item_position.x+canvas_item.getWidth()-6,item_position.y-6,'topRight');
	bl = getAnchor(item_position.x-6,item_position.y-6+canvas_item.getHeight(),'bottomRight');
	br = getAnchor(item_position.x+canvas_item.getWidth()-6,item_position.y-6+canvas_item.getHeight(),'bottomLeft');
	tl.on "dragmove",() =>
		tr.attrs.y = tl.attrs.y;
		bl.attrs.x = tl.attrs.x;
		
		img_width = tr.attrs.x - tl.attrs.x
		img_height = bl.attrs.y - tl.attrs.y
		canvas_item.setPosition(tl.attrs.x+6, tl.attrs.y+6)
		canvas_item.setSize(img_width,img_height);
	
	bl.on "dragmove",() =>
		tl.attrs.x = bl.attrs.x;
		br.attrs.y = bl.attrs.y;
		img_width = tr.attrs.x - tl.attrs.x;
		img_height = bl.attrs.y - tl.attrs.y;
		canvas_item.setPosition(tl.attrs.x+6, tl.attrs.y+6);
		canvas_item.setSize(img_width,img_height);
	
	tr.on "dragmove",() =>
		tl.attrs.y = tr.attrs.y;
		br.attrs.x = tr.attrs.x;
		img_width = tr.attrs.x - tl.attrs.x;
		img_height = bl.attrs.y - tl.attrs.y;
		canvas_item.setPosition(tl.attrs.x+6, tl.attrs.y+6);
		canvas_item.setSize(img_width,img_height)
	
	br.on "dragmove",() =>
		bl.attrs.y = br.attrs.y
		tr.attrs.x = br.attrs.x
		img_width = tr.attrs.x - tl.attrs.x
		img_height = bl.attrs.y - tl.attrs.y
		canvas_item.setPosition(tl.attrs.x+6, tl.attrs.y+6)
		canvas_item.setSize(img_width,img_height)		

	_.each [tl,tr,br,bl],(corner) ->
		corner.on("mousedown",() =>
			console.log("tl mousedown")
			group.setDraggable(false);
			group.moveToTop();
		)
		corner.on "dragend", =>
			group.setDraggable(true)
	app.collage.layer.add(group)
	app.collage.layer.draw()	
	

