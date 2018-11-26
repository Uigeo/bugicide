const EmptyCatchFinder = require('./visitor/empty_catch_finder');

const _ = require('underscore');
//console.log("Jell");
const parser = require('../parse_main');


class EmptyCatchDetecor  {

    constructor(src, path) {
        
        this.visitor = new EmptyCatchFinder();
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
                    "name" : "Empty Catch Block",
                    'ID' : 13,
                    'rank' : 1,
                    'CWE' : 390
                },
                'SourceLine' : {
                    "filename" : this.path,
                    "start" :  vul.loc.start,
                    "end" : vul.loc.end,
                },
                'message' : "There is no response to ",
                'sugestion' : "You have to fill the catch statement"
            }
        }
        );
    }
}

module.exports = EmptyCatchDetecor;