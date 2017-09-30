
/*######################################################################################
#                         Lisp interpreter in JavaScript                               #
#                        ________________________________                              #
#                                                                                      #
#           Run this program using <nodejs --harmony_destructuring lis.js>             #
#                                                                                      #
#                                                               Created by-            #
#                                                                           Vishnu T   #
#                                                                                      #
#                                                                                      #
######################################################################################*/


//<--------------------------------------------------------------------------------->//



/*#####################################################################################

        Tokenizes scheme program 
        Eg:- input:==> (begin (* 5 6)) 

             output==> returns [ "(", "begin", "(", "*", "5", "6", ")", ")" ]

#################################################################################### */

var tokenize=function(str){

    return str.replace(/\(/g,' ( ').replace(/\)/g,' ) ').trim().split(/\ +/);
}

/*#####################################################################################

                Converts the tokenized Program to parsed form

        Eg:- input:==> [ "(", "begin", "(", "*", "5", "6", ")", ")" ]
            
             output:==> returns  [ "begin", [ "*", 5, 6 ] ]         

#####################################################################################*/

var readFromTokens= function(tokens){
    if(tokens.length==0){
        throw "Syntax error:Unexpected EOF while reading"
        return
    }
    token=tokens.shift()
    if(token=='('){
        var l=[]
        while(tokens[0]!=')'){
            l.push(readFromTokens(tokens))
        }
        tokens.shift()
        return l 
    }
    else if(token==')'){
        throw "Syntax error:Unexpected )"
        return

    }
    else
        return atom(token)
}


/*#####################################################################################
       
        Checks whether string is number coverts to number if number
              and returns number else returns string itself

#####################################################################################*/


var atom=function(token){
    if(isNaN(Number(token))==true)
        return token
    else 
        return Number(token)
    
}


/*#####################################################################################
                
                Returns Parsed program
        
#####################################################################################*/


var parse=function(program){
    return readFromTokens(tokenize(program))
}


/*#####################################################################################
            
            Creating the standard functions, keywords and Operators  

#####################################################################################*/


function add(a,b){return a+b}
function sub(a,b){return a-b}
function mul(a,b){return a*b}
function div(a,b){return a/b}
function lt(a,b){return a<b}
function gt(a,b){return a>b}
function eq(a,b){return a==b}
function geq(a,b){return a>=b}
function leq(a,b){return a<=b}
function begin(x){return x}
function car(x){return x[0]}
function cdr(x){return x.slice(1)}
function not(x){return !(x)}
function cons(x, y){ 
        y.unshift(x)
        return y
    }

var stdEnv=function(env){
    Object.assign(env,{ 'sin':Math.sin,'cos':Math.cos,'tan':Math.tan,'pow':Math.pow,
                        'log':Math.log,'pi':3.141592653589793,'abs':Math.abs,
                        'min':Math.min,'max':Math.max,'sqrt':Math.sqrt,'+':add,
                        '-':sub,'*':mul,'/':div,'<':lt,'>':gt,'=':eq,'>=':geq,
                        '<=':leq,'append':add,'begin':begin,'cdr':cdr,'car':car, 
                        'equal?':eq,'not':not, 'list':Array, 'cons':cons})

    return env

}

//#####################################################################################

var newenv=function(denv){
    var i;
    var env={};
    var global=denv.globl||{};
    var getglob = function () {
        return global;
    };  
        
    var find = function (variable) {
        if (env.hasOwnProperty(variable)) {
            return env;
        } else {
            return global.find(variable);
        }
    };  
 
    if(0!==denv.parms.length){
        for(i=0;i<denv.parms.length;i+=1){

            env[denv.parms[i]]=denv.args[i];

        }
    }
    env.find=find;
    env.getglob=getglob;
    return env;
};


/*#####################################################################################
 
                            Evaluating the parsed program

        Input==>[ "begin", [ "*", 5, 6 ] ]
        Output==> returns 30

#####################################################################################*/

var Gev=stdEnv(newenv({parms:[],args:[],globl:undefined}))

var Eval=function(x,env) {
    env=env||Gev
    var i
    if(typeof(x)==='string'){
        return env.find(x.valueOf())[x.valueOf()];
    }   
    else if (typeof(x)==='number'){
        return x
    }   
    else if(x[0]==='if'){
        var [test,conseq,alt]=x.slice(1)
        if(Eval(test,env)==true)
            return Eval(conseq,env)
        else
             return Eval(alt,env)
        }
        else if(x[0]==='define'){
            env[x[1]]=Eval(x[2],env)
        }
        else if(x[0]==='lambda'){
            var [parm,exp]=x.slice(1)
            return function(){
                return Eval(exp,newenv({parms:parm,args:arguments,globl:env}))
            }

        }
        else{
            var argp=[]
           // console.log(Eval(x[0],env))
           for(i=0;i<x.length;i+=1){
                argp[i]=Eval(x[i],env);
            }
           var proc=argp.shift()
           return proc.apply(env,argp)
           
        }

   
}


//<--------------------------------------------------------------------------------->//

program = "(define de (lambda (x) ( if(= x 1) 1 (* x (de (- x 1))))))"
Eval(parse(program))
console.log(Eval(parse('(de 6)')))
