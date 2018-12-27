const Visitor = require('./visitor');
const AllSubNodesGetter = require('./AllSubNodesGetter');
const _ = require('underscore');

class XSSFinder extends Visitor {
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
       this.taints = _.filter(this.visitor.nodes, node=>node.kind == "variable" && (node.name == '_GET' || node.name == '_POST')); 
       this.sinkpoints = _.filter(this.visitor.nodes, node=> node.kind == 'echo');
       this.assign_stms = _.filter(this.visitor.nodes, (node)=> node.kind == 'assign');
       this.isTaint(this.assign_stms);
       this.findVP(this.sinkpoints);
    }

    isTaint( assign_stms){
        var push_count = 0;
        _.each( assign_stms, assign=>{
            _.each( this.taints, taint=>{
                    if( _.has(assign.right, 'kind') && assign.right.kind == 'variable' && assign.right.name == taint.name){
                        this.taints.push(assign.left);
                        
                        push_count++;
                    }else if( _.has(assign.right, 'kind') && assign.right.kind == 'offsetlookup' && assign.right.what.name == taint.name){
                        this.taints.push(assign.left);
                        push_count++;
                    }
                }
            );
        });
        if(push_count > 0)this.isTaint(this.taints.slice(-1*push_count));
    }

    findVP(sinknodes){
        _.each(sinknodes, sink=>{
            _.each(sink.arguments, arg=>{
                _.each(this.taints, taint=>{
                    if(arg.name == taint.name) this.vp.push(sink);
                });
            });
        });
    }
}

module.exports = XSSFinder;