import { Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Badge } from "web-app"
import { LightbulbIcon, SparklesIcon } from "lucide-react"

export function SolvePanel() {
  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Solve</CardTitle>
        <CardDescription>Answers go straight onto the board in blue.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button className="h-10">
          <SparklesIcon data-icon="inline-start" />
          Solve puzzle
        </Button>
        <Button variant="outline" className="h-10">
          <LightbulbIcon data-icon="inline-start" />
          Reveal one square
        </Button>
      </CardContent>
    </Card>
  )
}

export function WithActionAndFooter() {
  return (
    <Card className="w-[340px]">
      <CardHeader>
        <CardTitle>Daily puzzle</CardTitle>
        <CardDescription>A fresh medium puzzle every morning.</CardDescription>
        <CardAction>
          <Badge variant="secondary">Medium</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">32 givens · solved by 1,204 players today</p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button size="sm">Start puzzle</Button>
      </CardFooter>
    </Card>
  )
}
