import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Clock, Trophy, Ticket, Users, History, Bell, Sparkles, Zap, Award, ChevronDown, ChevronUp } from 'lucide-react';

export default function Component() {
  const [ticketAmount, setTicketAmount] = useState<number[]>([0.1]);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 23, minutes: 45, seconds: 0 });
  const [currentPot, setCurrentPot] = useState(100.5);
  const [participants, setParticipants] = useState(145);
  const [isAutoRenew, setIsAutoRenew] = useState(false);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [activeTickets, setActiveTickets] = useState<Array<{ id: string; time: string; amount: number }>>([]);
  const [showAllTickets, setShowAllTickets] = useState(false);
  
  const MIN_AMOUNT = 0.1;
  const MAX_AMOUNT = 50;
  const TICKET_PRICE = 0.1;

  const [previousWinners] = useState([
    { drawId: 3, pubkey: 'HPz2wx...9uMp', amount: '70.5', place: 1 },
    { drawId: 3, pubkey: 'KLm5ns...2vNk', amount: '20.1', place: 2 },
    { drawId: 3, pubkey: 'JWp7qr...5tXy', amount: '10.2', place: 3 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        updateCountdown();
      } catch (error) {
        console.error('Error updating countdown:', error);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateCountdown = () => {
    setTimeRemaining(prev => {
      const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
      if (totalSeconds <= 0) return { hours: 23, minutes: 59, seconds: 59 };
      
      return {
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60
      };
    });
  };

  const connectWallet = () => {
    const mockAddress = 'BKj92n5WKHMvSR7tbaJ9qG9hXjWu2YpVXP';
    setWalletAddress(mockAddress);
    setConnected(true);
  };

  const buyTickets = () => {
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const amount = ticketAmount[0];
      if (typeof amount !== 'number' || isNaN(amount)) {
        throw new Error('Invalid ticket amount');
      }
      const ticketCount = Math.floor(amount / TICKET_PRICE);
      setCurrentPot(prev => prev + amount);
      setParticipants(prev => prev + ticketCount);
      setPurchaseSuccess(true);
      setTimeout(() => setPurchaseSuccess(false), 3000);
      setTicketAmount([MIN_AMOUNT]);

      const newTickets = Array.from({ length: ticketCount }, (_, i) => ({
        id: `...${Math.floor(Math.random() * 10000)}`,
        time: 'Just now',
        amount: TICKET_PRICE
      }));
      setActiveTickets(prev => [...newTickets, ...prev]);
    } catch (error) {
      console.error('Error buying tickets:', error);
      alert('Failed to purchase tickets');
    }
  };

  const toggleAutoRenew = () => {
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }
    setIsAutoRenew(prev => !prev);
  };

  const formatTimeUnit = (unit) => unit.toString().padStart(2, '0');

  const getTicketCount = (amount) => Math.floor(amount / TICKET_PRICE);

  const getPrizeDistribution = () => {
    const firstPrize = currentPot * 0.7;
    const secondPrize = currentPot * 0.2;
    const thirdPrize = currentPot * 0.1;
    return { firstPrize, secondPrize, thirdPrize };
  };

  const formatNumber = (num: number) => {
    if (isNaN(num)) return '0.00';
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };

  const getTotalInvested = () => activeTickets.reduce((sum, ticket) => sum + ticket.amount, 0);

  const getWinChance = () => {
    const totalTickets = participants + activeTickets.length;
    if (totalTickets === 0) return '0.0';
    return ((activeTickets.length / totalTickets) * 100).toFixed(1);
  };

  const toggleShowAllTickets = () => {
    setShowAllTickets(prev => !prev);
  };

  const displayedTickets = showAllTickets ? activeTickets : activeTickets.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-violet-900 px-4 py-6 md:py-8">
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Header with Logo and Wallet Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-purple-500 to-blue-500 rounded-2xl transform rotate-12 flex items-center justify-center shadow-lg overflow-hidden">
                <div className="w-full h-full bg-black/30 flex items-center justify-center transform -rotate-12">
                  <Zap className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <div className="font-extrabold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-purple-300 to-blue-400 tracking-tight">
                SolStrike
              </div>
              <div className="text-sm text-white/70 font-medium tracking-wide uppercase">
                Next-Gen Lotto
              </div>
            </div>
          </div>
          <Button 
            onClick={connectWallet} 
            disabled={connected}
            className="bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500 hover:opacity-90 transition-opacity shadow-lg w-full sm:w-auto"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {connected ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
          </Button>
        </div>

        {/* Main Prize Pool Card */}
        <Card className="bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-xl md:text-3xl font-bold flex items-center gap-2">
              <Trophy className="w-8 h-8" />
              Current Prize Pool
            </CardTitle>
            <CardDescription className="text-white/90">Win big in the next draw!</CardDescription>
          </CardHeader>
          <CardContent className="text-white">
            <div className="text-center mb-8">
              <div className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-200">
                {formatNumber(currentPot)} SOL
              </div>
              <div className="text-lg md:text-xl text-white/80 mt-2">
                ≈ ${formatNumber(currentPot * 100)} USD
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-black/20 rounded-xl p-4">
              <div className="text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-sm text-yellow-400">1st Prize</div>
                <div className="font-bold text-lg md:text-xl">{formatNumber(getPrizeDistribution().firstPrize)} SOL</div>
              </div>
              <div className="text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <div className="text-sm text-gray-300">2nd Prize</div>
                <div className="font-bold text-lg md:text-xl">{formatNumber(getPrizeDistribution().secondPrize)} SOL</div>
              </div>
              <div className="text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-amber-700" />
                <div className="text-sm text-amber-700">3rd Prize</div>
                <div className="font-bold text-lg md:text-xl">{formatNumber(getPrizeDistribution().thirdPrize)} SOL</div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="text-center flex-1">
                <Clock className="mx-auto mb-2 w-6 h-6 md:w-8 md:h-8" />
                <div className="text-2xl md:text-3xl font-bold">
                  {formatTimeUnit(timeRemaining.hours)}:{formatTimeUnit(timeRemaining.minutes)}:{formatTimeUnit(timeRemaining.seconds)}
                </div>
                <p className="text-sm text-white/60">Time Remaining</p>
              </div>
              <div className="text-center flex-1">
                <Users className="mx-auto mb-2 w-6 h-6 md:w-8 md:h-8" />
                <div className="text-2xl md:text-3xl font-bold">{participants}</div>
                <p className="text-sm text-white/60">Total Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buy Tickets Section */}
        <Card className="bg-white/10 border border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Ticket className="w-6 h-6" />
              Buy Tickets
            </CardTitle>
            <CardDescription className="text-white/80">Each ticket costs {TICKET_PRICE} SOL</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{getTicketCount(ticketAmount[0])}</span>
                </div>
                <div className="mt-2 text-white/80">Tickets</div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Slider
                value={ticketAmount}
                onValueChange={setTicketAmount}
                min={MIN_AMOUNT}
                max={MAX_AMOUNT}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-white/60">
                <span>{MIN_AMOUNT} SOL</span>
                <span>{MAX_AMOUNT} SOL</span>
              </div>
              <div className="text-center text-white">
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-blue-400">
                  {ticketAmount[0].toFixed(1)} SOL
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              className="w-full max-w-xs bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500 hover:opacity-90 transition-opacity shadow-lg text-lg py-6"
              disabled={!connected || ticketAmount[0] < MIN_AMOUNT}
              onClick={buyTickets}
            >
              {purchaseSuccess ? '🎉 Tickets Purchased! 🎉' : 'Buy Tickets Now'}
            </Button>
          </CardFooter>
        </Card>

        {/* Active Tickets Section */}
        <Card className="bg-white/10 border border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Ticket className="w-6 h-6" />
              Your Active Tickets
            </CardTitle>
            <CardDescription className="text-white/80">
              {connected ? 'Your tickets for the current draw' : 'Connect wallet to view your tickets'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connected ? (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <p className="text-sm text-white/60">Total Tickets</p>
                    <p className="text-2xl font-bold text-white">{activeTickets.length}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <p className="text-sm text-white/60">Total Invested</p>
                    <p className="text-2xl font-bold text-white">{formatNumber(getTotalInvested())} SOL</p>
                  </div>
                
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <p className="text-sm text-white/60">Win Chance</p>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-400">{getWinChance()}%</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <p className="text-sm text-white/60">Potential Win</p>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-400">
                      {formatNumber(getPrizeDistribution().firstPrize)} SOL
                    </p>
                  </div>
                </div>

                {/* Ticket List */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/60 px-4">
                    <span>Ticket ID</span>
                    <span>Purchase Time</span>
                  </div>
                  {displayedTickets.map((ticket, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500 flex items-center justify-center">
                          <Ticket className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">Ticket {ticket.id}</p>
                          <p className="text-sm text-white/60">{ticket.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">{ticket.amount} SOL</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show More/Less Button */}
                {activeTickets.length > 3 && (
                  <Button
                    onClick={toggleShowAllTickets}
                    variant="outline"
                    className="w-full mt-4 bg-white/10 text-white hover:bg-white/20"
                  >
                    {showAllTickets ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Show All ({activeTickets.length} tickets)
                      </>
                    )}
                  </Button>
                )}

                {/* No Tickets State */}
                {activeTickets.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <Ticket className="w-8 h-8 text-white/40" />
                    </div>
                    <p className="text-white/60">You don't have any active tickets</p>
                    <p className="text-sm text-white/40">Purchase tickets above to participate in the current draw</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-8 h-8 text-white/40" />
                </div>
                <p className="text-white/60">Connect your wallet to view tickets</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Auto-Renew Section */}
        <Card className="bg-white/10 border border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Auto-Renew Subscription</CardTitle>
            <CardDescription className="text-white/80">Automatically buy tickets for each draw</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white">
                <Bell className="w-4 h-4" />
                <span>Auto-renew participation</span>
              </div>
              <Switch
                checked={isAutoRenew}
                onCheckedChange={toggleAutoRenew}
                disabled={!connected}
              />
            </div>
          </CardContent>
        </Card>

        {/* Previous Winners */}
        <Card className="bg-white/10 border border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Previous Winners</CardTitle>
            <CardDescription className="text-white/80">Recent lottery results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previousWinners.map((winner, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                >
                  <div>
                    <p className="font-bold text-white">Draw #{winner.drawId}</p>
                    <p className="text-sm text-white/60">{winner.pubkey}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{winner.amount} SOL</p>
                    <p className="text-sm text-white/60">{winner.place}st Place</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
