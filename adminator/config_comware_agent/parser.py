import ply.yacc as yacc

from .lexer import CfgLexer

class CfgParserError(Exception):
    def __init__(self, text, parser_info):
        self.text = text
        self.parser_info = parser_info

    def __str__(self):
        return repr('{}, pasring info: \'{}\''.format(self.text, self.parser_info))


class CfgParser(object):
    def p_start_separator_absblock(self, p):
        'start : separator absblock'
        p[0] = p[2]

    def p_absblock_block_separator(self, p):
        'absblock : block separator'
        p[0] = p[1]

    def p_absblock_subblock_separator(self, p):
        'absblock : subblock separator'
        name = "syscfg"
        parts = p[1][0].split()
        for part in parts:
            if part != 'undo':
                name=part
                break
        p[0] = (name, p[1], True)

    def p_absblock_absblock_absblock(self, p):
        'absblock : absblock absblock'
        if type(p[1]) is list:
            if type(p[2]) is list:
                p[0] = p[1] + p[2]
            else:
                p[0] = p[1]
                p[0].append(p[2])
        else:
            if type(p[2]) is list:
                p[0] = [p[1],] + p[2]
            else:
                p[0] = [p[1], p[2]]

    def p_block_block_block(self, p):
        'block : block block'
        if type(p[1]) is list:
            if type(p[2]) is list:
                p[0] = p[1] + p[2]
            else:
                p[0] = p[1]
                p[0].append(p[2])
        else:
            if type(p[2]) is list:
                p[0] = [p[1],] + p[2]
            else:
                p[0] = [p[1], p[2]]

    def p_block_toplevel(self, p):
        'block : TOPLEVEL'
        p[0] = (p[1], [], False)

    def p_block_toplevel_subblock(self, p):
        'block : TOPLEVEL subblock'
        p[0] = (p[1], p[2], False)

    def p_subblock_subblock_sublevel(self, p):
        'subblock : subblock SUBLEVEL'
        p[0] = p[1]
        p[0].append(p[2][1:])

    def p_subblock_sublevel(self, p):
        'subblock : SUBLEVEL'
        p[0] = [p[1][1:],]

    #~ def p_separator_separator_separatorloc(self, p):
        #~ 'separator : SEPARATOR SEPARATORLOC'
        #~ p[0] = p[1]

    #~ def p_separator_separatorloc_separator(self, p):
        #~ 'separator : SEPARATORLOC SEPARATOR'
        #~ p[0] = p[2]

    def p_separator_separator(self, p):
        'separator : SEPARATOR'
        p[0] = p[1]

    def p_separator_return(self, p):
        'separator : RETURN'
        p[0] = p[1]

    def p_separator_separator_separator(self, p):
        'separator : SEPARATOR SEPARATOR'
        p[0] = p[1]

    def p_separators(self, p):
        'separator : separator separator'
        p[0] = p[1]

    def p_error(self,p):
        raise CfgParserError('Parsing error', p)

    def __init__(self):
        self.lexer = CfgLexer()
        self.tokens = self.lexer.tokens
        self.parser = yacc.yacc(module=self, write_tables=0, debug=False)

    def parse(self,data):
        # if data:
        return self.parser.parse(data, self.lexer.lexer, 0, 0, None) if data else []
        # else:
        #     return []


if __name__ == '__main__':
    import requests
    from pprint import pprint
    r = requests.get('http://127.0.0.1:5000/fd5-1-1/config/')
    parser = CfgParser()
    conf = []
    for item in parser.parse(r.json()['configs']['1']):
        conf.append({'name': item[0], 'options': item[1], 'syscfg': item[2]})
    # pprint(list(filter(lambda i: i['syscfg'], conf)))
    # pprint(list(filter(lambda i: not i['syscfg'], conf)))
    pprint(list(filter(lambda i: i['name'].startswith('interface GigabitEthernet'), conf)))
