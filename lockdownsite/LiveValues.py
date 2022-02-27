from optparse import Values
import random

# Amount will be a value from 1 to 3, Direction will be "up", "down", "no" = 1, -1, 0


def ReturnValues(ValInit, Stock):

    if Stock == '':
        Stock = 'FordMotorCompany'

    time = 12 * 8

    def randomchange(amount, direction):
        if direction == 1:
            return random.randint(10 * 100, amount * 10 * 100) / 100
        if direction == -1:
            return random.randint((-1) * amount * 10 * 100, (-10) * 100) / 100
        if direction == 0:
            return random.randint((-1) * amount * 5 * 100, amount * 5 * 100) / 100

    def Company(start, variability, behaviour):
        values = [start]

        behaviour = [[D[0] - 1, D[1]] for D in behaviour]

        dir = [0 for x in range(time)]

        for i in range(time):
            if ((i // 3) + 1) in [D[0] for D in behaviour]:
                dir[i] = behaviour[[D[0]
                                    for D in behaviour].index((i // 3) + 1)][1]

        for x in range(1, time):
            amt = random.randint(1 * 10, variability * 10) / 10
            temp = values[x - 1] * (100 + randomchange(amt, dir[x])) / 100
            values.append(temp)

        return(values)

    FordMotorCompanyInitial = 118
    FacebookInitial = 210.48
    RoyalDutchShellInitial = 2004.50
    TeslaInitial = 809.87
    CoinbaseInitial = 176.83

    # For behaviour, in each list in the first dimention, the first element is the month and the second is the direction (0 - bad, 1 - good)

    FordMotorCompanyBehaviour = [[2, -1], [3, -1]]
    FacebookBehaviour = [[9, 1], [10, 1]]
    RoyalDutchShellBehaviour = [[4, -1], [7, 1], [8, 1]]
    TeslaBehaviour = [[4, 1], [5, 1], [6, 1], [10, 1], [11, 1]]
    CoinbaseBehaviour = [[5, -1], [6, -1], [12, -1]]

    FordMotorCompany = Company(
        FordMotorCompanyInitial, 3, FordMotorCompanyBehaviour)
    Facebook = Company(FacebookInitial, 3, FacebookBehaviour)
    RoyalDutchShell = Company(RoyalDutchShellInitial,
                              3, RoyalDutchShellBehaviour)
    Tesla = Company(TeslaInitial, 3, TeslaBehaviour)
    Coinbase = Company(CoinbaseInitial, 3, CoinbaseBehaviour)

    Bitcoin = Company(1, 9, [[6, 0]])
    Ethereum = Company(1, 9, [[6, 0]])

    def Indexed():
        amount = 200
        value = [amount]
        for z in range(1, time):
            PercentChanges = abs(FordMotorCompany[z] - FordMotorCompanyInitial) / FordMotorCompanyInitial * 100 + abs(Facebook[z] - FacebookInitial) / FacebookInitial * 100 + abs(
                RoyalDutchShell[z] - RoyalDutchShellInitial) / RoyalDutchShellInitial * 100 + abs(Tesla[z] - TeslaInitial) / TeslaInitial * 100 + abs(Coinbase[z] - CoinbaseInitial) / CoinbaseInitial * 100

            value.append((100 + PercentChanges) * value[0] / 100)

        return value

    IndexedFund = Indexed()

    def CondenseArray(BigArray, IntialLength, RequiredLength):
        Factor = int(IntialLength / RequiredLength)
        NewArray = []
        for x in range(0, RequiredLength, Factor):
            NewArray.append(BigArray[x + 2])

    FordMotorCompany = CondenseArray(FordMotorCompany, time, 48)
    Facebook = CondenseArray(Facebook, time, 12)
    RoyalDutchShell = CondenseArray(RoyalDutchShell, time, 12)
    Tesla = CondenseArray(Tesla, time, 12)
    Coinbase = CondenseArray(Coinbase, time, 12)
    Bitcoin = CondenseArray(Bitcoin, time, 12)
    Ethereum = CondenseArray(Ethereum, time, 12)
    IndexedFund = CondenseArray(IndexedFund, time, 12)

    values = (FordMotorCompany, Facebook, RoyalDutchShell,
              Tesla, Coinbase, Bitcoin, Ethereum, IndexedFund)

    Stocks = ['Ford Motor Co.', 'Meta Platforms Inc - Class A', 'Shell PLC - ADR (Representing)',
              'Tesla Inc', 'Coinbase Global Inc - Class A', 'FlameCoin(TM)', 'CheepCoin', 'BlotChing']

    ind = Stocks.index(Stock)

    return (values[ind][values[ind].index(ValInit) + 1])


random.seed(1)


def randomize_val(old_val, type):
    if type == "stock":
        factor = round(random.uniform(-4, 4), 3)
    elif type == "crypto":
        factor = round(random.uniform(-15, 10), 3)
    x = random.choice([1, 1, 1, 1, 1, -1, -1, -1, -1, -1])
    new_val = old_val + (old_val * factor/100)
    return round(new_val, 2)
