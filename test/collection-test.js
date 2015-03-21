var Collection = require("../lib/collection");
var expect     = require("expect.js");

describe(__filename + "#", function() {
    it("can create a new model class", function() {
        var ChildCollection = Collection.createClass({});
        expect(new ChildCollection() instanceof Collection).to.be(true);
    });


    it("can create a new model class without the new keyword", function() {
        var ChildCollection = Collection.createClass({});
        expect(ChildCollection() instanceof Collection).to.be(true);
    });

    it("can accept a source in the constructor arg", function() {
        var ChildCollection = Collection.createClass();
        var c = new ChildCollection([1,2,3].map(ChildCollection.prototype.modelClass));
        expect(c.at(0).data).to.be(1);
    });

    it("can accept properties in the constructor arg", function() {
        var ChildCollection = Collection.createClass();
        var c = new ChildCollection({ name: "abba" });
        expect(c.name).to.be("abba");
    });

    it("properly deserializes data", function() {
        var ChildCollection = Collection.createClass();
        var c = new ChildCollection({ data: [1,2,3,4] });
        expect(c.at(0).data).to.be(1);
    });

    it("doesn't replace models that have changed in the collection", function() {
        var c = new Collection({data:[1,2,3,4]});
        var m = c.at(0);
        c.set("data", [1,2,3,4]);
        expect(c.at(0)).to.be(m);
        // check resorting
        c.set("data", [4,3,2,1]); 
        expect(c.at(3)).to.be(m);
    });

    it("can properly create a collection", function() {
        var c = new Collection();
        c.create(1);
        expect(c.length).to.be(1);
    });


    it("can wait to push model until the created model is saved", function() {
        var c = new Collection();
        var m = c.create({waitUntilSave:true});
        expect(c.length).to.be(0);
        // TODO - check for save
    });

    it("removes a model if it's been disposed of", function() {
        var c = new Collection({data:[1,2,3,4]});
        expect(c.length).to.be(4);
        c.at(0).dispose();
        expect(c.length).to.be(3);
    });

    it("watches a newly created model", function() {
        var c = new Collection({data:[1,2,3]});
        expect(c.length).to.be(3);
        var m = c.create(4);
        expect(c.length).to.be(4);
        m.dispose();
        expect(c.length).to.be(3);
    });

    it("triggers a watcher when a model changes", function() {
        var c = new Collection({data:[1,2,3]});
        
        var i = 0;
        var w = c.watch(function(){i++});
        c.at(0).set("data", 4);
        c.at(0).set("data", 4);
        expect(i).to.be(2);
    });

    it("doesn't watch a model that's been spliced from the collection", function() {
        var c = new Collection({data:[1,2,3]});
        var i = 0;
        var w = c.watch(function(){i++});
        var m = c.at(0);
        expect(i).to.be(0);
        c.splice(0, 1);
        expect(i).to.be(1);
        m.set("data", 4);
        expect(i).to.be(1);
    });
});