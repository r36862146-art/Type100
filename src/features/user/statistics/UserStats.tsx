import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UserStats() {
  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Statistics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-primary/5 text-center">
            <p className="text-3xl font-bold text-primary">45</p>
            <p className="text-sm text-muted-foreground mt-1">Avg. WPM</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 text-center">
            <p className="text-3xl font-bold text-primary">96%</p>
            <p className="text-sm text-muted-foreground mt-1">Avg. Accuracy</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 text-center">
            <p className="text-3xl font-bold text-primary">12h</p>
            <p className="text-sm text-muted-foreground mt-1">Total Time</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 text-center">
            <p className="text-3xl font-bold text-primary">140</p>
            <p className="text-sm text-muted-foreground mt-1">Sessions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
