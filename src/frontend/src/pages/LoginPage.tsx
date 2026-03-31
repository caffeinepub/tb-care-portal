import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import { LogIn, Mail, UserPlus } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;

  if (isLoggedIn) {
    return (
      <div className="max-w-[480px] mx-auto px-6 py-20 flex flex-col items-center">
        <Card className="w-full shadow-md" data-ocid="login.card">
          <CardHeader className="items-center pb-2">
            <div className="bg-primary/10 rounded-full p-4 mb-3">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              You are logged in
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-2">
            <p className="text-muted-foreground text-center text-sm">
              You are already signed in. View your questionnaire results and
              patient records.
            </p>
            <Link to="/results" className="w-full">
              <Button className="w-full gap-2" data-ocid="login.primary_button">
                View Results
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[500px] mx-auto px-6 py-16 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          TB Questionnaire Portal
        </h1>
        <p className="text-muted-foreground text-sm">
          Sign in or create an account to access patient data and results.
        </p>
      </div>

      <Card className="w-full shadow-md" data-ocid="login.card">
        <CardContent className="pt-6">
          <Tabs defaultValue="login">
            <TabsList
              className="grid grid-cols-2 w-full mb-6"
              data-ocid="login.tab"
            >
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full p-4 w-fit mx-auto mb-4">
                  <LogIn className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-1">Welcome Back</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Sign in securely using Internet Identity — no passwords
                  required.
                </p>
              </div>
              <Button
                onClick={login}
                disabled={loginStatus === "logging-in"}
                className="w-full gap-2"
                data-ocid="login.primary_button"
              >
                <LogIn className="w-4 h-4" />
                {loginStatus === "logging-in"
                  ? "Signing in…"
                  : "Sign In with Internet Identity"}
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full p-4 w-fit mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-1">Create Account</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Create a secure identity using Internet Identity. No email or
                  password needed — your identity is cryptographically secured.
                </p>
              </div>
              <Button
                onClick={login}
                disabled={loginStatus === "logging-in"}
                className="w-full gap-2"
                variant="outline"
                data-ocid="login.secondary_button"
              >
                <UserPlus className="w-4 h-4" />
                {loginStatus === "logging-in"
                  ? "Opening…"
                  : "Create Account with Internet Identity"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Clicking above will open the Internet Identity portal. If you
                don't have an identity yet, you can create one there.
              </p>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="w-3.5 h-3.5" />
            <span>Support: </span>
            <a
              href="mailto:sonuamikumar@gmail.com"
              className="hover:text-primary transition-colors underline underline-offset-2"
            >
              sonuamikumar@gmail.com
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
