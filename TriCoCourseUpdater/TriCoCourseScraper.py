"""
Kei Imada
20161203
Gets data from TriCo Course Guide
"""
import lxml
from lxml import html
import requests
import getpass
import json
import os
import sys
import math

url = "https://trico.haverford.edu/cgi-bin/courseguide/cgi-bin/"
session_requests = requests.session()


def scrape():
  global url, session_requests
  print("Welcome to TriCoCourseScraper")
  urlStub = "search.cgi"
  load = {}
  result = session_requests.get(url + urlStub)
  header = dict(referer=url + urlStub)
  result = session_requests.post(
      url + urlStub,
      data=load,
      headers=header
  )
  tree = html.fromstring(result.text)
  semesters = tree.xpath('//input[@name="smstr"]/@value')
  campuses = tree.xpath('//input[@name="campus"]/@value')
  departments = tree.xpath('//select[@name="dept"]/option/@value')
  for semester in semesters:
    for campus in campuses:
      print("Getting data for %s in campus %s" % (semester, campus))
      courseList = []
      urlList = getCourseURLs(semester, campus, departments)
      for uStub in urlList:
        load = {}
        result = session_requests.get(url + uStub)
        header = dict(referer=url + uStub)
        result = session_requests.post(
            url + uStub,
            data=load,
            headers=header
        )
        tree = html.fromstring(result.text)
        for br in tree.xpath("*//br"):
          br.tail = "\n" + br.tail if br.tail else "\n"
        keys = tree.xpath('(//table[@border="1"])[1]//b/text()')
        valueParents = tree.xpath('(//table[@border="1"])[1]//tr/td[2]')
        values = []
        for parent in valueParents:
          values.append(parent.text_content().strip())
        courseDict = dict(zip(keys, values))
        # FORMAT ADDITIONAL COURSE INFO
        L = courseDict["Additional Course Info"].split("\n")
        for i in range(len(L)):
          L[i] = L[i].strip()
        updKey = []
        updVal = []
        if(courseDict["Campus"] == "Swarthmore"):
          try:
            courseDict.update({"CRN": L[0].split(" ")[1]})
          except:
            pass
          try:
            courseDict.update({"Description": L[1]})
          except:
            pass
        else:
          try:
            courseDict.update({"CRN": L[0].split(": ")[1]})
          except:
            pass
          try:
            courseDict.update({"Description": L[1]})
          except:
            pass
        assert(len(keys) == len(values))
        courseList.append(courseDict)
        displayProgressBar(len(courseList), len(urlList))
      path = ("./data/%s/%s.json" % (campus, semester))
      directory = os.path.dirname(path)
      if not os.path.exists(directory):
        os.makedirs(directory)
      outfile = open(path, "w")
      print("\nWriting data for %d courses to %s" % (len(courseList), path))
      json.dump(courseList, outfile)
      outfile.close()
  print("All processes complete")


def getCourseURLs(semester, campus, departments):
  """given semester, campus, and departments, get course titles in list form and return list of title lists"""
  global url, session_requests
  urlStub = "search.cgi"
  linkStubs = []
  load = {}
  param = [
      ("run_tot", "0"),
      ("smstr", semester),
      ("campus", campus)
  ]
  param.extend(zipper("dept", departments))
  param.extend([
      ("crsnum", ""),
      ("instr", ""),
      ("meetday", ""),
      ("srch_frz", ""),
      ("Search", "Search"),
      (".cgifields", "dept"),
      (".cgifields", "campus"),
      (".cgifields", "smstr"),
      (".cgifields", "meettime")
  ])
  run_tot = 0
  linkStubsTemp = ["temp"]
  while len(linkStubsTemp) > 0:
    param[0] = () + (param[0][0],) + (str(run_tot),)
    result = session_requests.get(url + urlStub)
    result = session_requests.get(
        url + urlStub,
        data=load,
        params=param,
        headers=dict(referer=url + urlStub)
    )
    tree = html.fromstring(result.text)
    linkStubsTemp = tree.xpath('//table[@border="2"]//a/@href')
    linkStubs.extend(linkStubsTemp)
    run_tot += 50
  return linkStubs


def displayProgressBar(current, total):
  """displays progress bar with given current state and total"""
  bar = "#" * int(50 * float(current) / float(total)) + " " * \
      int(50 - math.floor(50 * float(current) / float(total)))
  sys.stdout.write("\r0%% %s %%100 (%%%.2f)" %
                   (bar, float(current) / float(total) * 100))


def userInput(msg, kind):
  """
  given query and type, returns value with desired type
  """
  usrInp = raw_input(msg)
  try:
    return kind(usrInp)
  except:
    return userInput(msg, kind)


def zipper(name, L):
  """given name and L, returns zipped list with name:L[i]"""
  names = []
  for i in range(len(L)):
    names.append(name)
  return zip(names, L)
if __name__ == "__main__":
  scrape()
