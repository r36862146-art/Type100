import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export function UserProfile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Fetch profile
      supabase.from('user_profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name || '');
          setCountry(data.country || '');
        }
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    await supabase.from('user_profiles').update({
      display_name: displayName,
      country: country,
    }).eq('id', user.id);
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input value={user?.email || ''} disabled />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Display Name</label>
          <Input 
            value={displayName} 
            onChange={(e) => setDisplayName(e.target.value)} 
            placeholder="John Doe" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <Input 
            value={country} 
            onChange={(e) => setCountry(e.target.value)} 
            placeholder="United States" 
          />
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
      </CardContent>
    </Card>
  );
}
