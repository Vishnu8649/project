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

    return str.replace(/[(_]/g,' ( ').replace(/[)_]/g,' ) ').trim().split(/\ +/);
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
        return String(token)
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


Env=Object
var stdEnv=function(){
    env=Env()
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

    Object.assign(env,{ 'sin':Math.sin,'cos':Math.cos,'tan':Math.tan,'pow':Math.pow,
                        'log':Math.log,'pi':3.141592653589793,'abs':Math.abs,
                        'min':Math.min,'max':Math.max,'sqrt':Math.sqrt,'+':add,
                        '-':sub,'*':mul,'/':div,'<':lt,'>':gt,'=':eq,'>=':geq,
                        '<=':leq,'append':add,'begin':begin,'cdr':cdr,'car':car, 
                        'equal?':eq,'not':not, 'list':Array, 'cons':cons})

    return env

}


/*#####################################################################################
 
                            Evaluating the parsed program

        Input==>[ "begin", [ "*", 5, 6 ] ]
        Output==> returns 30

#####################################################################################*/

Gev=stdEnv()


var Eval=function(x,env){
    env=Gev
 
    if (typeof(x)=='number'){
        return x
    }   
    else if(Gev[x]!=undefined){
        return env[x]
    }   
    else if(typeof(x)=='object'){
        var args=[]
        if(x[0]=='if'){
            var [test,conseq,alt]=x.slice(1)
            if(Eval(test,env)==true)
                return Eval(conseq,env)
            else
                return Eval(alt,env)
        }
        else if(x[0]=='define'){
            var [Var,exp]=x.slice(1)
            v=Var
            e=Eval(exp,env)
            Gev[v]=e
        }
        else if(typeof(env[x[0]])=='function'){
            var proc=Eval(x[0],env)
            var i=1
            while(x[i]!=undefined){
    
                args.push(Eval(x[i],env))
                i=i+1
            }
        
            return proc.apply(this,args)
        }

    }
    else
        return x
    

}

//<--------------------------------------------------------------------------------->//

program = "(define de 200)"
p1='(cons 1 (cdr (list (* pi (* 5 de)) (* 2 de) 3 5.65 hai hello fine (list 2 hgsk isi))))'
Eval(parse(program))
console.log(Eval(parse(p1)))
