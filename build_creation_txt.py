import os

with open('creation_item_names.txt') as infile, open('creation.txt', 'wt') as out:
    rows = infile.readlines()

    for row in rows:
        row = row.strip()
        out.write('"%s"|{}\n' % row)

