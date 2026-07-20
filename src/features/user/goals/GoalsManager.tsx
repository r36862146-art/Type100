import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function GoalsManager() {
  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>My Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-semibold">Daily Practice</p>
              <p className="text-sm text-muted-foreground">Practice for 30 minutes every day.</p>
            </div>
            <Button variant="outline">Edit Goal</Button>
          </div>
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-semibold">Reach 40 WPM</p>
              <p className="text-sm text-muted-foreground">Target WPM for Exam readiness.</p>
            </div>
            <Button variant="outline">Edit Goal</Button>
          </div>
          <Button className="mt-4">Create New Goal</Button>
        </div>
      </CardContent>
    </Card>
  );
}
