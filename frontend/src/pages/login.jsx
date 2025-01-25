import Auth from "../components/Auth"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </CardHeader>
        <CardContent>
          <Auth />
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
