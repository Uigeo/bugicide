
const CatchNodesGetter = require('./visitor/catch_node_getter');



const _ = require('underscore');
//console.log("Jell");
const parser = require('../parse_main');


class CatchDetector  {

    constructor(src, path) {
        
        this.visitor = new CatchNodesGetter();
        this.parsed = parser.parseCode(src);
        //console.log(this.parsed);
        this.parsed.accept(this.visitor);
        this.path= path;
    }

    bugReport(){ 
        return _.map(this.visitor.nodes, (vul)=>{
            return {
                'info' : {
                    "category" : "Error Handling",
                    "name" : "Catch Catch",
                    'ID' : 13,
                    'rank' : 1,
                    'CWE' : 390
                },
                'SourceLine' : {
                    "filename" : this.path,
                    "start" :  vul.loc.start,
                    "end" : vul.loc.end,
                },
                'message' : "We found catch statment",
                'sugestion' : "leave it"
            }
        } );
    }
}

module.exports = CatchDetector;