"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation"; // <--- Import useSearchParams
import { toast } from "sonner";
import {
  User,
  Mail,
  Loader2,
  Shield,
  Bell,
  Palette,
  Camera,
  BellOff,
  Lock,
  Moon,
  AlertTriangle,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteAccountAction } from "@/app/actions/deleteUser";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  // 1. Get URL Search Params for Tab Switching
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Sync state if URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- DELETE STATE ---
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [isLoaded, user]);

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // --- HANDLERS ---
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await user.update({ firstName, lastName });
      await user.reload();
      router.refresh();
      toast.success("Profile updated");
    } catch (err: any) {
      if (err.errors?.[0]?.code === "form_param_unknown") {
        toast.error("Name Feature Disabled", {
          description: "Enable 'Name' in Clerk Dashboard.",
        });
      } else {
        toast.error("Update Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      await user.setProfileImage({ file });
      await user.reload();
      router.refresh();
      toast.success("Photo updated");
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE ACCOUNT") return;
    setIsDeleting(true);

    try {
      await deleteAccountAction();
      await signOut(() => router.push("/"));
      toast.success("Account deleted successfully");
    } catch (err) {
      console.error("Delete Error:", err);
      setIsDeleting(false);
      toast.error("Deletion Failed", {
        description: "Something went wrong. Please try signing in again first.",
      });
    }
  };

  const resetDeleteModal = () => {
    if (isDeleting) return;
    setIsDeleteOpen(false);
    setTimeout(() => {
      setDeleteStep(1);
      setDeleteInput("");
    }, 300);
  };

  // Helper to update URL when clicking tabs manually
  const onTabChange = (value: string) => {
    setActiveTab(value);
    router.replace(`/settings?tab=${value}`, { scroll: false });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-6xl mx-auto font-sans">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Settings
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      <Separator className="my-4" />

      {/* 2. Controlled Tabs Component */}
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="flex flex-col lg:flex-row gap-8"
      >
        {/* SIDEBAR */}
        <aside className="lg:w-[250px] flex-shrink-0">
          <div className="sticky top-20">
            <TabsList className="flex flex-row lg:flex-col justify-start h-auto w-full bg-transparent p-0 gap-2 overflow-x-auto lg:overflow-visible no-scrollbar">
              <TabsTrigger
                value="profile"
                className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-600 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 rounded-md transition-all hover:bg-gray-50/50"
              >
                <User className="mr-2 h-4 w-4" /> Profile
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-600 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 rounded-md transition-all hover:bg-gray-50/50"
              >
                <Shield className="mr-2 h-4 w-4" /> Account
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-600 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 rounded-md transition-all hover:bg-gray-50/50"
              >
                <Palette className="mr-2 h-4 w-4" /> Appearance
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-600 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 rounded-md transition-all hover:bg-gray-50/50"
              >
                <Bell className="mr-2 h-4 w-4" /> Notifications
              </TabsTrigger>
            </TabsList>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="flex-1 lg:max-w-2xl">
          {/* PROFILE */}
          <TabsContent
            value="profile"
            className="space-y-6 m-0 animate-in fade-in slide-in-from-right-4 duration-500"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Profile</h3>
              <p className="text-sm text-muted-foreground">
                This is how others will see you on the site.
              </p>
            </div>
            <Separator />
            <div className="flex items-center gap-6 py-4">
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="h-24 w-24 border border-gray-200">
                  <AvatarImage src={user.imageUrl} className="object-cover" />
                  <AvatarFallback className="text-2xl font-bold bg-gray-900 text-white">
                    {user.firstName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={() => fileInputRef.current?.click()}
                  className="h-9 font-medium border-gray-300"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    "Change Picture"
                  )}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-white border-gray-200 focus-visible:ring-black h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-white border-gray-200 focus-visible:ring-black h-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    value={user.primaryEmailAddress?.emailAddress}
                    disabled
                    className="pl-9 bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed h-10"
                  />
                </div>
              </div>
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-black hover:bg-gray-800 text-white font-bold h-10 px-8 rounded-lg shadow-lg shadow-black/10 transition-all active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* ACCOUNT */}
          <TabsContent
            value="account"
            className="space-y-6 m-0 animate-in fade-in slide-in-from-right-4 duration-500"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Account</h3>
              <p className="text-sm text-muted-foreground">
                Update account settings.
              </p>
            </div>
            <Separator />
            <Card className="border-red-100 bg-red-50/20 shadow-none overflow-hidden">
              <CardHeader className="bg-red-50/50 pb-4 border-b border-red-100">
                <div className="flex items-center gap-2 text-red-600 mb-1">
                  <AlertTriangle className="h-5 w-5" />
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">
                    Danger Zone
                  </CardTitle>
                </div>
                <CardDescription className="text-red-600/80 text-xs font-medium">
                  These actions are permanent and cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-sm font-bold text-gray-900">
                      Delete Account
                    </span>
                    <span className="block text-xs text-gray-500 mt-0.5">
                      Permanently remove your account and data.
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 font-bold shadow-sm"
                    onClick={() => setIsDeleteOpen(true)}
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* APPEARANCE */}
          <TabsContent
            value="appearance"
            className="space-y-6 m-0 animate-in fade-in slide-in-from-right-4 duration-500"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Appearance</h3>
              <p className="text-sm text-muted-foreground">
                Customize the look and feel of the dashboard.
              </p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-3 cursor-pointer group">
                <div className="relative h-32 rounded-xl bg-white border-2 border-black p-3 flex items-center justify-center shadow-lg transition-transform group-hover:-translate-y-1">
                  <div className="w-full h-full bg-gray-50 rounded border border-gray-200 flex flex-col gap-2 p-2">
                    <div className="h-2 w-1/3 bg-gray-200 rounded"></div>
                    <div className="flex-1 bg-white border border-gray-100 rounded shadow-sm"></div>
                  </div>
                  <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-black flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                  </div>
                </div>
                <span className="text-sm font-bold block text-center text-black">
                  Light
                </span>
              </div>
              <div className="relative space-y-3 opacity-80 cursor-not-allowed group">
                <div className="relative h-32 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-3 flex items-center justify-center shadow-inner overflow-hidden">
                  <div className="w-full h-full bg-gray-900/50 rounded border border-white/10 flex flex-col gap-2 p-2 blur-[2px]">
                    <div className="h-2 w-1/3 bg-gray-700 rounded"></div>
                    <div className="flex-1 bg-gray-800 border border-white/5 rounded"></div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px]">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-full mb-2">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-black font-bold text-[10px] tracking-widest uppercase"
                    >
                      Coming Soon
                    </Badge>
                  </div>
                </div>
                <span className="text-sm font-medium  text-center text-gray-500 flex items-center justify-center gap-2">
                  <Moon size={14} /> Dark
                </span>
              </div>
            </div>
          </TabsContent>

          {/* NOTIFICATIONS */}
          <TabsContent
            value="notifications"
            className="space-y-6 m-0 animate-in fade-in slide-in-from-right-4 duration-500"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Manage how you receive alerts and updates.
              </p>
            </div>
            <Separator />
            <div className="flex flex-col items-center justify-center py-16 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-4">
                <BellOff className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                All caught up!
              </h3>
              <p className="text-sm text-gray-500 max-w-xs text-center mt-1">
                You have no new notifications at the moment.
              </p>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* DELETE MODAL (Restored from previous step) */}
      <Dialog open={isDeleteOpen} onOpenChange={resetDeleteModal}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl bg-white gap-0">
          {deleteStep === 1 && (
            <div className="flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-rose-50 p-8 flex flex-col items-center text-center border-b border-rose-100">
                <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm ring-4 ring-rose-100">
                  <AlertTriangle className="h-7 w-7 text-rose-600" />
                </div>
                <DialogTitle className="text-2xl font-bold text-rose-950">
                  Delete this account?
                </DialogTitle>
                <DialogDescription className="text-rose-900/70 font-medium mt-2 max-w-xs mx-auto">
                  This will permanently delete your data, projects, and
                  settings.
                </DialogDescription>
              </div>
              <div className="p-6 bg-white space-y-4">
                <div className="text-sm text-gray-500 text-center leading-relaxed">
                  You are about to start a process that{" "}
                  <span className="font-bold text-gray-900">
                    cannot be undone
                  </span>
                  .
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={resetDeleteModal}
                    className="h-11 font-bold border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="h-11 font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200 rounded-xl transition-all active:scale-95"
                    onClick={() => setDeleteStep(2)}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}
          {deleteStep === 2 && (
            <div className="bg-white flex flex-col animate-in slide-in-from-right-8 duration-300">
              <div className="p-8 pb-0">
                <div className="flex items-center justify-between mb-1">
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    Security Check
                  </DialogTitle>
                  <Badge
                    variant="outline"
                    className="border-rose-200 text-rose-600 bg-rose-50 font-bold"
                  >
                    FINAL STEP
                  </Badge>
                </div>
                <DialogDescription className="text-gray-500 text-sm mt-2">
                  To confirm deletion, type{" "}
                  <span className="font-black text-black select-all">
                    DELETE ACCOUNT
                  </span>{" "}
                  below.
                </DialogDescription>
              </div>
              <div className="px-8 py-6">
                <div className="relative group">
                  <Input
                    value={deleteInput}
                    onChange={(e) =>
                      setDeleteInput(e.target.value.toUpperCase())
                    }
                    placeholder="DELETE ACCOUNT"
                    className="h-14 border-2 border-gray-200 focus-visible:ring-0 focus-visible:border-rose-500 focus-visible:bg-rose-50/30 font-mono text-center text-xl font-bold uppercase tracking-widest placeholder:text-gray-300 rounded-xl transition-all"
                    autoFocus
                  />
                  <div
                    className={`absolute right-4 top-4 transition-all duration-300 ${
                      deleteInput === "DELETE ACCOUNT"
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-50"
                    }`}
                  >
                    <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                      <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8 pt-0 flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setDeleteStep(1)}
                  disabled={isDeleting}
                  className="flex-1 h-11 font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
                >
                  Back
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleteInput !== "DELETE ACCOUNT" || isDeleting}
                  className="flex-[2] h-11 bg-rose-600 hover:bg-rose-700 font-bold text-white shadow-xl shadow-rose-100 disabled:opacity-50 disabled:shadow-none transition-all rounded-xl"
                >
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    "Permanently Delete"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
