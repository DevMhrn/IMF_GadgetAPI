import Auth from "../components/Auth"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

const Login = () => {
  return (
    <div className="dashboard-bg min-h-screen flex items-center justify-center p-4">
      <div className="scanner-line-horizontal" />
      <div className="scanner-line-vertical" />
      
      <Card className="w-full max-w-md bg-black/85 backdrop-blur-lg border border-[#00ff00]/30">
        <CardHeader className="space-y-1 text-center border-b border-[#00ff00]/20 pb-4">
          <CardTitle className="mission-title text-2xl">
            IMF SECURE LOGIN
          </CardTitle>
          <p className="text-sm text-[#00ff00]/70 animate-pulse-slow">
            AUTHENTICATION REQUIRED
          </p>
        </CardHeader>
        <CardContent className="mt-4">
          <Auth />
        </CardContent>
      </Card>
      
      <div className="cyberpunk-overlay" />
    </div>
  )
}

export default Login
