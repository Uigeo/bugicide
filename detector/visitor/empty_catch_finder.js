const CatchNodesGetter = require('./catch_node_getter.js');
const _ = require('underscore');

class EmptyCatchFinder  {
    constructor() {
        this.visitor = new CatchNodesGetter();
        this.nodes =[];
    }

    visit(node){
        node.accept(this.visitor);
        console.log(this.visitor.nodes);
        // // Find no Catch
        // this.nodes = _.filter(this.nodes, (node)=>{ 
        //     return _.toArray(node.catches).length ==0 ;
        // } );
        
        // Find empty Catch
        this.nodes = _.filter(this.visitor.nodes, (node)=>{
                return node.body.children.length == 0;
        })
        
    }
}

module.exports = EmptyCatchFinder;