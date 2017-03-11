infile = open("text.txt", "r")
L = []
for line in infile:
    L.append(tuple(line.strip().split(":")))
infile.close()
outfile = open("converted.txt", "w")
outfile.write(str(L))
outfile.close()
