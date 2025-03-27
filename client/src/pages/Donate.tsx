
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { GlassCard } from '@/components/ui/glass-card';
import Particles from '@/components/animations/Particles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Coffee, CreditCard, Heart, DollarSign, Calendar, Lock } from 'lucide-react';

const DONATION_TIERS = [
  { id: 1, name: 'Supporter', amount: 5, description: 'Help us keep the lights on' },
  { id: 2, name: 'Friend', amount: 10, description: 'Support ongoing development' },
  { id: 3, name: 'Champion', amount: 25, description: 'Help us build new features' },
  { id: 4, name: 'Believer', amount: 50, description: 'Sponsor a major update' },
];

const Donate = () => {
  const [selectedTier, setSelectedTier] = React.useState<number | null>(null);
  const [customAmount, setCustomAmount] = React.useState<string>('');
  const [cardholderName, setCardholderName] = React.useState<string>('');
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);

  const handleTierSelect = (tierId: number) => {
    setSelectedTier(tierId);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setCustomAmount(value);
      setSelectedTier(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // In a real app, you'd handle success/error states and redirect
      alert('Thank you for your donation!');
    }, 2000);
  };

  const getDonationAmount = () => {
    if (selectedTier !== null) {
      const tier = DONATION_TIERS.find(t => t.id === selectedTier);
      return tier ? tier.amount : 0;
    }
    return customAmount ? parseFloat(customAmount) : 0;
  };

  return (
    <div className="min-h-screen overflow-hidden animated-gradient-bg">
      <Particles quantity={30} staticity={50} ease={50} />
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <span className="inline-flex items-center bg-primary/20 text-primary rounded-full px-3 py-1 text-xs font-medium mb-3">
              <Heart size={14} className="mr-1" /> Support ProgressorAI
            </span>
            <h1 className="text-3xl font-bold mb-3">Help Us Keep Building</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Your support enables us to continue developing ProgressorAI as a powerful tool 
              for productivity enhancement. Every contribution makes a difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="animate-fade-in">
              <GlassCard className="p-6 h-full">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Coffee size={18} className="mr-2 text-primary" />
                  Support Options
                </h2>
                <div className="space-y-3 mb-6">
                  {DONATION_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => handleTierSelect(tier.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors flex justify-between items-center ${
                        selectedTier === tier.id 
                          ? 'bg-primary/20 border border-primary/40' 
                          : 'bg-secondary/30 hover:bg-secondary/50 border border-transparent'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{tier.name}</div>
                        <div className="text-sm text-muted-foreground">{tier.description}</div>
                      </div>
                      <div className="text-lg font-bold text-primary">${tier.amount}</div>
                    </button>
                  ))}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm mb-2">Custom Amount</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="bg-primary/10 rounded-lg p-3 text-sm">
                  <p className="flex items-start">
                    <Heart size={16} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      All donations directly support development, server costs, and enable us to keep ProgressorAI accessible to everyone.
                    </span>
                  </p>
                </div>
              </GlassCard>
            </div>
            
            <div className="animate-fade-in">
              <GlassCard className="p-6 h-full">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <CreditCard size={18} className="mr-2 text-primary" />
                  Payment Details
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm mb-2">Cardholder Name</label>
                    <Input
                      id="name"
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="Name on card"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="card" className="block text-sm mb-2">Card Number</label>
                    <div className="relative">
                      <Input
                        id="card"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        required
                        maxLength={19}
                      />
                      <Lock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="expiry" className="block text-sm mb-2">Expiry Date</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="expiry"
                          type="text"
                          placeholder="MM/YY"
                          required
                          maxLength={5}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cvc" className="block text-sm mb-2">CVC</label>
                      <Input
                        id="cvc"
                        type="text"
                        placeholder="123"
                        required
                        maxLength={3}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Donation Amount:</span>
                      <span className="font-bold text-lg">${getDonationAmount().toFixed(2)}</span>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isProcessing || (selectedTier === null && !customAmount)}
                    >
                      {isProcessing ? 'Processing...' : 'Complete Donation'}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Secure payment processing. Your card information is never stored on our servers.
                  </p>
                </form>
              </GlassCard>
            </div>
          </div>
          
          <div className="text-center animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Other Ways to Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard className="p-5 hover:shadow-lg transition-all duration-300">
                <h3 className="font-medium mb-2">Spread the Word</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Help us by sharing ProgressorAI with your friends and colleagues.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Share on Social Media
                </Button>
              </GlassCard>
              
              <GlassCard className="p-5 hover:shadow-lg transition-all duration-300">
                <h3 className="font-medium mb-2">GitHub Sponsors</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Support our open-source efforts by becoming a GitHub sponsor.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Become a Sponsor
                </Button>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Donate;
