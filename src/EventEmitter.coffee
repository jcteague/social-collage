define ['EventEmitter2'], (Em) ->
	
	getInstance = ()->
		if(!em)
			console.log("initializing event emitter")
			em = new Em()
		return em
	return getInstance() 

			