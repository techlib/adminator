import ply.lex as lex


class CfgLexerError(Exception):
    def __init__(self, text, line, position, symbol):
        self.text = text
        self.line = line
        self.position = position
        self.symbol = symbol

    def __str__(self):
        return repr('{}, symbol \'{}\', line {}, position {}'.format(self.text, self.symbol, self.line, self.position))


class CfgLexer(object):
    tokens = (
        'SUBLEVEL',
        #~ 'SUBSUBLEVEL',
        'TOPLEVEL',
        'SEPARATOR',
        'RETURN',
    )
    # t_SUBLEVEL = r'\s\S.*'
    t_SUBLEVEL = r'(\ +\S+)+'
    #~ t_SUBSUBLEVEL = r'\s\s\S.*'
    t_SEPARATOR = r'\#.*'
    t_TOPLEVEL = r'([^\#\s]).*'

    def t_RETURN(self, t):
        r'return'
        return t

    def t_newline(self, t):
        r'(\ *\n)+'
        t.lexer.lineno += len(t.value)

    # Error handling rule
    def t_error(self, t):
        raise CfgLexerError('Illegal character', t.lexer.lineno, t.lexer.lexpos, t.value[0])
        t.lexer.skip(1)

    def test(self, data):
        print("test")
        self.lexer.input(data)
        while True:
            tok = self.lexer.token()
            if tok:
                print(tok)
            else:
                break

    def tokenize(self, data):
        #~ 'Debug method!'
        self.lexer.input(data)
        while True:
            tok = self.lexer.token()
            if tok:
                yield tok
            else:
                break

    def __init__(self):
        self.lexer = lex.lex(module=self)
