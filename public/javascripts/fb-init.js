
window.fbAsyncInit = function() {
    FB.init({
      appId      : '236634053108854', // App ID
      channelUrl : '//localhost/channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });
    
    FB.getLoginStatus(function(response){
      console.log("login response: ")
      console.log(response);
      if(response.status === 'connected')
        initialize();
      else{
        facebookLogin();
      }
    });
   
    // Additional initialization code here
};

// Load the SDK Asynchronously
(function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
 }(document));


var facebookLogin = function(){
  FB.login(function(response){
    if (response.authResponse) {
      console.log('Welcome!  Fetching your information.... ');
      loadUser()
    
    } 
    else {
     console.log('User cancelled login or did not fully authorize.');
    }
  },{"scope":"user_photos,user_groups,user_events,friends_photos"});
}


var initialize = function(authResponse){
  FB.api('/me/photos',function(response){
    console.log(response)
    var pics = $('#your-pics')

    _.each(response.data,function(item){
      console.dir(item)
      
      var img_el = $('<img src="'+item.picture+'" class="picture">')
      img_el.draggable({cursor:'move',cursorAt:{top:0,left:0},revert:'invalid',helper:'clone'})
      img_el.data('fb_data',item)
      pics.append(img_el);  
    })
  })

}

$(function(){
  window.app = new App(new EventEmitter2());
  app.collage = new App.Collage('canvas-container');
  $('#login').click(facebookLogin)  
  $('#logout').click(function(){FB.logout()});
  $('#canvas-container').droppable({drop:fb_photo_dropped});
  $('#canvas-container canvas').css({border:'solid black 1px'});
 
});

var fb_photo_dropped = function(evt,ui)
{

  console.log("photo image dropped")
  console.dir(evt);
  console.dir(ui)
  var img = $(ui.draggable);
  var img_data = {
    offsetX:  evt.offsetX,
    offsetY: evt.offsetY,
    fbData: img.data('fb_data')

  }
  console.log(img_data)
  console.log();

  app.collage.addFbPhoto(img_data)

};

var App = function(event_emitter){
  this.emitter = event_emitter;
  // this.collage = new App.Collage(canvas_container);
  
}


App.Collage = function(canvas_element){
  this.canvas = $('#'+canvas_element);
  this.stage = new Kinetic.Stage({container:canvas_element,width:600 ,height:500})
  this.layer = new Kinetic.Layer();
  this.container = new Kinetic.Container({width:600,height:500});
  //this.layer.add(this.container); 
  this.stage.add(this.layer);
  
  this.container.on("click",function(){

    console.log("container click");})
  
  var that = this;
  this.activeImage = null;
  this.images = []
  this.canvas.on("click",function(evt){
    var cnvs_item =  that.container.getIntersections(evt.offsetX,evt.offsetY)
    if(that.currentItem !== undefined && cnvs_item.length === 0){
      that.currentItem.noLongerActive();
      that.currentItem = undefined;
    }

  });
 
  app.emitter.on("ItemSelected",function(type, item){
    console.log("Item Selected Event");
    if(that.currentItem) currentItem.noLongerActive();
    that.currentItem = item;
  })
};

App.Collage.prototype.dimensions = function(){
  return this.stage.getSize();
};

App.Collage.prototype.screenPosition = function(){
  return $('#canvas-container').position();
};

App.Collage.prototype.addFbPhoto = function(image_data){
  
  var collage_dimensions = this.dimensions();
  var imageToAdd = _.find(image_data.fbData.images,function(image){
                            return  image.width <= collage_dimensions.width 
                                    && image.height <= collage_dimensions.height;
  });
  this.addImage({src:imageToAdd.source,width:imageToAdd.width,height:imageToAdd.height,x:image_data.offsetX,y:image_data.offsetY});

}

App.Collage.prototype.addImage = function(imageSrc){
  console.log("adding image");
    var cnvs = this;
    var canvas_image = new App.Image(imageSrc,function(k_image){
      cnvs.container.add(k_image);
      cnvs.layer.add(k_image);
      cnvs.stage.draw();  
    });
    cnvs.images.push(canvas_image);
    
}

App.Image = function(imageSrc,onImageLoaded){
  var img = new Image(), setActive;
  this.group = new Kinetic.Group({draggable:true})
  
  var that = this;
  img.onload = function(){
    var k_image = new Kinetic.Image({
      image:img,
      x: imageSrc.x,
      y: imageSrc.y,
      width: imageSrc.width,
      height: imageSrc.height,
      name:'image',
      draggagle: true
      });
    that.group.add(k_image);
    
    onImageLoaded(that.group);
    
  };
  img.src = imageSrc.src;
  this.group.on("click",function(evt){
    console.log("image is Active")
    var getAnchor = function getAnchor(x,y,name){
      return new Kinetic.Rect({
        x:x,
        y:y,
        name:name,
        fill:'#000000',
        width: 12,
        height: 12,
        draggable:true
      });
    }
    var img = that.group.get('.image')[0]
    var imgPos = img.getPosition();
    var tl = getAnchor(imgPos.x-6,imgPos.y-6,'topLeft');
    var tr = getAnchor(imgPos.x+img.getWidth()-6,imgPos.y-6,'topRight');
    var bl = getAnchor(imgPos.x-6,imgPos.y-6+img.getHeight(),'bottomRight');
    var br = getAnchor(imgPos.x+img.getWidth()-6,imgPos.y-6+img.getHeight(),'bottomLeft');
    tl.on("dragmove",function(){
      tr.attrs.y = tl.attrs.y;
      bl.attrs.x = tl.attrs.x;
      img.setPosition(tl.attrs.x+6, tl.attrs.y+6);
      var img_width = tr.attrs.x - tl.attrs.x;
      var img_height = bl.attrs.y - tl.attrs.y;
      img.setSize(img_width,img_height);
    })
    bl.on("dragmove",function(){
      tl.attrs.x = bl.attrs.x;
      br.attrs.y = bl.attrs.y;
      var img_width = tr.attrs.x - tl.attrs.x;
      var img_height = bl.attrs.y - tl.attrs.y;
      img.setPosition(tl.attrs.x+6, tl.attrs.y+6);
      img.setSize(img_width,img_height);
    })
    tr.on("dragmove",function(){
      tl.attrs.y = tr.attrs.y;
      br.attrs.x = tr.attrs.x;
      var img_width = tr.attrs.x - tl.attrs.x;
      var img_height = bl.attrs.y - tl.attrs.y;
      img.setPosition(tl.attrs.x+6, tl.attrs.y+6);
      img.setSize(img_width,img_height);
    })
    br.on("dragmove",function(){
      bl.attrs.y = br.attrs.y;
      tr.attrs.x = br.attrs.x;
      var img_width = tr.attrs.x - tl.attrs.x;
      var img_height = bl.attrs.y - tl.attrs.y;
      img.setPosition(tl.attrs.x+6, tl.attrs.y+6);
      img.setSize(img_width,img_height);
    })
    

    _.each([tl,tr,br,bl],function(corner){
      corner.on("mousedown",function(){
        console.log("tl mousedown")
        that.group.setDraggable(false);
        this.moveToTop();
      })
      corner.on("dragend",function(){
        that.group.setDraggable(true)
      })
      
    })
    that.group.add(tl);
    that.group.add(tr);
    that.group.add(br);
    that.group.add(bl);
    that.group.getLayer().draw();
    app.emitter.emit("ItemSelected","image",that.group);
  });
   

}

App.Image.prototype.noLongerActive = function(){
  console.log("resetting as inactive");
}


var User = Backbone.Model.extend({
  initialize: function(fbUser){

  }
})
