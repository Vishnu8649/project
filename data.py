"""
This program inputs a file that coontains url names and retrieves those urls
and creates a dictionary and prints it
README:

Input file dont put '/' at end of urls it will be automatically added 

Created by Vishnu T

"""
import socket
import re
import sys
socket.setdefaulttimeout(600)
def host(url):#Function to extract hostname from url
	hostname=re.search(r'//([^/]+)/',url)
 	return hostname.group(1)
def path(url):#function to extract url path
	return re.search(r'//[^/]+(/\S*)',url).group(1)
def GET(url):#Function to create HTTP GET request
	return "GET "+path(url)+"/ HTTP/1.1"+"\r\n"+"Host: "+host(url) +"\r\n"+"User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:19.0) Gecko/20100101      Firefox/19.0"+"\r\n"+"\r\n"
def REQ(url):#This function retrieves data by passing the GET request to server
	s=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	s.connect((host(url),80))
	s.send(GET(url))
	
	rcv=''
	while True:
		data=s.recv(1024)
		if not data:
			print "retrieved", url
			break
		rcv=rcv+data
	data=rcv
	s.close()
	return data
def urldic(filename):#Dictionary creation
	f=open(filename,'r')        
	d=f.read().split()         
	dict={}
	for x in d:
		dict[x]=REQ(x)
	return dict

def main():
	if len(sys.argv)==2:#Argument should be exactly two ie python data.py "filename"
		d=urldic(sys.argv[1])
		print d
	else:
		print "invalid entry"		
if __name__=='__main__':
	main()
