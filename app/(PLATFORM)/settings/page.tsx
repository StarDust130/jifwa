"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
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
  Moon,
  AlertTriangle,
  Check,
  ChevronRight,
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
  const searchParams = useSearchParams();

  const defaultTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) setActiveTab(tabFromUrl);
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await user.update({ firstName, lastName });
      router.refresh();
      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
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
      toast.success("Account deleted");
    } catch {
      setIsDeleting(false);
      toast.error("Deletion Failed");
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

  const onTabChange = (value: string) => {
    setActiveTab(value);
    router.replace(`/settings?tab=${value}`, { scroll: false });
  };

  const tabItems = [
    { value: "profile", icon: User, label: "Profile" },
    { value: "account", icon: Shield, label: "Account" },
    { value: "appearance", icon: Palette, label: "Appearance" },
    { value: "notifications", icon: Bell, label: "Notifications" },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6  mx-auto font-sans w-full max-w-[100vw] overflow-x-hidden">
      {/* HEADER */}
      <div className="mb-6 px-1">
        <h2 className="text-3xl font-bold tracking-tight text-primary">
          Settings
        </h2>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and preferences.
        </p>
      </div>

      <Separator className="my-4 lg:hidden" />

      {/* TABS CONTAINER */}
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="flex flex-col lg:flex-row gap-8"
      >
        {/* --- TABS LIST (FIXED FOR MOBILE SCROLL) --- */}
        <aside className="w-full lg:w-[250px] flex-shrink-0">
          <div className="lg:sticky lg:top-20">
            {/* Scroll Container */}
            <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:pb-0 lg:overflow-visible no-scrollbar">
              <TabsList className="flex flex-row lg:flex-col justify-start h-auto w-max lg:w-full bg-transparent p-0 gap-2">
                {tabItems.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="
                      flex items-center gap-2 px-4 py-3 lg:py-2.5 rounded-lg text-sm font-medium transition-all
                      border border-transparent whitespace-nowrap
                      text-muted-foreground 
                      hover:bg-muted/50 hover:text-foreground
                      data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:border-primary/10
                    "
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
        </aside>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 lg:max-w-3xl min-h-[500px]">
          {/* PROFILE TAB */}
          <TabsContent
            value="profile"
            className="space-y-8 m-0 animate-in fade-in slide-in-from-right-4 duration-500"
          >
            <div>
              <h3 className="text-lg font-bold text-primary">Profile</h3>
              <p className="text-sm text-muted-foreground">
                This is how others will see you on the site.
              </p>
            </div>
            <Separator className="hidden lg:block" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 py-4">
              <div
                className="relative group cursor-pointer shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg ring-1 ring-border">
                  <AvatarImage src={user.imageUrl} className="object-cover" />
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                    {user.firstName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-primary/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-[2px]">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={() => fileInputRef.current?.click()}
                  className="h-10 px-4 font-medium border-border hover:bg-primary hover:text-primary-foreground transition-colors"
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
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                  JPG, GIF or PNG. Max size 2MB.
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-xs font-bold text-primary uppercase tracking-wide"
                  >
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-white border-input h-12 focus-visible:ring-primary/20 focus-visible:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-xs font-bold text-primary uppercase tracking-wide"
                  >
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-white border-input h-12 focus-visible:ring-primary/20 focus-visible:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-bold text-primary uppercase tracking-wide"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground/70" />
                  <Input
                    id="email"
                    value={user.primaryEmailAddress?.emailAddress}
                    disabled
                    className="pl-11 bg-muted/30 border-transparent text-muted-foreground cursor-not-allowed h-12 font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end sm:justify-start">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 w-full sm:w-auto"
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

          {/* ACCOUNT TAB (Improved Delete UI) */}
          <TabsContent
            value="account"
            className="space-y-6 m-0 animate-in fade-in slide-in-from-right-4 duration-500"
          >
            <div>
              <h3 className="text-lg font-bold text-primary">Account</h3>
              <p className="text-sm text-muted-foreground">
                Update account settings.
              </p>
            </div>
            <Separator className="hidden lg:block" />

            {/* Danger Zone Card */}
            <div className="rounded-xl border border-red-200 overflow-hidden bg-white">
              <div className="bg-red-50/50 p-4 border-b border-red-100 flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-900 uppercase tracking-wider">
                    Danger Zone
                  </h4>
                  <p className="text-xs text-red-700 font-medium mt-0.5">
                    Irreversible actions. Proceed with caution.
                  </p>
                </div>
              </div>
              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h5 className="text-sm font-bold text-gray-900">
                    Delete Account
                  </h5>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">
                    Permanently remove your personal data, projects, and billing
                    information. This action cannot be undone.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-100 h-10 px-5 whitespace-nowrap rounded-lg"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* APPEARANCE TAB */}
          <TabsContent
            value="appearance"
            className="space-y-6 m-0 animate-in fade-in slide-in-from-right-4 duration-500"
          >
            <div>
              <h3 className="text-lg font-bold text-primary">Appearance</h3>
              <p className="text-sm text-muted-foreground">
                Customize the look and feel.
              </p>
            </div>
            <Separator className="hidden lg:block" />
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3 cursor-pointer group">
                <div className="relative h-32 rounded-xl bg-white border-2 border-primary p-3 flex items-center justify-center shadow-lg transition-transform group-hover:-translate-y-1">
                  <div className="w-full h-full bg-slate-50 rounded border border-slate-200 flex flex-col gap-2 p-2">
                    <div className="h-2 w-1/3 bg-slate-200 rounded"></div>
                    <div className="flex-1 bg-white border border-slate-100 rounded shadow-sm"></div>
                  </div>
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow-md">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                </div>
                <span className="text-sm font-bold block text-center text-primary">
                  Light
                </span>
              </div>

              <div className="relative space-y-3 opacity-60 cursor-not-allowed grayscale">
                <div className="relative h-32 rounded-xl bg-slate-900 border border-slate-800 p-3 flex items-center justify-center shadow-inner">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px] rounded-xl z-10">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-black font-bold text-[10px] tracking-widest uppercase"
                    >
                      Coming Soon
                    </Badge>
                  </div>
                </div>
                <span className="text-sm font-medium text-center text-muted-foreground flex items-center justify-center gap-2">
                  <Moon size={14} /> Dark
                </span>
              </div>
            </div>
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent
            value="notifications"
            className="space-y-6 m-0 animate-in fade-in slide-in-from-right-4 duration-500"
          >
            <div>
              <h3 className="text-lg font-bold text-primary">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Manage alerts and updates.
              </p>
            </div>
            <Separator className="hidden lg:block" />
            <div className="flex flex-col items-center justify-center py-20 bg-muted/30 border-2 border-dashed border-muted rounded-xl">
              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-border mb-4">
                <BellOff className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-primary">All caught up!</h3>
              <p className="text-sm text-muted-foreground max-w-xs text-center mt-1">
                You have no new notifications at the moment.
              </p>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={resetDeleteModal}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl bg-white gap-0">
          {deleteStep === 1 && (
            <div className="flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-red-50 p-8 flex flex-col items-center text-center border-b border-red-100">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm ring-4 ring-red-100">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Delete account?
                </DialogTitle>
                <DialogDescription className="text-gray-500 font-medium mt-2 max-w-xs mx-auto">
                  This will permanently delete your data, projects, and
                  settings.
                </DialogDescription>
              </div>
              <div className="p-6 bg-white space-y-4">
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={resetDeleteModal}
                    className="h-12 font-bold border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="h-12 font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 rounded-xl transition-all active:scale-95"
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
                    className="border-red-200 text-red-600 bg-red-50 font-bold"
                  >
                    FINAL STEP
                  </Badge>
                </div>
                <DialogDescription className="text-gray-500 text-sm mt-2">
                  Type{" "}
                  <span className="font-black text-gray-900 select-all">
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
                    className="h-14 border-2 border-gray-200 focus-visible:ring-0 focus-visible:border-red-500 focus-visible:bg-red-50/20 font-mono text-center text-xl font-bold uppercase tracking-widest placeholder:text-gray-300 rounded-xl transition-all"
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
                  className="flex-1 h-12 font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
                >
                  Back
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleteInput !== "DELETE ACCOUNT" || isDeleting}
                  className="flex-[2] h-12 bg-red-600 hover:bg-red-700 font-bold text-white shadow-xl shadow-red-200 disabled:opacity-50 disabled:shadow-none transition-all rounded-xl"
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
