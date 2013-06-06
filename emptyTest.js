require('should');
var sinon = require('sinon');


var test_function = function(val, callback){
	callback(val);
}

var user_test_function = function(x){
	test_function(x, function(val){
		console.log(val);
	})
}
describe('Test Setup',function(){
	it('stubbing a callback',function(){
		stubbed_cb = sinon.spy();
		test_function(42, stubbed_cb)
		stubbed_cb.calledOnce.should.be.true;
		
	});
	it('can set results',function(){
		cb = sinon.stub(test_function).yeildsTo(42)
		cb.args[0][0].should.equal(42)
	})

	




});

