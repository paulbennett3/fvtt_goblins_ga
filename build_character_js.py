import os


TRAIT = []
with open('creation.txt') as infile:
    rows = infile.readlines()

    for row in rows:
        row = row.strip()
        key, value = row.split("|", 2)
        TRAIT.append('    %s: %s' % (key, value))

TRAIT = 'let traits = {\n%s\n}' % (',\n'.join(TRAIT))

with open('build_character_js.TEMPLATE') as infile, open('build_character.js', 'wt') as out:
    for row in infile.readlines():
        row = row.replace('TRAITS_HERE', TRAIT)
        out.write(row)
