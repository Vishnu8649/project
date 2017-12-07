'''

Python web server using socket programming

                        Done By
                                Vishnu T

<RUN THIS PROGRAM USING python 2>

<You can access data in the same folder of server >

<client can access using address 


"http://localhost:8887/filename"

in curl also

in telnet use

GET /filename

>



'''
import socket
import os,os.path,time

def server():               #server and multiclient handling
    HOST, PORT = '', 8887
    nos= 6
    listen_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listen_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    listen_socket.bind((HOST, PORT))
    listen_socket.listen(nos)
    print 'Serving HTTP on port %s ...' % PORT
    while True:
        client, client_address = listen_socket.accept()
        newp=os.fork()
        if newp==0:
            listen_socket.close()
            handler(client)
            client.close()
            os._exit(0)
        else:
            client.close()



def handler(client):         #file handler
        ctype={'pdf':'application/pdf',
                'jpg':'image/jpg',
                'jpeg':'image/jpeg',
                'png':'image/png',
                'gif':'image/gif',
                'html':'text/html',
                'txt':'text/plain'}
        
        request = client.recv(1024)
        l=request.split()
        fname=l[1].split('/')[1]
        if fname.split('.')[-1] in ctype.keys():
            flag=True
            c=ctype[fname.split('.')[-1]]
            if os.path.isfile(fname):
                f=open(fname,'rb')
                d=f.read()
            else:
                flag=False
        else:
            flag=False
        if flag:
            print request
            client.send('HTTP/1.1 200 OK\r\n') 
            client.send('Accept-Ranges: bytes\r\n')
            client.send('Content-Type: '+c+'\r\n')
            client.send('Content-Length:'+str(len(d))+'\r\n\r\n')
            client.send(d)
            f.close()
            client.close()
        else:
            d='''HTTP/1.1 404 File Not Found\r\n\r\n
                <html><body><h1> Error 404 File not found<body><html>'''
            client.send(d)
            client.close()
server()

