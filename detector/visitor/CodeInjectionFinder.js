const Visitor = require('./visitor');
const AllSubNodesGetter = require('./AllSubNodesGetter');
const _ = require('underscore');

class CodeInjectionFinder extends Visitor {
    constructor() {
        super();
        this.visitor = new AllSubNodesGetter();
        this.taints = [];
        this.sinkpoints =[];
        this.assign_stms = [];
        this.vp = [];
    }

    visit(node){
        node.accept(this.visitor); 
       this.source = _.filter(this.visitor.nodes, node=>node.kind == "variable" && (node.name == '_GET' || node.name == '_POST')); 
       this.sinkpoints = _.filter(this.visitor.nodes, node=> node.kind == 'include' || node.kind == 'eval');
       this.assign_stms = _.filter(this.visitor.nodes, (node)=> node.kind == 'assign' );
       this.findTaintValue(this.source);
       this.findVP(this.sinkpoints);
    }

    findTaintValue( source){
        var push_count = 0;
        _.each( this.assign_stms, assign=>{
            if(this.isTaint(assign.right, source)){
                this.taints.push(assign.left);
                push_count++;
            }  
        });
        if(push_count > 0)this.FindTaintValue(source.slice(-1*push_count));
    }

    findVP(sinknodes){
        _.each(sinknodes, sink=>{
           _.each(this.taints, taint=>{
                 if( _.has(sink, 'source') && sink.source.name == taint.name) this.vp.push(sink);
                 else if(_.has(sink, 'target') && sink.target.name == taint.name ) this.vp.push(sink);
             });
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

module.exports = CodeInjectionFinder;