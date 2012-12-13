define ['kinetic'], (Kinetic) ->
	class Resize
		@action: (collage_item) ->

			console.log("making image resizable")
			canvas_group = collage_item.group
			{tl,tr,bl,br} = collage_item.corners
			canvas_item = collage_item.item
			
			item_position = canvas_item.getPosition();
			
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
				corner.show()
				corner.on "mousedown",() =>
					console.log("tl mousedown")
					canvas_group.setDraggable(false);
					canvas_group.moveToTop();
				
				corner.on "dragend", =>
					canvas_group.setDraggable(true)
			canvas_item.getLayer().draw()


				
		 