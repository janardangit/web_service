class spam:
    numinsta = 0
    def __init__(self):
        spam.numinsta = spam.numinsta + 1
    #def printnuminsta():
    #    print "num instant = ",spam.numinsta
    def printnuminsta(cls):
        print "num instant = ",cls.numinsta

    #printnuminsta = staticmethod(printnuminsta)
    printnuminsta = classmethod(printnuminsta)

x = spam()
#y = spam()
spam.printnuminsta()
x.printnuminsta()
