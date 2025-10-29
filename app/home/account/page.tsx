"use client";
import { useAuthContext } from "@/app/stores/auth_store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { SiteHeader } from "../Header";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const user = useAuthContext((s) => s.user);
    const updateUser = useAuthContext((s) => s.updateUser);
    const changePassword = useAuthContext((s) => s.changePassword);
    const [tab, setTab] = useState("profile");
    const [formState, setFormState] = useState({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
    });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");
    const [pwState, setPwState] = useState({
        current_password: "",
        new_password: "",
    });
    const [pwLoading, setPwLoading] = useState(false);
    const [pwError, setPwError] = useState("");
    const [pwSuccess, setPwSuccess] = useState("");
    const router = useRouter();

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setEditError("");
        setEditSuccess("");
        try {
            await updateUser(formState);
            if (formState.email !== user.email) {
                router.push(`/verify/check?email=${encodeURIComponent(formState.email)}&redirect=/home/account`);
                return;
            }
            setEditSuccess("Profile updated!");
        } catch (err) {
            console.log(err)
            setEditError("Failed to update profile.");
        } finally {
            setEditLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPwLoading(true);
        setPwError("");
        setPwSuccess("");
        try {
            const res = await changePassword(pwState);
            if (res.success) {
                setPwSuccess("Password changed successfully!");
                setPwState({ current_password: "", new_password: "" });
            } else {
                setPwError(res.message || "Failed to change password.");
            }
        } catch {
            setPwError("Failed to change password.");
        } finally {
            setPwLoading(false);
        }
    };

    return (
        <>
            <SiteHeader title={"Account"} isSubscribed={user.is_subscribed} />
            <div className="p-8 bg-background dark:bg-background rounded-md">
                <Tabs value={tab} onValueChange={setTab} className="w-full max-w-xl">
                    <TabsList className="mb-4 bg-muted dark:bg-muted border border-border dark:border-border rounded-md">
                        <TabsTrigger value="profile" className="text-foreground dark:text-foreground">Edit Profile</TabsTrigger>
                        <TabsTrigger value="password" className="text-foreground dark:text-foreground">Change Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="first_name" className="text-foreground">First Name</Label>
                                <Input
                                    id="first_name"
                                    placeholder="First Name"
                                    value={formState.first_name}
                                    onChange={e => setFormState({ ...formState, first_name: e.target.value })}
                                    required
                                    className="bg-background text-foreground border-border"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="last_name" className="text-foreground">Last Name</Label>
                                <Input
                                    id="last_name"
                                    placeholder="Last Name"
                                    value={formState.last_name}
                                    onChange={e => setFormState({ ...formState, last_name: e.target.value })}
                                    required
                                    className="bg-background text-foreground border-border"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="email" className="text-foreground">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    value={formState.email}
                                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                                    required
                                    className="bg-background text-foreground border-border"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={editLoading} className="bg-primary text-primary-foreground">
                                    {editLoading ? "Saving..." : "Save Changes"}
                                </Button>
                                {editSuccess && <span className="text-green-600 dark:text-green-400">{editSuccess}</span>}
                                {editError && <span className="text-red-600 dark:text-red-400">{editError}</span>}
                            </div>
                            {formState.email !== user.email && (
                                <div className="text-xs text-muted-foreground mt-2">
                                    Changing your email will require OTP verification.
                                </div>
                            )}
                        </form>
                    </TabsContent>
                    <TabsContent value="password">
                        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="current_password" className="text-foreground">Current Password</Label>
                                <Input
                                    id="current_password"
                                    type="password"
                                    placeholder="Current Password"
                                    value={pwState.current_password}
                                    onChange={e => setPwState({ ...pwState, current_password: e.target.value })}
                                    required
                                    className="bg-background text-foreground border-border"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="new_password" className="text-foreground">New Password</Label>
                                <Input
                                    id="new_password"
                                    type="password"
                                    placeholder="New Password"
                                    value={pwState.new_password}
                                    onChange={e => setPwState({ ...pwState, new_password: e.target.value })}
                                    required
                                    className="bg-background text-foreground border-border"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={pwLoading} className="bg-primary text-primary-foreground">
                                    {pwLoading ? "Changing..." : "Change Password"}
                                </Button>
                                {pwSuccess && <span className="text-green-600 dark:text-green-400">{pwSuccess}</span>}
                                {pwError && <span className="text-red-600 dark:text-red-400">{pwError}</span>}
                            </div>
                        </form>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}