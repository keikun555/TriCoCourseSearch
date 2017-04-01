#!/bin/bash
PATH=/usr/sccs/bin:/usr/local/bin:/usr/bin:/sbin:/usr/sbin:/usr/bin/X11:/bin
semester='Fall_2017'

echo "------------------------------------------" >> ./updateLog.log
echo "Update for ${semester} has started" >> ./updateLog.log
echo "Started on: $(date)" >> ./updateLog.log
python ./web-docs/tricoScraper-min.pyc $semester >> ./updateLog.log 2>> &1
echo "Update for ${semester} has finished" >> ./updateLog.log
echo "Finished on: $(date)" >> ./updateLog.log
echo "" >> ./updateLog.log
