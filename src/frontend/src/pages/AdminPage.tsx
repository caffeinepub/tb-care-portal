import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Copy, Link, LogIn, Plus, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGenerateInviteCode,
  useGetInviteCodes,
  useIsCurrentUserAdmin,
} from "../hooks/useQueries";

const SHARE_URL = "https://tb-care-portal-uqm.caffeine.xyz/";

function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      data-ocid="admin.copy_link_button"
      className="shrink-0 gap-1.5"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-600" /> Copied!
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" /> Copy Link
        </>
      )}
    </Button>
  );
}

export default function AdminPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsCurrentUserAdmin();
  const { data: codes, isLoading: codesLoading } = useGetInviteCodes();
  const generateMutation = useGenerateInviteCode();

  const [newUrl, setNewUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    await generateMutation.mutateAsync();
    setNewUrl(SHARE_URL);
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-[480px] mx-auto px-6 py-20 flex flex-col items-center">
        <Card className="w-full shadow-md" data-ocid="admin.card">
          <CardHeader className="items-center pb-2">
            <div className="bg-primary/10 rounded-full p-4 mb-3">
              <ShieldAlert className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-2">
            <p className="text-muted-foreground text-center text-sm">
              Sign in with your Internet Identity to access the admin dashboard.
            </p>
            <Button
              onClick={login}
              disabled={loginStatus === "logging-in"}
              data-ocid="admin.login_button"
              className="w-full gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loginStatus === "logging-in" ? "Signing in…" : "Login"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div
        className="max-w-[720px] mx-auto px-6 py-16 space-y-4"
        data-ocid="admin.loading_state"
      >
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-[480px] mx-auto px-6 py-20 flex flex-col items-center">
        <Card
          className="w-full shadow-md border-destructive/40"
          data-ocid="admin.error_state"
        >
          <CardHeader className="items-center pb-2">
            <div className="bg-destructive/10 rounded-full p-4 mb-3">
              <ShieldAlert className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-destructive">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center text-sm">
              Your account does not have admin privileges. Contact the system
              administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-6 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage invite links for the TB Care Portal.
        </p>
      </div>

      {/* Generate section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Generate Invite Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            data-ocid="admin.generate_link_button"
            className="gap-2"
          >
            <Link className="w-4 h-4" />
            {generateMutation.isPending ? "Generating…" : "Generate New Link"}
          </Button>

          {newUrl && (
            <div
              data-ocid="admin.success_state"
              className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2"
            >
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                New Invite Link Created
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <code className="flex-1 min-w-0 bg-white border border-green-200 rounded-lg px-3 py-2 text-sm font-mono text-green-800 break-all">
                  {newUrl}
                </code>
                <CopyLinkButton url={newUrl} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite codes list */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Link className="w-5 h-5 text-primary" />
            All Invite Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          {codesLoading ? (
            <div className="space-y-3" data-ocid="admin.list_loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !codes || codes.length === 0 ? (
            <div
              data-ocid="admin.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <Link className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                No invite links yet. Generate your first one above.
              </p>
            </div>
          ) : (
            <ul className="space-y-3" data-ocid="admin.list">
              {codes.map((item, idx) => (
                <li
                  key={item.code}
                  data-ocid={`admin.item.${idx + 1}`}
                  className="flex items-center gap-3 flex-wrap bg-muted/40 border border-border rounded-xl px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5 font-medium">
                      Share URL
                    </p>
                    <code className="text-sm font-mono text-foreground break-all">
                      {SHARE_URL}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={item.used ? "secondary" : "default"}
                      className={
                        item.used
                          ? ""
                          : "bg-green-600 hover:bg-green-600 text-white"
                      }
                    >
                      {item.used ? "Used" : "Available"}
                    </Badge>
                    <CopyLinkButton url={SHARE_URL} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
