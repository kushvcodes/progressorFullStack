
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/providers/AuthProvider';
import { Separator } from '@/components/ui/separator';
import { Shield, Bell, User, Settings, Key, Clock, LogOut, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(160, {
    message: "Bio must not be longer than 160 characters.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const defaultValues: Partial<ProfileFormValues> = {
    name: user?.name || 'User',
    email: user?.email || 'user@example.com',
    bio: 'I love using ProgressorAI to stay organized and productive!',
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = (data: ProfileFormValues) => {
    // In a real app, this would call an API
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleAvatarUpload = () => {
    // This would be implemented with a file input and API call in a real app
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen animated-gradient-bg">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 sticky top-24">
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                    <AvatarFallback className="text-xl">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div 
                    className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    onClick={handleAvatarUpload}
                  >
                    <Upload className="text-white" size={20} />
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-medium">{user?.name || "User"}</h2>
                <p className="text-sm text-muted-foreground">{user?.email || "user@example.com"}</p>
              </div>
              
              <nav className="space-y-1">
                <ProfileNavLink icon={User} label="Account" active />
                <ProfileNavLink icon={Bell} label="Notifications" />
                <ProfileNavLink icon={Shield} label="Privacy" />
                <ProfileNavLink icon={Key} label="Security" />
                <ProfileNavLink icon={Settings} label="Preferences" />
                <Separator className="my-2" />
                <button 
                  onClick={logout}
                  className="flex items-center gap-3 w-full p-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </button>
              </nav>
            </GlassCard>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="account">
              <TabsList className="mb-6">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <GlassCard className="p-6">
                  <h3 className="text-xl font-medium mb-6">Personal Information</h3>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Briefly describe yourself. This will be visible to other users.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Save Changes</Button>
                    </form>
                  </Form>
                </GlassCard>
                
                <GlassCard className="p-6 mt-6">
                  <h3 className="text-xl font-medium mb-6">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">API Access</h4>
                        <p className="text-sm text-muted-foreground">Allow third-party applications to access your data</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </GlassCard>
              </TabsContent>
              
              <TabsContent value="notifications">
                <GlassCard className="p-6">
                  <h3 className="text-xl font-medium mb-6">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive updates about your tasks via email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Push Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Task Reminders</h4>
                        <p className="text-sm text-muted-foreground">Get reminders about upcoming tasks</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </GlassCard>
              </TabsContent>
              
              <TabsContent value="integrations">
                <GlassCard className="p-6">
                  <h3 className="text-xl font-medium mb-6">Connected Services</h3>
                  <p className="text-muted-foreground mb-4">Connect your ProgressorAI account with these services to enhance your productivity</p>
                  <div className="space-y-4">
                    <IntegrationItem
                      name="Google Calendar"
                      description="Sync your tasks with Google Calendar"
                      connected={true}
                    />
                    <IntegrationItem
                      name="Slack"
                      description="Get notifications and updates in Slack"
                      connected={false}
                    />
                    <IntegrationItem
                      name="GitHub"
                      description="Link tasks to GitHub issues and PRs"
                      connected={false}
                    />
                  </div>
                </GlassCard>
              </TabsContent>
              
              <TabsContent value="subscription">
                <GlassCard className="p-6">
                  <h3 className="text-xl font-medium mb-6">Your Subscription</h3>
                  <div className="p-4 mb-6 bg-primary/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-primary">Free Plan</h4>
                        <p className="text-sm text-muted-foreground">Basic features with limited usage</p>
                      </div>
                      <Button>Upgrade Plan</Button>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mb-4">Available Plans</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GlassCard className="p-4">
                      <h5 className="font-medium">Pro Plan</h5>
                      <p className="text-xl font-bold my-2">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                      <p className="text-sm text-muted-foreground mb-4">Unlimited tasks and advanced features</p>
                      <Button variant="outline" className="w-full">Choose Plan</Button>
                    </GlassCard>
                    <GlassCard className="p-4">
                      <h5 className="font-medium">Team Plan</h5>
                      <p className="text-xl font-bold my-2">$19.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                      <p className="text-sm text-muted-foreground mb-4">Collaboration features for teams</p>
                      <Button variant="outline" className="w-full">Choose Plan</Button>
                    </GlassCard>
                  </div>
                </GlassCard>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

interface ProfileNavLinkProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const ProfileNavLink: React.FC<ProfileNavLinkProps> = ({ icon: Icon, label, active }) => {
  return (
    <button 
      className={`flex items-center gap-3 w-full p-2 rounded-md text-sm font-medium ${
        active 
          ? 'bg-primary/10 text-primary' 
          : 'text-muted-foreground hover:bg-secondary/50'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
};

interface IntegrationItemProps {
  name: string;
  description: string;
  connected: boolean;
}

const IntegrationItem: React.FC<IntegrationItemProps> = ({ name, description, connected }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
      <div>
        <h4 className="font-medium">{name}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button variant={connected ? "outline" : "default"}>
        {connected ? "Disconnect" : "Connect"}
      </Button>
    </div>
  );
};

export default Profile;
