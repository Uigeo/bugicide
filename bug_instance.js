

class BugInstance {
    constructor(info, sourceLine, message, sugestion){
        this.info = info;
        this.sorceLine = sourceLine;
        this.message = message;
        this.sugestion = sugestion;
    }
}

class Info {
    constructor(category, name, id, rank, cwe){
        this.category = category;
        this.name = name;
        this.id = id;
        this.rank = rank;
        this.cwe = cwe;
    }
}

class SourceLine {
    constructor(filename, dirpath, start, end){
        this.filename = filename;
        this.dirpath = dirpath;
        this.start = start;
        this.end = end;
    }
}


module.exports = BugInstance;