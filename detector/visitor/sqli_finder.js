const SubNodeGetter = require('./subnode_getter');
const _ = require('underscore');

class EmptyCatchFinder  {
    constructor() {
        this.sourceVisitor = new SubNodeGetter('varialbe');
        this.sinkVisitor = new SubNodeGetter('identifier');
        this.source =[];
        this.sink = [];
    }

    visit(node){
        node.accept(this.sourceVisitor);
        node.accept(this.sinkVisitor);
        console.log(this.sourceVisitor.nodes);
        // // Find no Catch
        // this.nodes = _.filter(this.nodes, (node)=>{ 
        //     return _.toArray(node.catches).length ==0 ;
        // } );
        
        // Find empty Catch
        this.source = _.filter(this.sourceVisitor.nodes, (node)=>{
            return node.name == "_POST" || node.name == "_GET";
        });

        this.sink = _.filter(this.sinkVisitor.nodes, (node)=>{
            return node.name == "mysql_query"
        });
        
    }

    isTaint(node, taints){
        if(node.kind == 'variable'){
            return _.some(taints, (e)=>taints.kind == 'variable' && e.name == taints.name );
        }else if(node.kind == 'bin'){
            if( _.some(['varialbe','offsetlookup','bin'], e=>e == node.left.kind)){
                return this.isTaint(node.left);
            }else if(_.some(['varialbe','offsetlookup','bin'], e=>e == node.right.kind) ){
                return this.isTaint(node.right);
            }
        }else if(node.kind == 'offsetlookup'){
            return _.some(taints, (e)=> e.kind == 'offsetlookup' && assign.right.what.name == taint.name);
        }
        return false;
    }
}

module.exports = EmptyCatchFinder;