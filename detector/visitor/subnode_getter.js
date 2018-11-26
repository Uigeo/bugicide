const Visitor = require('./visitor');
const _ = require('underscore');

class SubNodesGetter extends Visitor {
    constructor(kind) {
        super();
        this.nodekind = kind
        this.nodes = [];
    }

    visit(node){
        _.each( _.values(node), (value)=>{
            if( _.has( value, 'kind')){
                if(value.kind == this.nodekind)this.nodes.push(value);              
            }
            if(_.keys(value).length){
                this.visit(value);
            }
        });
    }
}

module.exports = SubNodesGetter;
