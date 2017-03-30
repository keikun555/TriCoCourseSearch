y=dict
O=zip
n=range
U=len
K=open
W=str
o=int
H=float
dp=raw_input
import lxml
from lxml import html
a=html.fromstring
import requests
h=requests.session
import getpass
import json
s=json.dump
import os
z=os.path
P=os.makedirs
import sys
q=sys.stdout
E=sys.argv
import math
v=math.floor
d="https://trico.haverford.edu/cgi-bin/courseguide/cgi-bin/"
p=h()
def Q(semester):
 global d,p
 g="search.cgi"
 u={}
 I=p.get(d+g)
 j=y(referer=d+g)
 I=p.post(d+g,data=u,headers=j)
 J=a(I.text)
 w=J.xpath('//input[@name="campus"]/@value')
 m=J.xpath('//select[@name="dept"]/option/@value')
 for b in w:
  print("Getting data for %s in campus %s"%(semester,b))
  B=[]
  l=f(semester,b,m)
  for L in l:
   u={}
   I=p.get(d+L)
   j=y(referer=d+L)
   I=p.post(d+L,data=u,headers=j)
   J=a(I.text)
   for br in J.xpath("*//br"):
    br.tail="\n"+br.tail if br.tail else "\n"
   C=J.xpath('(//table[@border="1"])[1]//b/text()')
   t=J.xpath('(//table[@border="1"])[1]//tr/td[2]')
   S=[]
   for R in t:
    S.append(R.text_content().strip())
   T=y(O(C,S))
   L=T["Additional Course Info"].split("\n")
   for i in n(U(L)):
    L[i]=L[i].strip()
   V=[]
   F=[]
   if(T["Campus"]=="Swarthmore"):
    try:
     T.update({"CRN":L[0].split(" ")[1]})
    except:
     pass
    try:
     T.update({"Description":L[1]})
    except:
     pass
   else:
    try:
     T.update({"CRN":L[0].split(": ")[1]})
    except:
     pass
    try:
     T.update({"Description":L[1]})
    except:
     pass
   assert(U(C)==U(S))
   B.append(T)
   k(U(B),U(l))
  A=("./data/%s/%s.json"%(b,semester))
  e=z.dirname(A)
  if not z.exists(e):
   P(e)
  c=K(A,"w")
  print("\nWriting data for %d courses to %s"%(U(B),A))
  s(B,c)
  c.close()
def f(semester,b,m):
 global d,p
 g="search.cgi"
 r=[]
 u={}
 X=[("run_tot","0"),("smstr",semester),("campus",b)]
 X.extend(t("dept",m))
 X.extend([("crsnum",""),("instr",""),("meetday",""),("srch_frz",""),("Search","Search"),(".cgifields","dept"),(".cgifields","campus"),(".cgifields","smstr"),(".cgifields","meettime")])
 N=0
 M=["temp"]
 while U(M)>0:
  X[0]=()+(X[0][0],)+(W(N),)
  I=p.get(d+g)
  I=p.get(d+g,data=u,params=X,headers=y(referer=d+g))
  J=a(I.text)
  M=J.xpath('//table[@border="2"]//a/@href')
  r.extend(M)
  N+=50
 return r
def k(current,total):
 x="#"*o(50*H(current)/H(total))+" "* o(50-v(50*H(current)/H(total)))
 q.write("\r0%% %s %%100 (%%%.2f)"%(x,H(current)/H(total)*100))
def D(msg,kind):
 G=dp(msg)
 try:
  return kind(G)
 except:
  return D(msg,kind)
def t(name,L):
 Y=[]
 for i in n(U(L)):
  Y.append(name)
 return O(Y,L)
if __name__=="__main__":
 for i in n(1,U(E)):
  Q(E[i])

